<template>
  <div 
    class="meeting-card"
    :class="[
      `meeting-card-${viewMode}`,
      { 'is-hovered': isHovered }
    ]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handleCardClick"
  >
    <!-- 会议卡片头部 -->
    <div class="meeting-card-header">
      <div class="meeting-date-info">
        <div class="date-main">
          {{ formatDate(meeting.date) }}
        </div>
        <div class="date-sub">
          {{ getRelativeTime(meeting.date) }}
        </div>
      </div>
      <div class="meeting-status">
        <span 
          class="status-badge"
          :class="`status-${(meeting.status ?? 'upcoming').toLowerCase()}`"
        >
          {{ getStatusText(meeting.status) }}
        </span>
      </div>
    </div>

    <!-- 会议标题和类型 -->
    <div class="meeting-title-section">
      <h3 class="meeting-title">
        {{ meeting.title }}
      </h3>
      <div class="meeting-type-tags">
        <span 
          v-for="type in meeting.types ?? []" 
          :key="type"
          class="type-tag"
        >
          {{ getTypeText(type) }}
        </span>
      </div>
    </div>

    <!-- 会议内容预览 -->
    <div class="meeting-content">
      <p class="meeting-summary">
        {{ meeting.summary || '暂无会议摘要' }}
      </p>
      
      <!-- 参与人员 -->
      <div
        v-if="meeting.attendees"
        class="meeting-attendees"
      >
        <div class="attendees-avatar-list">
          <img
            v-for="attendee in normalizedAttendees.slice(0, 5)"
            :key="attendee.id"
            :src="attendee.avatar || '/images/default-avatar.png'"
            :alt="attendee.name"
            class="attendee-avatar"
            :title="attendee.name"
          >
          <div 
            v-if="normalizedAttendees.length > 5"
            class="attendee-more"
            :title="`还有 ${normalizedAttendees.length - 5} 人参与`"
          >
            +{{ normalizedAttendees.length - 5 }}
          </div>
        </div>
        <span class="attendees-count">
          {{ normalizedAttendees.length }} 人参与
        </span>
      </div>
    </div>

    <!-- 会议统计信息 -->
    <div class="meeting-stats">
      <div class="stat-item">
        <svg
          class="stat-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        <span class="stat-text">{{ meeting.issues?.length || 0 }} 议题</span>
      </div>
      <div class="stat-item">
        <svg
          class="stat-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
        <span class="stat-text">{{ meeting.files?.length || 0 }} 文件</span>
      </div>
      <div class="stat-item">
        <svg
          class="stat-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
        </svg>
        <span class="stat-text">{{ formatDuration(meeting.duration) }}</span>
      </div>
    </div>

    <!-- 标签列表 -->
    <div
      v-if="meeting.tags?.length"
      class="meeting-tags"
    >
      <span 
        v-for="tag in meeting.tags" 
        :key="tag"
        class="meeting-tag"
        :class="`tag-${getTagColor(tag)}`"
      >
        {{ tag }}
      </span>
    </div>

    <!-- 操作按钮 -->
    <div
      v-show="isHovered"
      class="meeting-actions"
    >
      <button 
        class="action-btn action-view"
        @click.stop="handleViewDetail"
      >
        <svg
          class="action-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
        查看详情
      </button>
      <button 
        v-if="meeting.files?.length"
        class="action-btn action-files"
        @click.stop="handleViewFiles"
      >
        <svg
          class="action-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
        相关文件
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Meeting, MeetingAttendee } from '@/types/entities'

interface Props {
  meeting: Meeting
  viewMode?: 'grid' | 'list'
}

interface Emits {
  (e: 'view-detail', meeting: Meeting): void
  (e: 'view-files', meeting: Meeting): void
  (e: 'view-recording', meeting: Meeting): void
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid'
})

const emit = defineEmits<Emits>()

const isHovered = ref(false)
const normalizedAttendees = computed<MeetingAttendee[]>(() => {
  return (props.meeting.attendees ?? []).map(attendee => {
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

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const isYesterday = date.toDateString() === new Date(today.getTime() - 86400000).toDateString()
  
  if (isToday) return '今天'
  if (isYesterday) return '昨天'
  if (date > today) return '未来'
  
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  })
}

// 计算相对时间
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (Math.abs(diffDays) < 1) return '今天'
  if (diffDays === 1) return '明天'
  if (diffDays === -1) return '昨天'
  if (diffDays > 1) return `${diffDays}天后`
  if (diffDays < -1) return `${Math.abs(diffDays)}天前`
  
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 获取状态文本
const getStatusText = (status?: string): string => {
  const statusMap = {
    upcoming: '即将开始',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[String(status ?? 'upcoming') as keyof typeof statusMap] || status || '未知'
}

// 获取类型文本
const getTypeText = (type: string): string => {
  const typeMap = {
    'weekly': '周例会',
    'technical': '技术讨论',
    'project': '项目评审',
    'training': '培训',
    'workshop': '研讨会',
    'seminar': '学术报告'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

// 格式化时长
const formatDuration = (minutes?: number): string => {
  if (typeof minutes !== 'number' || Number.isNaN(minutes)) return '未知'
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`
}

// 获取标签颜色
const getTagColor = (tag: string): string => {
  const colorMap = {
    'DeFi': 'blue',
    'NFT': 'purple',
    '智能合约': 'green',
    '区块链': 'indigo',
    'Web3': 'pink',
    'Layer2': 'orange',
    '共识算法': 'teal',
    '隐私计算': 'red'
  }
  return colorMap[tag as keyof typeof colorMap] || 'gray'
}

// 事件处理
const handleCardClick = () => {
  emit('view-detail', props.meeting)
}

const handleViewDetail = () => {
  emit('view-detail', props.meeting)
}

const handleViewFiles = () => {
  emit('view-files', props.meeting)
}
</script>

<style scoped>
/* 基础样式 */
.meeting-card {
  @apply relative bg-white rounded-xl shadow-md hover:shadow-xl 
         transition-all duration-300 ease-out cursor-pointer
         border border-gray-100 overflow-hidden;
}

.meeting-card-grid {
  @apply p-6;
}

.meeting-card-list {
  @apply p-4 flex items-center space-x-6;
}

.meeting-card:hover {
  @apply transform -translate-y-1;
}

.meeting-card.is-hovered {
  @apply shadow-2xl ring-2 ring-blue-200;
}

/* 头部信息 */
.meeting-card-header {
  @apply flex items-start justify-between mb-4;
}

.meeting-card-list .meeting-card-header {
  @apply flex-shrink-0 mb-0;
}

.meeting-date-info .date-main {
  @apply text-2xl font-bold text-gray-900;
}

.meeting-date-info .date-sub {
  @apply text-sm text-gray-500 mt-1;
}

.meeting-status .status-badge {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}

.status-upcoming { @apply bg-blue-100 text-blue-700; }
.status-ongoing { @apply bg-green-100 text-green-700; }
.status-completed { @apply bg-gray-100 text-gray-700; }
.status-cancelled { @apply bg-red-100 text-red-700; }

/* 标题区域 */
.meeting-title-section {
  @apply mb-4;
}

.meeting-title {
  @apply text-lg font-semibold text-gray-900 mb-2 line-clamp-2;
}

.meeting-type-tags {
  @apply flex flex-wrap gap-2;
}

.type-tag {
  @apply px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-medium;
}

/* 内容区域 */
.meeting-content {
  @apply mb-4;
}

.meeting-summary {
  @apply text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2;
}

.meeting-attendees {
  @apply flex items-center space-x-3;
}

.attendees-avatar-list {
  @apply flex -space-x-2;
}

.attendee-avatar {
  @apply w-8 h-8 rounded-full border-2 border-white object-cover;
}

.attendee-more {
  @apply w-8 h-8 rounded-full bg-gray-200 border-2 border-white 
         flex items-center justify-center text-xs text-gray-600 font-medium;
}

.attendees-count {
  @apply text-sm text-gray-500;
}

/* 统计信息 */
.meeting-stats {
  @apply flex items-center space-x-6 mb-4;
}

.stat-item {
  @apply flex items-center space-x-1;
}

.stat-icon {
  @apply w-4 h-4 text-gray-400;
}

.stat-text {
  @apply text-sm text-gray-500;
}

/* 标签 */
.meeting-tags {
  @apply flex flex-wrap gap-2 mb-4;
}

.meeting-tag {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}

.tag-blue { @apply bg-blue-100 text-blue-700; }
.tag-purple { @apply bg-purple-100 text-purple-700; }
.tag-green { @apply bg-green-100 text-green-700; }
.tag-indigo { @apply bg-indigo-100 text-indigo-700; }
.tag-pink { @apply bg-pink-100 text-pink-700; }
.tag-orange { @apply bg-orange-100 text-orange-700; }
.tag-teal { @apply bg-teal-100 text-teal-700; }
.tag-red { @apply bg-red-100 text-red-700; }
.tag-gray { @apply bg-gray-100 text-gray-700; }

/* 操作按钮 */
.meeting-actions {
  @apply flex space-x-2 pt-3 border-t border-gray-100;
}

.action-btn {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg 
         text-sm font-medium transition-colors duration-200;
}

.action-view {
  @apply bg-blue-50 text-blue-700 hover:bg-blue-100;
}

.action-files {
  @apply bg-gray-50 text-gray-700 hover:bg-gray-100;
}

.action-icon {
  @apply w-4 h-4;
}

/* 列表模式特殊样式 */
.meeting-card-list .meeting-title {
  @apply text-base mb-1;
}

.meeting-card-list .meeting-type-tags {
  @apply mb-2;
}

.meeting-card-list .meeting-summary {
  @apply mb-3 line-clamp-1;
}

.meeting-card-list .meeting-tags {
  @apply mb-2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .meeting-card-grid {
    @apply p-4;
  }
  
  .meeting-card-list {
    @apply flex-col space-x-0 space-y-4;
  }
  
  .meeting-stats {
    @apply space-x-4;
  }
  
  .meeting-actions {
    @apply flex-wrap space-x-0 space-y-2;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .meeting-card {
    @apply bg-gray-800 border-gray-700;
  }
  
  .meeting-title {
    @apply text-white;
  }
  
  .meeting-summary,
  .stat-text,
  .attendees-count {
    @apply text-gray-300;
  }
  
  .date-sub {
    @apply text-gray-400;
  }
  
  .attendee-more {
    @apply bg-gray-600 text-gray-300;
  }
  
  .meeting-actions {
    @apply border-gray-700;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .meeting-card {
    @apply border-2 border-gray-300;
  }
  
  .meeting-card.is-hovered {
    @apply ring-2 ring-blue-500 border-blue-500;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .meeting-card {
    @apply transition-none;
  }
  
  .meeting-card:hover {
    @apply transform-none;
  }
}
</style>