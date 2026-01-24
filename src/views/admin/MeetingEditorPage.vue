<template>
  <div class="admin-page editor-page">
    <BaseCard class="editor-card">
      <div class="page-header">
        <div>
          <h2>{{ isCreate ? '新建例会' : '编辑例会' }}</h2>
          <p class="page-subtitle">
            填写会议基本信息和记录，保存后返回列表
          </p>
        </div>
        <BaseButton
          variant="secondary"
          @click="goBack"
        >
          返回列表
        </BaseButton>
      </div>

      <div
        v-if="loading"
        class="loading-row"
      >
        <LoadingSpinner />
        <span>加载中...</span>
      </div>

      <form
        v-else
        class="form-grid"
        @submit.prevent="handleSubmit"
      >
        <div class="two-col">
          <label class="form-field">
            <span>标题</span>
            <input
              v-model="form.title"
              required
              class="text-input"
              placeholder="请输入会议标题"
            >
          </label>
         
        </div>

        <div class="two-col">
          <label class="form-field">
            <span>日期</span>
            <input
              v-model="form.meeting_date"
              type="date"
              required
              class="text-input"
            >
          </label>
          <label class="form-field">
            <span>时间</span>
            <input
              v-model="form.meeting_time"
              type="time"
              required
              class="text-input"
            >
          </label>
        </div>

        <label class="form-field">
          <span>地点</span>
          <input
            v-model="form.location"
            class="text-input"
            placeholder="线下地点或线上会议链接"
          >
        </label>

        <label class="form-field">
          <span>参与人员（逗号分隔）</span>
          <input
            v-model="form.attendeesText"
            class="text-input"
            placeholder="如：Alice,Bob,Carol"
          >
        </label>

       

        <label class="form-field">
          <span>会议内容</span>
          <textarea
            v-model="form.content"
            rows="8"
            required
            class="text-area"
            placeholder="记录会议讨论内容"
          />
        </label>

       

        <div class="form-actions">
          <BaseButton
            type="button"
            variant="secondary"
            @click="goBack"
          >
            取消
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            :loading="saving"
          >
            {{ isCreate ? '创建' : '保存' }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { getMeeting, createMeeting, updateMeeting } from '@/api/meeting'
import type { Meeting, AdminAction } from '@/types/entities'
import { recordAdminOperation } from '@/composables/useAdminLogs'
import { dispatchAdminRefresh } from '@/utils/adminEvents'

const route = useRoute()
const router = useRouter()

const id = route.params.id as string | undefined
const isCreate = !id
const loading = ref(false)
const saving = ref(false)

type MeetingForm = {
  title: string
  recorder: string
  meeting_date: string
  meeting_time: string
  location: string
  attendeesText: string
  agendaText: string
  content: string
  decisionsText: string
  attachments: string[]
  tags: string[]
  files: Meeting['files']
  actionItems: Meeting['actionItems']
  issues: Meeting['issues']
}

const today = () => new Date().toISOString().slice(0, 10)

const form = reactive<MeetingForm>({
  title: '',
  recorder: '',
  meeting_date: today(),
  meeting_time: '14:00',
  location: '',
  attendeesText: '',
  agendaText: '',
  content: '',
  decisionsText: '',
  attachments: [],
  tags: [],
  files: [],
  actionItems: [],
  issues: []
})

const logMeetingAction = (action: AdminAction, message: string, result: 'success' | 'failure' = 'success', targetId?: string | number) => {
  recordAdminOperation({ entity: 'meetings', action, message, result, targetId }).catch(() => {})
}

const normalizeMeeting = (meeting: Meeting) => {
  form.title = meeting.title ?? ''
  form.recorder = meeting.recorder ?? ''
  // meetingTime 拆分为 meeting_date 和 meeting_time
  if (meeting.meetingTime) {
    const separator = meeting.meetingTime.includes('T') ? 'T' : ' '
    const [date, time] = meeting.meetingTime.split(separator)
    form.meeting_date = date || today()
    form.meeting_time = (time || '14:00:00').replace('Z', '')
  } else if (meeting.meeting_time) {
    const meetingDate = (meeting as { meeting_date?: string }).meeting_date
    form.meeting_date = meetingDate || today()
    form.meeting_time = meeting.meeting_time
  } else {
    form.meeting_date = today()
    form.meeting_time = '14:00:00'
  }
  form.location = meeting.location ?? ''
  form.attendeesText = (meeting.attendees ?? []).map((a) => (typeof a === 'string' ? a : a.name)).join(', ')
  form.agendaText = (meeting.agenda ?? []).join(', ')
  form.content = meeting.content ?? ''
  form.decisionsText = (meeting.decisions ?? []).join(', ')
}

onMounted(async () => {
  if (!isCreate && id) {
    loading.value = true
    try {
      const res = await getMeeting(id)
      if (res) normalizeMeeting(res)
      logMeetingAction('refresh', `加载例会 ${id}`)
    } catch (error) {
      logMeetingAction('refresh', `加载例会 ${id} 失败`, 'failure', id)
    } finally {
      loading.value = false
    }
  }
})

const handleSubmit = async () => {
  saving.value = true
  const attendees = form.attendeesText?.trim()
    ? form.attendeesText.split(',').map((s) => s.trim()).filter(Boolean)
    : []
  const agenda = form.agendaText?.trim()
    ? form.agendaText.split(',').map((s) => s.trim()).filter(Boolean)
    : []
  const decisions = form.decisionsText?.trim()
    ? form.decisionsText.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  // meetingTime 合并 meeting_date 和 meeting_time，格式 yyyy-MM-ddTHH:mm:ss（Spring Boot 默认）
  const timeStr = form.meeting_time.length === 5 ? form.meeting_time + ':00' : form.meeting_time
  const meetingTime = `${form.meeting_date}T${timeStr}`
  const payload: Partial<Meeting> = {
    title: form.title,
    recorder: form.recorder,
    meetingTime,
    meeting_time: timeStr,
    location: form.location,
    attendees,
    agenda,
    content: form.content,
    summary: form.content ? form.content.slice(0, 120) : '',
    decisions,
    attachments: form.attachments,

  }

  // 更新时附带 id，保证请求体完整
  if (!isCreate && id) {
    payload.id = id
  }

  try {
    if (isCreate) {
      const created = await createMeeting(payload)
      logMeetingAction('create', `创建例会「${created.title ?? form.title}」`, 'success', created.id)
      dispatchAdminRefresh({ entity: 'meetings', action: 'refresh' })
      router.push({ name: 'AdminMeetings' })
    } else if (id) {
      const updated = await updateMeeting(id, payload)
      logMeetingAction('update', `更新例会「${updated.title ?? form.title}」`, 'success', id)
      dispatchAdminRefresh({ entity: 'meetings', action: 'refresh' })
      router.push({ name: 'AdminMeetings' })
    }
  } catch (error) {
    logMeetingAction(isCreate ? 'create' : 'update', `保存例会「${form.title || '未命名例会'}」失败`, 'failure', id)
    alert('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push({ name: 'AdminDashboard' })
}
</script>

<style scoped>
.admin-page.editor-page { padding: 1.5rem; }
.editor-card { max-width: 960px; margin: 0 auto; }
.page-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.page-subtitle { margin: 0.25rem 0 0; color: #6b7280; font-size: 0.95rem; }
.loading-row { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 0; }
.form-grid { display: flex; flex-direction: column; gap: 1rem; }
.form-field { display: flex; flex-direction: column; gap: 0.5rem; }
.text-input, .text-area { width: 100%; border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.65rem 0.75rem; font-size: 1rem; }
.text-area { resize: vertical; }
.two-col { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
</style>
