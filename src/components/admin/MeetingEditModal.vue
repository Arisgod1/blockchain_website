<template>
  <BaseModal 
    :show="show" 
    :title="isCreate ? '新建例会' : '编辑例会'"
    size="lg"
    @update:show="$emit('update:show', $event)"
    @close="$emit('update:show', false)"
  >
    <form
      class="meeting-edit-form"
      @submit.prevent="handleSave"
    >
      <!-- 基本信息 -->
      <div class="form-section">
        <h3 class="section-title">
          基本信息
        </h3>
        
        <div class="form-row">
          <div class="form-group">
            <label for="title">例会标题 *</label>
            <BaseInput
              id="title"
              v-model="formData.title"
              type="text"
              placeholder="请输入例会标题"
              :error="errors.title"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="date">会议日期 *</label>
            <BaseInput
              id="date"
              v-model="formData.date"
              type="date"
              :error="errors.date"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="time">会议时间 *</label>
            <BaseInput
              id="time"
              v-model="formData.time"
              type="time"
              :error="errors.time"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="location">会议地点</label>
            <BaseInput
              id="location"
              v-model="formData.location"
              type="text"
              placeholder="请输入会议地点"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="recorder">记录人 *</label>
          <BaseInput
            id="recorder"
            v-model="formData.recorder"
            type="text"
            placeholder="请输入记录人姓名"
            :error="errors.recorder"
            required
          />
        </div>
      </div>

      <!-- 参与人员 -->
      <div class="form-section">
        <h3 class="section-title">
          参与人员
        </h3>
        
        <div class="attendees-section">
          <div class="attendees-input">
            <BaseInput
              v-model="newAttendee"
              type="text"
              placeholder="添加参与人员姓名"
              @keyup.enter="addAttendee"
            />
            <BaseButton 
              type="button"
              variant="secondary"
              @click="addAttendee"
            >
              添加
            </BaseButton>
          </div>
          
          <div
            v-if="formData.attendees.length > 0"
            class="attendees-list"
          >
            <span 
              v-for="(attendee, index) in formData.attendees"
              :key="index"
              class="attendee-tag"
            >
              {{ attendee }}
              <button 
                type="button"
                class="remove-btn"
                @click="removeAttendee(index)"
              >
                ×
              </button>
            </span>
          </div>
        </div>
      </div>

      <!-- 会议议程 -->
      <div class="form-section">
        <h3 class="section-title">
          会议议程
        </h3>
        
        <div class="agenda-section">
          <div class="agenda-input">
            <BaseInput
              v-model="newAgenda"
              type="text"
              placeholder="添加议程项目"
              @keyup.enter="addAgenda"
            />
            <BaseButton 
              type="button"
              variant="secondary"
              @click="addAgenda"
            >
              添加
            </BaseButton>
          </div>
          
          <ol
            v-if="formData.agenda.length > 0"
            class="agenda-list"
          >
            <li 
              v-for="(agendaItem, index) in formData.agenda"
              :key="index"
              class="agenda-item"
            >
              <span class="agenda-content">{{ agendaItem }}</span>
              <button 
                type="button"
                class="remove-btn"
                @click="removeAgenda(index)"
              >
                ×
              </button>
            </li>
          </ol>
        </div>
      </div>

      <!-- 会议内容 -->
      <div class="form-section">
        <h3 class="section-title">
          会议内容
        </h3>
        
        <div class="form-group">
          <label for="content">会议记录 *</label>
          <textarea
            id="content"
            v-model="formData.content"
            class="content-textarea"
            rows="6"
            placeholder="请详细记录会议讨论内容..."
            :error="errors.content"
            required
          />
        </div>
      </div>

      <!-- 会议决策 -->
      <div class="form-section">
        <h3 class="section-title">
          会议决策
        </h3>
        
        <div class="decisions-section">
          <div class="decisions-input">
            <BaseInput
              v-model="newDecision"
              type="text"
              placeholder="添加会议决策"
              @keyup.enter="addDecision"
            />
            <BaseButton 
              type="button"
              variant="secondary"
              @click="addDecision"
            >
              添加
            </BaseButton>
          </div>
          
          <ul
            v-if="formData.decisions.length > 0"
            class="decisions-list"
          >
            <li 
              v-for="(decision, index) in formData.decisions"
              :key="index"
              class="decision-item"
            >
              <span class="decision-content">{{ decision }}</span>
              <button 
                type="button"
                class="remove-btn"
                @click="removeDecision(index)"
              >
                ×
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- 行动项 -->
      <div class="form-section">
        <h3 class="section-title">
          行动项
        </h3>
        
        <div class="action-items-section">
          <div class="action-item-form">
            <div class="form-row">
              <div class="form-group">
                <label>任务描述</label>
                <BaseInput
                  v-model="newActionItem.description"
                  type="text"
                  placeholder="任务描述"
                />
              </div>
              
              <div class="form-group">
                <label>负责人</label>
                <BaseInput
                  v-model="newActionItem.assignee"
                  type="text"
                  placeholder="负责人"
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>截止日期</label>
                <BaseInput
                  v-model="newActionItem.dueDate"
                  type="date"
                />
              </div>
              
              <div class="form-group">
                <label>优先级</label>
                <select 
                  v-model="newActionItem.priority"
                  class="priority-select"
                >
                  <option value="low">
                    低
                  </option>
                  <option value="medium">
                    中
                  </option>
                  <option value="high">
                    高
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <BaseButton 
                  type="button"
                  variant="secondary"
                  @click="addActionItem"
                >
                  添加行动项
                </BaseButton>
              </div>
            </div>
          </div>
          
          <div
            v-if="formData.actionItems.length > 0"
            class="action-items-list"
          >
            <div 
              v-for="(item, index) in formData.actionItems"
              :key="index"
              class="action-item"
            >
              <div class="action-item-content">
                <div class="action-item-main">
                  <span class="action-description">{{ item.description }}</span>
                  <span class="action-meta">
                    {{ item.assignee }} | {{ formatDate(item.dueDate) }}
                  </span>
                </div>
                <div class="action-item-right">
                  <select 
                    v-model="item.status"
                    class="status-select"
                    @change="updateActionStatus(index, item.status)"
                  >
                    <option value="pending">
                      待办
                    </option>
                    <option value="in-progress">
                      进行中
                    </option>
                    <option value="completed">
                      已完成
                    </option>
                    <option value="overdue">
                      已逾期
                    </option>
                  </select>
                  
                  <select 
                    v-model="item.priority"
                    class="priority-select"
                    @change="updateActionPriority(index, item.priority)"
                  >
                    <option value="low">
                      低
                    </option>
                    <option value="medium">
                      中
                    </option>
                    <option value="high">
                      高
                    </option>
                  </select>
                  
                  <button 
                    type="button"
                    class="remove-btn"
                    @click="removeActionItem(index)"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他设置 -->
      <div class="form-section">
        <h3 class="section-title">
          其他设置
        </h3>
        
        <div class="form-group">
          <label class="checkbox-label">
            <input 
              v-model="formData.isPublic" 
              type="checkbox"
              class="checkbox-input"
            >
            <span class="checkbox-text">公开可见</span>
          </label>
        </div>
      </div>
    </form>

    <template #footer>
      <BaseButton 
        variant="secondary" 
        @click="$emit('update:show', false)"
      >
        取消
      </BaseButton>
      <BaseButton 
        variant="primary"
        :loading="saving"
        :disabled="!isFormValid"
        @click="handleSave"
      >
        {{ saving ? '保存中...' : '保存' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { BaseModal, BaseButton } from '@/components/common'
import { BaseInput } from '@/components/form'
import type { Meeting, ActionItem, MeetingStatus } from '@/types/entities'

interface Props {
  show: boolean
  meeting?: Meeting | null
  isCreate?: boolean
}

interface FormData {
  id?: string
  title: string
  date: string
  time: string
  location: string
  attendees: string[]
  agenda: string[]
  content: string
  decisions: string[]
  actionItems: ActionItem[]
  recorder: string
  isPublic: boolean
  summary?: string
  status?: MeetingStatus
  types?: string[]
  duration?: number
  tags?: string[]
  recording?: string
  minutes?: string
  attachments?: string[]
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'save', meeting: Meeting): void
}

const props = withDefaults(defineProps<Props>(), {
  isCreate: true,
  meeting: undefined
})

const emit = defineEmits<Emits>()

// 响应式数据
const createDefaultFormData = (): FormData => ({
  id: undefined,
  title: '',
  date: new Date().toISOString().split('T')[0],
  time: '14:00',
  location: '',
  attendees: [],
  agenda: [],
  content: '',
  decisions: [],
  actionItems: [],
  recorder: '',
  isPublic: true,
  summary: '',
  status: 'upcoming',
  types: [],
  duration: 60,
  tags: [],
  recording: '',
  minutes: '',
  attachments: []
})

const mapMeetingToFormData = (meeting: Meeting): FormData => {
  const attendees = (meeting.attendees ?? []).map(attendee =>
    typeof attendee === 'string' ? attendee : attendee.name
  )

  return {
    ...createDefaultFormData(),
    ...meeting,
    id: meeting.id,
    title: meeting.title ?? '',
    date: meeting.date ?? new Date().toISOString().split('T')[0],
    time: meeting.time ?? '14:00',
    location: meeting.location ?? '',
    attendees,
    agenda: meeting.agenda ?? [],
    content: meeting.content ?? '',
    decisions: meeting.decisions ?? [],
    actionItems: meeting.actionItems ?? [],
    recorder: meeting.recorder ?? '',
    isPublic: meeting.isPublic ?? true,
    summary: meeting.summary ?? '',
    status: meeting.status ?? 'upcoming',
    types: meeting.types ?? [],
    duration: meeting.duration ?? 60,
    tags: meeting.tags ?? [],
    recording: meeting.recording,
    minutes: meeting.minutes,
    attachments: meeting.attachments ?? []
  }
}

const formData = ref<FormData>(createDefaultFormData())

const errors = ref<Record<string, string>>({})
const saving = ref(false)

// 临时输入字段
const newAttendee = ref('')
const newAgenda = ref('')
const newDecision = ref('')
const newActionItem = ref<ActionItem>({
  id: '',
  description: '',
  assignee: '',
  dueDate: '',
  status: 'pending',
  priority: 'medium'
})

// 计算属性
const isFormValid = computed(() => {
  return formData.value.title.trim() !== '' &&
         formData.value.date !== '' &&
         formData.value.time !== '' &&
         formData.value.content.trim() !== '' &&
         formData.value.recorder.trim() !== ''
})

// 监听props变化，初始化表单数据
watch(() => props.meeting, (newMeeting) => {
  if (newMeeting && !props.isCreate) {
    formData.value = mapMeetingToFormData(newMeeting)
  } else if (props.isCreate) {
    resetForm()
  }
}, { immediate: true })

watch(() => props.show, (newShow) => {
  if (newShow) {
    if (props.meeting && !props.isCreate) {
      formData.value = mapMeetingToFormData(props.meeting)
    } else {
      resetForm()
    }
  }
})

// 方法
const resetForm = () => {
  formData.value = createDefaultFormData()
  errors.value = {}
  newAttendee.value = ''
  newAgenda.value = ''
  newDecision.value = ''
  newActionItem.value = {
    id: '',
    description: '',
    assignee: '',
    dueDate: '',
    status: 'pending',
    priority: 'medium'
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const addAttendee = () => {
  if (newAttendee.value.trim() && !formData.value.attendees.includes(newAttendee.value.trim())) {
    formData.value.attendees.push(newAttendee.value.trim())
    newAttendee.value = ''
  }
}

const removeAttendee = (index: number) => {
  formData.value.attendees.splice(index, 1)
}

const addAgenda = () => {
  if (newAgenda.value.trim()) {
    formData.value.agenda.push(newAgenda.value.trim())
    newAgenda.value = ''
  }
}

const removeAgenda = (index: number) => {
  formData.value.agenda.splice(index, 1)
}

const addDecision = () => {
  if (newDecision.value.trim()) {
    formData.value.decisions.push(newDecision.value.trim())
    newDecision.value = ''
  }
}

const removeDecision = (index: number) => {
  formData.value.decisions.splice(index, 1)
}

const addActionItem = () => {
  if (newActionItem.value.description.trim() && newActionItem.value.assignee.trim()) {
    const actionItem: ActionItem = {
      ...newActionItem.value,
      id: Date.now().toString(),
      dueDate: newActionItem.value.dueDate || new Date().toISOString().split('T')[0]
    }
    formData.value.actionItems.push(actionItem)
    newActionItem.value = {
      id: '',
      description: '',
      assignee: '',
      dueDate: '',
      status: 'pending',
      priority: 'medium'
    }
  }
}

const removeActionItem = (index: number) => {
  formData.value.actionItems.splice(index, 1)
}

const updateActionStatus = (index: number, status: ActionItem['status']) => {
  formData.value.actionItems[index].status = status
}

const updateActionPriority = (index: number, priority: ActionItem['priority']) => {
  formData.value.actionItems[index].priority = priority
}

const handleSave = async () => {
  if (!isFormValid.value) {
    errors.value = {
      title: formData.value.title ? '' : '请输入例会标题',
      date: formData.value.date ? '' : '请选择会议日期',
      time: formData.value.time ? '' : '请选择会议时间',
      content: formData.value.content ? '' : '请输入会议内容',
      recorder: formData.value.recorder ? '' : '请输入记录人'
    }
    return
  }

  saving.value = true

  try {
    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const resolvedId = props.isCreate
      ? Date.now().toString()
      : (formData.value.id ?? props.meeting?.id ?? Date.now().toString())

    const meeting: Meeting = {
      ...formData.value,
      id: resolvedId,
      attachments: formData.value.attachments ?? []
    }
    
    emit('save', meeting)
  } catch (error) {
    console.error('保存例会失败:', error)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.meeting-edit-form {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.content-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 120px;
}

.content-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 参与人员 */
.attendees-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.attendees-input .base-input {
  flex: 1;
}

.attendees-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.attendee-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: #f3f4f6;
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #374151;
}

.remove-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* 议程 */
.agenda-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.agenda-input .base-input {
  flex: 1;
}

.agenda-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.agenda-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.agenda-content {
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
}

/* 决策 */
.decisions-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.decisions-input .base-input {
  flex: 1;
}

.decisions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.decision-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f0f9ff;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  border-left: 4px solid #3b82f6;
}

.decision-content {
  flex: 1;
  font-size: 0.875rem;
  color: #1e40af;
}

/* 行动项 */
.action-item-form {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
}

.action-items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
}

.action-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.action-item-main {
  flex: 1;
}

.action-description {
  font-weight: 500;
  color: #1f2937;
  display: block;
  margin-bottom: 0.25rem;
}

.action-meta {
  font-size: 0.75rem;
  color: #6b7280;
}

.action-item-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-select,
.priority-select {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  background: white;
}

.status-select:focus,
.priority-select:focus {
  outline: none;
  border-color: #3b82f6;
}

/* 复选框 */
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
}

.checkbox-input:checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #374151;
}

/* 响应式 */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .attendees-input,
  .agenda-input,
  .decisions-input {
    flex-direction: column;
  }
  
  .action-item-content {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .action-item-right {
    justify-content: space-between;
  }
}
</style>