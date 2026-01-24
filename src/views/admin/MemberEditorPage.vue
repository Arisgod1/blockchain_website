<template>
  <div class="admin-page editor-page">
    <BaseCard class="editor-card">
      <div class="page-header">
        <div>
          <h2>{{ isCreate ? '新建成员' : '编辑成员' }}</h2>
          <p class="page-subtitle">
            填写成员信息，保存后返回成员列表
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
        <label class="form-field">
          <span>姓名</span>
          <input
            v-model="form.name"
            required
            class="text-input"
            placeholder="请输入姓名"
          >
        </label>

        <div class="two-col">
          <label class="form-field">
            <span>角色</span>
            <input
              v-model="form.role"
              required
              class="text-input"
              placeholder="如：开发 / 研究"
            >
          </label>
          <label class="form-field">
            <span>是否活跃</span>
            <select
              v-model="form.isActive"
              class="text-input"
            >
              <option :value="true">活跃</option>
              <option :value="false">非活跃</option>
            </select>
          </label>
        </div>

        <label class="form-field">
          <span>技能（逗号分隔）</span>
          <input
            v-model="form.skillsText"
            class="text-input"
            placeholder="Solidity, Rust, 产品"
          >
        </label>

        <label class="form-field">
          <span>简介</span>
          <textarea
            v-model="form.bio"
            rows="5"
            class="text-area"
            placeholder="成员简介"
          />
        </label>

        <div class="two-col">
          <label class="form-field">
            <span>邮箱</span>
            <input
              v-model="form.email"
              type="email"
              class="text-input"
              placeholder="可选"
            >
          </label>
          <label class="form-field">
            <span>GitHub</span>
            <input
              v-model="form.github"
              class="text-input"
              placeholder="https://github.com/username"
            >
          </label>
        </div>

        <label class="form-field">
          <span>头像</span>
          <div class="avatar-field">
            <div class="avatar-preview" v-if="previewAvatar">
              <img
                :src="previewAvatar"
                :key="previewAvatar"
                :alt="form.name || '头像预览'"
                @error="onAvatarError"
              >
            </div>
            <div class="avatar-controls">
              <input
                v-model="form.avatar"
                class="text-input"
                placeholder="头像 URL（上传后自动填写）"
              >
              <div class="upload-row">
                <input
                  ref="avatarFileInput"
                  type="file"
                  accept="image/*"
                  class="hidden-file"
                  @change="handleAvatarFileChange"
                >
                <BaseButton
                  type="button"
                  variant="secondary"
                  :loading="uploadingAvatar"
                  @click="triggerAvatarUpload"
                >
                  上传头像
                </BaseButton>
                <p class="helper-text">支持 png / jpg，上传成功后会填充上方链接</p>
              </div>
            </div>
          </div>
        </label>

        <label class="form-field">
          <span>加入日期</span>
          <input
            v-model="form.joinDate"
            type="date"
            required
            class="text-input"
          >
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
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { getMember, createMember, updateMember } from '@/api/member'
import type { Member, AdminAction } from '@/types/entities'
import { recordAdminOperation } from '@/composables/useAdminLogs'
import { uploadFile } from '@/api/file'
import defaultAvatar from '@/assets/zhaoshuyang.png'

const route = useRoute()
const router = useRouter()

const id = route.params.id as string | undefined
const isCreate = !id
const loading = ref(false)
const saving = ref(false)

type MemberForm = {
  name: string
  role: string
  skillsText: string
  bio: string
  email: string
  github: string
  joinDate: string
  isActive: boolean
  avatar: string
}

const today = () => new Date().toISOString().slice(0, 10)

const form = reactive<MemberForm>({
  name: '',
  role: '',
  skillsText: '',
  bio: '',
  email: '',
  github: '',
  joinDate: today(),
  isActive: true,
  avatar: ''
})
const avatarFileInput = ref<HTMLInputElement | null>(null)
const uploadingAvatar = ref(false)
const previewAvatar = computed(() => normalizeAvatarUrl(form.avatar))

const logMemberAction = (action: AdminAction, message: string, result: 'success' | 'failure' = 'success', targetId?: string | number) => {
  recordAdminOperation({ entity: 'members', action, message, result, targetId }).catch(() => {})
}

const normalizeAvatarUrl = (value?: string) => {
  const trimmed = (value || '').trim()
  if (!trimmed) return ''
  const cleaned = trimmed.replace(/\\/g, '/').replace(/^\/+/, '')
  if (/^https?:\/\//i.test(cleaned)) return cleaned
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082').replace(/\/+$/, '')
  return base ? `${base}/${cleaned}` : `/${cleaned}`
}

const normalizeMember = (member: Member) => {
  form.name = member.name ?? ''
  form.role = member.role ?? ''
  form.skillsText = (member.skills ?? []).join(', ')
  form.bio = member.bio ?? ''
  form.email = member.email ?? ''
  form.github = member.github ?? ''
  form.joinDate = member.joinDate ?? today()
  form.isActive = member.isActive ?? true
  form.avatar = normalizeAvatarUrl(member.avatar ?? (member as Member & { avatarUrl?: string }).avatarUrl)
}

onMounted(async () => {
  if (!isCreate && id) {
    loading.value = true
    try {
      const res = await getMember(id)
      if (res) normalizeMember(res)
      logMemberAction('refresh', `加载成员 ${id}`)
    } catch (error) {
      logMemberAction('refresh', `加载成员 ${id} 失败`, 'failure', id)
    } finally {
      loading.value = false
    }
  }
})

const handleSubmit = async () => {
  saving.value = true
  const skills = form.skillsText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const payload: Partial<Member> = {
    name: form.name,
    role: form.role,
    skills,
    bio: form.bio,
    email: form.email,
    github: form.github,
    joinDate: form.joinDate,
    isActive: form.isActive,
    avatar: normalizeAvatarUrl(form.avatar),
    // 兼容可能需要 avatarUrl 字段的后端
    avatarUrl: normalizeAvatarUrl(form.avatar)
    
  }

  if (!isCreate && id) {
    payload.id = id
  }

  try {
    if (isCreate) {
      const created = await createMember(payload)
      logMemberAction('create', `创建成员「${created.name ?? form.name}」`, 'success', created.id)
    } else if (id) {
      const updated = await updateMember(id, payload)
      logMemberAction('update', `更新成员「${updated.name ?? form.name}」`, 'success', id)
    }
    goBack()
  } catch (error) {
    logMemberAction(isCreate ? 'create' : 'update', `保存成员「${form.name || '未命名成员'}」失败`, 'failure', id)
    alert('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push({ name: 'AdminMembers' })
}

const triggerAvatarUpload = () => {
  avatarFileInput.value?.click()
}

const onAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultAvatar
}

const handleAvatarFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('请上传图片格式的文件')
    input.value = ''
    return
  }

  uploadingAvatar.value = true
  try {
    const uploaded = await uploadFile(file)
    form.avatar = normalizeAvatarUrl(uploaded.filePath)
  } catch (error) {
    console.error('上传头像失败:', error)
    alert('上传头像失败，请稍后重试')
  } finally {
    uploadingAvatar.value = false
    input.value = ''
  }
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
.avatar-field { display: flex; gap: 1rem; align-items: flex-start; flex-wrap: wrap; }
.avatar-preview { width: 96px; height: 96px; border-radius: 9999px; overflow: hidden; border: 3px solid #e5e7eb; }
.avatar-preview img { width: 100%; height: 100%; object-fit: cover; }
.avatar-controls { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.upload-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.helper-text { margin: 0; color: #6b7280; font-size: 0.9rem; }
.hidden-file { display: none; }
</style>
