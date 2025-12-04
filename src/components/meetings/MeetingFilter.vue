<template>
  <div class="meeting-filter">
    <!-- 搜索框 -->
    <div class="filter-section search-section">
      <div class="search-input-wrapper">
        <svg
          class="search-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索会议标题、内容..."
          class="search-input"
          @input="handleSearch"
        >
        <button 
          v-if="searchQuery"
          class="search-clear"
          @click="clearSearch"
        >
          <svg
            class="clear-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section filters-section">
      <h3 class="filter-title">
        筛选条件
      </h3>
      
      <!-- 会议状态 -->
      <div class="filter-group">
        <label class="filter-label">会议状态</label>
        <div class="filter-options">
          <label 
            v-for="status in statusOptions"
            :key="status.value"
            class="filter-option"
          >
            <input
              v-model="selectedStatuses"
              type="checkbox"
              :value="status.value"
              class="filter-checkbox"
              @change="handleFilterChange"
            >
            <span class="filter-text">{{ status.label }}</span>
            <span class="filter-count">({{ getStatusCount(status.value) }})</span>
          </label>
        </div>
      </div>

      <!-- 会议类型 -->
      

      <!-- 参与人数 -->
     
      <!-- 时间范围 -->
      <div class="filter-group">
        <label class="filter-label">时间范围</label>
        <div class="date-range">
          <input
            v-model="dateRange.start"
            type="date"
            class="date-input"
            @change="handleFilterChange"
          >
          <span class="date-separator">至</span>
          
          <input
            v-model="dateRange.end"
            type="date"
            class="date-input"
            @change="handleFilterChange"
          >
        </div>
      </div>

      <!-- 标签筛选 -->
      
    </div>

    <!-- 排序选项 -->
    <div class="filter-section sort-section">
      <h3 class="filter-title">
        排序方式
      </h3>
      <div class="sort-options">
        <button
          v-for="option in sortOptions"
          :key="option.value"
          class="sort-option"
          :class="{ 'is-active': sortBy === option.value }"
          @click="handleSortChange(option.value)"
        >
          <span class="sort-text">{{ option.label }}</span>
          <svg 
            v-if="sortBy === option.value"
            class="sort-direction-icon"
            :class="{ 'is-descending': sortDirection === 'desc' }"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7 14l5-5 5 5z" />
          </svg>
        </button>
      </div>
      <button 
        v-if="sortBy !== 'date'"
        class="sort-direction-toggle"
        @click="toggleSortDirection"
      >
        {{ sortDirection === 'asc' ? '升序' : '降序' }}
      </button>
    </div>

    <!-- 活跃筛选器显示 -->
    <div
      v-if="hasActiveFilters"
      class="active-filters"
    >
      <h3 class="filter-title">
        当前筛选
      </h3>
      <div class="active-filter-tags">
        <div 
          v-for="status in selectedStatuses"
          :key="`status-${status}`"
          class="active-filter-tag"
        >
          <span class="filter-text">{{ getStatusText(status) }}</span>
          <button
            class="filter-remove"
            @click="removeStatus(status)"
          >
            <svg
              class="remove-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div 
          v-for="type in selectedTypes"
          :key="`type-${type}`"
          class="active-filter-tag"
        >
          <span class="filter-text">{{ getTypeText(type) }}</span>
          <button
            class="filter-remove"
            @click="removeType(type)"
          >
            <svg
              class="remove-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div 
          v-for="tag in selectedTags"
          :key="`tag-${tag}`"
          class="active-filter-tag"
        >
          <span class="filter-text">{{ tag }}</span>
          <button
            class="filter-remove"
            @click="removeTag(tag)"
          >
            <svg
              class="remove-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <button
          class="clear-all-filters"
          @click="clearAllFilters"
        >
          清除全部
        </button>
      </div>
    </div>

    <!-- 筛选结果统计 -->
    <div class="filter-stats">
      <span class="stats-text">
        共找到 <strong>{{ filteredCount }}</strong> 个会议
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Meeting } from '@/types/entities'

// 筛选选项数据
const statusOptions = [
  { value: 'upcoming', label: '即将开始' },
  { value: 'ongoing', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

const typeOptions = [
  { value: 'weekly', label: '周例会' },
  { value: 'technical', label: '技术讨论' },
  { value: 'project', label: '项目评审' },
  { value: 'training', label: '培训' },
  { value: 'workshop', label: '研讨会' },
  { value: 'seminar', label: '学术报告' }
]

const attendeeSizeOptions = [
  { value: 'small', label: '小型 (< 10人)' },
  { value: 'medium', label: '中型 (10-20人)' },
  { value: 'large', label: '大型 (> 20人)' }
]

const sortOptions = [
  { value: 'date', label: '日期' },
  { value: 'title', label: '标题' },
  { value: 'attendee_count', label: '参与人数' },
  { value: 'duration', label: '时长' }
]

const popularTags = [
  'DeFi', 'NFT', '智能合约', '区块链', 'Web3', 
  'Layer2', '共识算法', '隐私计算'
]

// 响应式数据
const searchQuery = ref('')
const selectedStatuses = ref<string[]>([])
const selectedTypes = ref<string[]>([])
const selectedAttendeeSizes = ref<string[]>([])
const selectedTags = ref<string[]>([])
const dateRange = ref({
  start: '',
  end: ''
})
const sortBy = ref('date')
const sortDirection = ref<'asc' | 'desc'>('desc')

// 接口定义
interface FilterOptions {
  searchQuery?: string
  statuses?: string[]
  types?: string[]
  attendeeSizes?: string[]
  tags?: string[]
  dateRange?: {
    start: string
    end: string
  }
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

interface Props {
  meetings?: Meeting[]
  initialFilters?: FilterOptions
}

interface Emits {
  (e: 'filter-change', filters: FilterOptions): void
}

const props = withDefaults(defineProps<Props>(), {
  meetings: () => [],
  initialFilters: () => ({})
})

const emit = defineEmits<Emits>()

// 计算属性
const hasActiveFilters = computed(() => {
  return searchQuery.value || 
         selectedStatuses.value.length > 0 || 
         selectedTypes.value.length > 0 ||
         selectedAttendeeSizes.value.length > 0 ||
         selectedTags.value.length > 0 ||
         dateRange.value.start ||
         dateRange.value.end
})

const filteredCount = computed(() => {
  return props.meetings?.length || 0
})

// 筛选计数方法
const getStatusCount = (status: string): number => {
  return props.meetings?.filter(m => m.status === status).length || 0
}

const getTypeCount = (type: string): number => {
  return props.meetings?.filter(m => Array.isArray(m.types) && m.types.includes(type)).length || 0
}

const getAttendeeSizeCount = (size: string): number => {
  if (!props.meetings) return 0
  
  return props.meetings.filter(m => {
    const count = (m.attendees?.length) ?? 0
    switch (size) {
      case 'small': return count < 10
      case 'medium': return count >= 10 && count <= 20
      case 'large': return count > 20
      default: return false
    }
  }).length
}

// 文本转换方法
const getStatusText = (status: string): string => {
  const option = statusOptions.find(o => o.value === status)
  return option?.label || status
}

const getTypeText = (type: string): string => {
  const option = typeOptions.find(o => o.value === type)
  return option?.label || type
}

// 事件处理方法
const handleSearch = () => {
  emitFilterChange()
}

const handleFilterChange = () => {
  emitFilterChange()
}

const handleSortChange = (value: string) => {
  sortBy.value = value
  emitFilterChange()
}

const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  emitFilterChange()
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  emitFilterChange()
}

const removeStatus = (status: string) => {
  const index = selectedStatuses.value.indexOf(status)
  if (index > -1) {
    selectedStatuses.value.splice(index, 1)
    emitFilterChange()
  }
}

const removeType = (type: string) => {
  const index = selectedTypes.value.indexOf(type)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
    emitFilterChange()
  }
}

const removeTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
    emitFilterChange()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  emitFilterChange()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedStatuses.value = []
  selectedTypes.value = []
  selectedAttendeeSizes.value = []
  selectedTags.value = []
  dateRange.value = { start: '', end: '' }
  sortBy.value = 'date'
  sortDirection.value = 'desc'
  emitFilterChange()
}

const emitFilterChange = () => {
  const filters: FilterOptions = {
    searchQuery: searchQuery.value,
    statuses: selectedStatuses.value,
    types: selectedTypes.value,
    attendeeSizes: selectedAttendeeSizes.value,
    tags: selectedTags.value,
    dateRange: dateRange.value.start || dateRange.value.end ? dateRange.value : undefined,
    sortBy: sortBy.value,
    sortDirection: sortDirection.value
  }
  
  emit('filter-change', filters)
}

// 初始化筛选器
const initializeFilters = () => {
  if (props.initialFilters) {
    const filters = props.initialFilters
    searchQuery.value = filters.searchQuery || ''
    selectedStatuses.value = filters.statuses || []
    selectedTypes.value = filters.types || []
    selectedAttendeeSizes.value = filters.attendeeSizes || []
    selectedTags.value = filters.tags || []
    if (filters.dateRange) {
      dateRange.value = filters.dateRange
    }
    sortBy.value = filters.sortBy || 'date'
    sortDirection.value = filters.sortDirection || 'desc'
  }
}

// 监听初始筛选器变化
watch(() => props.initialFilters, initializeFilters, { immediate: true })
</script>

<style scoped lang="postcss">
/* 基础样式 */
.meeting-filter {
  @apply bg-white rounded-xl shadow-md border border-gray-100 p-6;
}

/* 搜索区域 */
.search-section {
  @apply mb-6;
}

.search-input-wrapper {
  @apply relative flex items-center;
}

.search-icon {
  @apply absolute left-3 w-5 h-5 text-gray-400;
}

.search-input {
  @apply w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
         transition-colors duration-200;
}

.search-clear {
  @apply absolute right-3 w-5 h-5 text-gray-400 hover:text-gray-600
         transition-colors duration-200;
}

.clear-icon {
  @apply w-5 h-5;
}

/* 筛选区域 */
.filter-section {
  @apply mb-6 last:mb-0;
}

.filter-title {
  @apply text-lg font-semibold text-gray-900 mb-3;
}

.filter-group {
  @apply mb-4 last:mb-0;
}

.filter-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.filter-options {
  @apply space-y-2;
}

.filter-option {
  @apply flex items-center space-x-3 cursor-pointer;
}

.filter-checkbox {
  @apply w-4 h-4 text-blue-600 border-gray-300 rounded 
         focus:ring-blue-500 focus:ring-2;
}

.filter-text {
  @apply text-sm text-gray-700 flex-1;
}

.filter-count {
  @apply text-xs text-gray-400;
}

/* 日期范围 */
.date-range {
  @apply  items-center space-x-2;
}

.date-input {
  @apply flex-1 px-3 py-2 border border-gray-200 rounded-lg
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.date-separator {
  @apply text-sm text-gray-500;
}

/* 标签云 */
.tag-cloud {
  @apply flex flex-wrap gap-2;
}

.tag-button {
  @apply px-3 py-1 text-sm border border-gray-200 rounded-full
         text-gray-600 hover:border-blue-300 hover:text-blue-600
         transition-colors duration-200;
}

.tag-button.is-active {
  @apply bg-blue-50 border-blue-300 text-blue-700;
}

/* 排序选项 */
.sort-options {
  @apply grid grid-cols-2 gap-2 mb-3;
}

.sort-option {
  @apply flex items-center justify-between px-3 py-2 text-sm
         border border-gray-200 rounded-lg cursor-pointer
         hover:border-blue-300 hover:text-blue-600
         transition-colors duration-200;
}

.sort-option.is-active {
  @apply bg-blue-50 border-blue-300 text-blue-700;
}

.sort-text {
  @apply flex-1;
}

.sort-direction-icon {
  @apply w-4 h-4 transition-transform duration-200;
}

.sort-direction-icon.is-descending {
  @apply transform rotate-180;
}

.sort-direction-toggle {
  @apply w-full px-3 py-2 text-sm text-gray-600 border border-gray-200
         rounded-lg hover:border-blue-300 hover:text-blue-600
         transition-colors duration-200;
}

/* 活跃筛选器 */
.active-filter-tags {
  @apply flex flex-wrap gap-2 mb-4;
}

.active-filter-tag {
  @apply flex items-center space-x-1 px-3 py-1 bg-blue-50 border border-blue-200
         rounded-full text-sm;
}

.filter-remove {
  @apply w-4 h-4 text-blue-400 hover:text-blue-600
         transition-colors duration-200;
}

.remove-icon {
  @apply w-4 h-4;
}

.clear-all-filters {
  @apply px-3 py-1 text-sm text-red-600 border border-red-200
         rounded-full hover:bg-red-50 hover:border-red-300
         transition-colors duration-200;
}

/* 筛选统计 */
.filter-stats {
  @apply pt-4 border-t border-gray-100;
}

.stats-text {
  @apply text-sm text-gray-600;
}

.stats-text strong {
  @apply text-gray-900 font-semibold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .meeting-filter {
    @apply p-4;
  }
  
  .sort-options {
    @apply grid-cols-1;
  }
  
  .tag-cloud {
    @apply gap-1;
  }
  
  .tag-button {
    @apply px-2 py-1 text-xs;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .meeting-filter {
    @apply bg-gray-800 border-gray-700;
  }
  
  .filter-title,
  .filter-text,
  .sort-text {
    @apply text-white;
  }
  
  .filter-label {
    @apply text-gray-300;
  }
  
  .search-input,
  .date-input {
    @apply bg-gray-700 border-gray-600 text-white;
  }
  
  .filter-checkbox {
    @apply bg-gray-700 border-gray-600;
  }
  
  .filter-option,
  .sort-option,
  .tag-button {
    @apply border-gray-600 text-gray-300;
  }
  
  .tag-button:hover,
  .sort-option:hover,
  .filter-option:hover {
    @apply border-blue-400 text-blue-400;
  }
  
  .active-filter-tag {
    @apply bg-blue-900 border-blue-700;
  }
  
  .clear-all-filters {
    @apply border-red-700 text-red-400 hover:bg-red-900;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .meeting-filter {
    @apply border-2 border-gray-300;
  }
  
  .filter-option:hover,
  .sort-option:hover {
    @apply border-2 border-blue-500;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .search-input,
  .filter-checkbox,
  .tag-button,
  .sort-option,
  .filter-remove {
    @apply transition-none;
  }
}
</style>