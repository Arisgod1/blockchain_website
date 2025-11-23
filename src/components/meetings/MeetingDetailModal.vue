<template>
  <Teleport to="body">
    <div 
      class="meeting-detail-modal"
      :class="{ 'is-open': isOpen }"
      @click="handleBackdropClick"
    >
      <div 
        class="modal-content"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
        @click.stop
      >
        <!-- 模态框头部 -->
        <div class="modal-header">
          <div class="header-content">
            <h2
              id="modal-title"
              class="modal-title"
            >
              {{ meeting?.title || '会议详情' }}
            </h2>
            <div class="meeting-meta">
              <div class="meta-item">
                <svg
                  class="meta-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                {{ formatDate(meeting?.date) }}
              </div>
              <div class="meta-item">
                <svg
                  class="meta-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.7C16,17.4 15.4,18 14.7,18H9.3C8.6,18 8,17.4 8,16.7V12.7C8,12.1 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z" />
                </svg>
                {{ formatDuration(meeting?.duration) }}
              </div>
              <div class="meta-item">
                <svg
                  class="meta-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {{ getStatusText(meeting?.status) }}
              </div>
            </div>
          </div>
          
          <!-- 关闭按钮 -->
          <button 
            class="modal-close"
            aria-label="关闭详情"
            @click="handleClose"
          >
            <svg
              class="close-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <!-- 模态框内容 -->
        <div class="modal-body">
          <!-- 标签 -->
          <div
            v-if="meeting?.tags && meeting.tags.length > 0"
            class="tags-section"
          >
            <div class="tags-title">
              会议标签
            </div>
            <div class="tags-list">
              <span 
                v-for="tag in meeting.tags" 
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 会议摘要 -->
          <div
            v-if="meeting?.summary"
            class="summary-section"
          >
            <h3 class="section-title">
              会议摘要
            </h3>
            <p class="summary-text">
              {{ meeting.summary }}
            </p>
          </div>

          <!-- 会议详情 -->
          <div class="details-grid">
            <!-- 参与者 -->
            <div
              v-if="normalizedAttendees.length > 0"
              class="detail-section"
            >
              <h3 class="section-title">
                参与者 ({{ normalizedAttendees.length }}人)
              </h3>
              <div class="attendees-list">
                <div 
                  v-for="attendee in normalizedAttendees" 
                  :key="attendee.id"
                  class="attendee-item"
                >
                  <div class="attendee-avatar">
                    <img 
                      v-if="attendee.avatar" 
                      :src="attendee.avatar" 
                      :alt="attendee.name"
                      @error="handleAvatarError"
                    >
                    <div
                      v-else
                      class="avatar-placeholder"
                    >
                      {{ getInitials(attendee.name) }}
                    </div>
                  </div>
                  <div class="attendee-info">
                    <div class="attendee-name">
                      {{ attendee.name }}
                    </div>
                    <div
                      v-if="attendee.role"
                      class="attendee-role"
                    >
                      {{ attendee.role }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 会议议题 -->
            <div
              v-if="meeting?.issues && meeting.issues.length > 0"
              class="detail-section"
            >
              <h3 class="section-title">
                会议议题 ({{ meeting.issues.length }}项)
              </h3>
              <div class="issues-list">
                <div 
                  v-for="issue in meeting.issues" 
                  :key="issue.id"
                  class="issue-item"
                >
                  <div
                    class="issue-status"
                    :class="`status-${issue.status}`"
                  >
                    <svg
                      class="status-icon"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        v-if="issue.status === 'completed'"
                        d="M12,2C6.48,2 2,6.48 2,12s4.48,10 10,10s10,-4.48 10,-10S17.52,2 12,2zM10,17l-5,-5l1.41,-1.41L10,14.17l7.59,-7.59L19,8L10,17z"
                      />
                      <path
                        v-else-if="issue.status === 'in-progress'"
                        d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,6H13V12H11V6M11,14H13V16H11V14Z"
                      />
                      <path
                        v-else
                        d="M12,2C6.48,2 2,6.48 2,12s4.48,10 10,10s10,-4.48 10,-10S17.52,2 12,2zM12,20c-4.41,0 -8,-3.59 -8,-8s3.59,-8 8,-8s8,3.59 8,8S16.41,20 12,20zM12,6c-3.31,0 -6,2.69 -6,6s2.69,6 6,6s6,-2.69 6,-6S15.31,6 12,6z"
                      />
                    </svg>
                  </div>
                  <div class="issue-content">
                    <div class="issue-title">
                      {{ issue.title }}
                    </div>
                    <div class="issue-status-text">
                      {{ getIssueStatusText(issue.status) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 会议文件 -->
            <div
              v-if="meeting?.files && meeting.files.length > 0"
              class="detail-section"
            >
              <h3 class="section-title">
                会议文件 ({{ meeting.files.length }}个)
              </h3>
              <div class="files-list">
                <div 
                  v-for="file in meeting.files" 
                  :key="file.id"
                  class="file-item"
                  @click="handleFileClick(file)"
                >
                  <div class="file-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path :d="getFileIcon(file.type)" />
                    </svg>
                  </div>
                  <div class="file-info">
                    <div class="file-name">
                      {{ file.name }}
                    </div>
                    <div class="file-meta">
                      <span class="file-type">{{ getFileTypeText(file.type) }}</span>
                      <span class="file-size">{{ file.size }}</span>
                    </div>
                  </div>
                  <div class="file-action">
                    <svg
                      class="action-icon"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 16l-6-6h12z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- 会议地点 -->
            <div
              v-if="meeting?.location"
              class="detail-section"
            >
              <h3 class="section-title">
                会议地点
              </h3>
              <div class="location-info">
                <svg
                  class="location-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {{ meeting.location }}
              </div>
            </div>
          </div>
        </div>

        <!-- 模态框底部 -->
        <div class="modal-footer">
          <div class="footer-actions">
            <!-- 查看记录 -->
            <button 
              v-if="meeting?.recording"
              class="action-btn action-secondary"
              @click="handleViewRecording"
            >
              <svg
                class="btn-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              查看会议记录
            </button>

            <!-- 查看纪要 -->
            <button 
              v-if="meeting?.minutes"
              class="action-btn action-secondary"
              @click="handleViewMinutes"
            >
              <svg
                class="btn-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              查看详细纪要
            </button>

            <!-- 查看文件 -->
            <button 
              v-if="meeting?.files && meeting.files.length > 0"
              class="action-btn action-primary"
              @click="handleViewFiles"
            >
              <svg
                class="btn-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              查看所有文件 ({{ meeting.files.length }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Meeting, MeetingAttendee, MeetingFile } from '@/types/entities'

interface Props {
  meeting: Meeting | null
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'view-files', meeting: Meeting): void
  (e: 'view-recording', meeting: Meeting): void
}

const props = withDefaults(defineProps<Props>(), {
  meeting: null,
  isOpen: false
})

const emit = defineEmits<Emits>()
const normalizedAttendees = computed<MeetingAttendee[]>(() => {
  if (!props.meeting?.attendees) return []
  return props.meeting.attendees.map(attendee => {
    if (typeof attendee === 'string') {
      return {
        id: attendee,
        name: attendee,
        avatar: '/images/default-avatar.png'
      }
    }
    return attendee
  })
})

// 方法
const handleClose = () => {
  emit('close')
}

const handleBackdropClick = () => {
  emit('close')
}

const handleFileClick = (file: MeetingFile) => {
  // 打开文件
  if (file.url) {
    window.open(file.url, '_blank')
  }
}

const handleViewFiles = () => {
  if (props.meeting) {
    emit('view-files', props.meeting)
  }
}

const handleViewRecording = () => {
  if (props.meeting) {
    emit('view-recording', props.meeting)
  }
}

const handleViewMinutes = () => {
  if (props.meeting?.minutes) {
    window.open(props.meeting.minutes, '_blank')
  }
}

const handleAvatarError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDuration = (minutes?: number): string => {
  if (!minutes) return ''
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}小时${mins > 0 ? `${mins}分钟` : ''}`
  }
  return `${mins}分钟`
}

const getStatusText = (status?: string): string => {
  const statusMap = {
    completed: '已完成',
    'in-progress': '进行中',
    pending: '待处理',
    cancelled: '已取消',
    upcoming: '即将开始',
    ongoing: '进行中',
    draft: '草稿'
  }
  if (!status) return '状态未知'
  return statusMap[status as keyof typeof statusMap] || status
}

const getIssueStatusText = (status: string): string => {
  const statusMap = {
    completed: '已完成',
    'in-progress': '进行中',
    pending: '待处理'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getFileTypeText = (type: string): string => {
  const typeMap = {
    'pdf': 'PDF文档',
    'docx': 'Word文档',
    'pptx': 'PowerPoint演示',
    'xlsx': 'Excel表格',
    'zip': '压缩文件',
    'mp4': '视频文件',
    'mp3': '音频文件'
  }
  return typeMap[type as keyof typeof typeMap] || type.toUpperCase()
}

const getFileIcon = (type: string): string => {
  const iconMap = {
    'pdf': 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z',
    'docx': 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z',
    'pptx': 'M3,13H21V11H3M3,17H21V15H3M3,9H21V7H3V9Z',
    'xlsx': 'M3,3H21V21H3V3M6.5,6H8V8H6.5V6M6.5,10H8V12H6.5V10M6.5,14H8V16H6.5V14M9.5,6H11V8H9.5V6M9.5,10H11V12H9.5V10M9.5,14H11V16H9.5V14M12.5,6H14V8H12.5V6M12.5,10H14V12H12.5V10M12.5,14H14V16H12.5V14M15.5,6H17V8H15.5V6M15.5,10H17V12H15.5V10M15.5,14H17V16H15.5V14Z',
    'zip': 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z',
    'mp4': 'M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z',
    'mp3': 'M12,3V13.55C11.41,13.21 10.73,13 10,13C7.79,13 6,14.79 6,17S7.79,21 10,21 14,19.21 14,17V7H18V3H12Z'
  }
  return iconMap[type as keyof typeof iconMap] || 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z'
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// 监听窗口大小变化
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* 模态框基础样式 */
.meeting-detail-modal {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4
         bg-black bg-opacity-50 opacity-0 pointer-events-none
         transition-all duration-300;
}

.meeting-detail-modal.is-open {
  @apply opacity-100 pointer-events-auto;
}

/* 模态框内容 */
.modal-content {
  @apply bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh]
         flex flex-col transform scale-95 transition-all duration-300;
}

.meeting-detail-modal.is-open .modal-content {
  @apply scale-100;
}

.modal-header {
  @apply flex items-start justify-between p-6 border-b border-gray-200;
}

.header-content {
  @apply flex-1;
}

.modal-title {
  @apply text-2xl font-bold text-gray-900 mb-2;
}

.meeting-meta {
  @apply flex flex-wrap gap-4;
}

.meta-item {
  @apply flex items-center text-sm text-gray-600;
}

.meta-icon {
  @apply w-4 h-4 mr-1;
}

/* 关闭按钮 */
.modal-close {
  @apply p-2 text-gray-400 hover:text-gray-600 rounded-lg
         hover:bg-gray-100 transition-colors duration-200;
}

.close-icon {
  @apply w-6 h-6;
}

/* 模态框主体 */
.modal-body {
  @apply flex-1 overflow-y-auto p-6 space-y-6;
}

/* 标签 */
.tags-section {
  @apply flex flex-col;
}

.tags-title {
  @apply text-sm font-medium text-gray-700 mb-2;
}

.tags-list {
  @apply flex flex-wrap gap-2;
}

.tag {
  @apply px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full;
}

/* 摘要 */
.summary-section {
  @apply flex flex-col;
}

.summary-text {
  @apply text-gray-700 leading-relaxed;
}

/* 详情网格 */
.details-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.detail-section {
  @apply flex flex-col;
}

.section-title {
  @apply text-lg font-semibold text-gray-900 mb-3;
}

/* 参与者 */
.attendees-list {
  @apply space-y-3;
}

.attendee-item {
  @apply flex items-center space-x-3;
}

.attendee-avatar {
  @apply relative w-10 h-10 rounded-full overflow-hidden bg-gray-200;
}

.attendee-avatar img {
  @apply w-full h-full object-cover;
}

.avatar-placeholder {
  @apply w-full h-full flex items-center justify-center
         bg-blue-500 text-white text-sm font-medium;
}

.attendee-info {
  @apply flex-1 min-w-0;
}

.attendee-name {
  @apply text-sm font-medium text-gray-900;
}

.attendee-role {
  @apply text-xs text-gray-600;
}

/* 议题 */
.issues-list {
  @apply space-y-3;
}

.issue-item {
  @apply flex items-start space-x-3 p-3 bg-gray-50 rounded-lg;
}

.issue-status {
  @apply flex-shrink-0 w-5 h-5 mt-0.5;
}

.status-completed .status-icon {
  @apply text-green-500;
}

.status-in-progress .status-icon {
  @apply text-yellow-500;
}

.status-pending .status-icon {
  @apply text-gray-400;
}

.issue-content {
  @apply flex-1 min-w-0;
}

.issue-title {
  @apply text-sm font-medium text-gray-900;
}

.issue-status-text {
  @apply text-xs text-gray-600 mt-1;
}

/* 文件 */
.files-list {
  @apply space-y-2;
}

.file-item {
  @apply flex items-center space-x-3 p-3 border border-gray-200
         rounded-lg cursor-pointer hover:bg-gray-50
         transition-colors duration-200;
}

.file-icon {
  @apply flex-shrink-0 w-8 h-8 text-gray-400;
}

.file-info {
  @apply flex-1 min-w-0;
}

.file-name {
  @apply text-sm font-medium text-gray-900 truncate;
}

.file-meta {
  @apply flex items-center space-x-2 text-xs text-gray-600 mt-1;
}

.file-type {
  @apply px-2 py-0.5 bg-gray-100 rounded;
}

.file-action {
  @apply flex-shrink-0 w-5 h-5 text-gray-400;
}

/* 地点 */
.location-info {
  @apply flex items-center space-x-2 text-sm text-gray-700;
}

.location-icon {
  @apply w-5 h-5;
}

/* 模态框底部 */
.modal-footer {
  @apply flex items-center justify-end space-x-3 p-6 border-t border-gray-200;
}

.footer-actions {
  @apply flex flex-wrap gap-3;
}

.action-btn {
  @apply flex items-center space-x-2 px-4 py-2 rounded-lg
         font-medium transition-colors duration-200;
}

.action-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.action-secondary {
  @apply border border-gray-300 text-gray-700 hover:bg-gray-50;
}

.btn-icon {
  @apply w-4 h-4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .meeting-detail-modal {
    @apply p-2;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    @apply p-4;
  }
  
  .modal-title {
    @apply text-xl;
  }
  
  .meeting-meta {
    @apply flex-col space-y-1;
  }
  
  .details-grid {
    @apply grid-cols-1;
  }
  
  .footer-actions {
    @apply flex-col space-y-2;
  }
  
  .action-btn {
    @apply w-full justify-center;
  }
}

/* 暗色主题 */
@media (prefers-color-scheme: dark) {
  .meeting-detail-modal {
    @apply bg-black bg-opacity-70;
  }
  
  .modal-content {
    @apply bg-gray-800;
  }
  
  .modal-header,
  .modal-footer {
    @apply border-gray-700;
  }
  
  .modal-title,
  .section-title,
  .attendee-name,
  .issue-title,
  .file-name {
    @apply text-white;
  }
  
  .meta-item,
  .attendee-role,
  .issue-status-text,
  .file-meta {
    @apply text-gray-300;
  }
  
  .summary-text {
    @apply text-gray-300;
  }
  
  .issue-item {
    @apply bg-gray-700;
  }
  
  .file-item {
    @apply border-gray-600 hover:bg-gray-700;
  }
  
  .file-type {
    @apply bg-gray-600 text-gray-300;
  }
  
  .avatar-placeholder {
    @apply bg-blue-600;
  }
  
  .action-secondary {
    @apply border-gray-600 text-gray-300 hover:bg-gray-700;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .modal-content {
    @apply border-2 border-gray-800;
  }
  
  .file-item,
  .issue-item {
    @apply border-2;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .meeting-detail-modal,
  .modal-content {
    @apply transition-none;
  }
}
</style>