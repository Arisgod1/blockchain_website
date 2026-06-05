<template>
  <div class="project-filter">
    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <SearchIcon class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索项目名称、描述..."
          class="search-input"
          @input="handleSearch"
        >
        <button 
          v-if="searchQuery"
          class="clear-btn"
          @click="clearSearch"
        >
          <XIcon />
        </button>
      </div>
    </div>

    <div class="filter-grid">
      <div class="filter-group">
        <label class="filter-label">项目状态</label>
        <div class="status-options">
          <label 
            v-for="status in projectStatuses" 
            :key="status.value"
            class="status-option"
          >
            <input
              v-model="selectedStatuses"
              type="checkbox"
              :value="status.value"
              @change="handleStatusChange"
            >
            <span class="status-text">{{ status.label }}</span>
          </label>
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-label">排序方式</label>
        <div class="sort-options">
          <select
            v-model="sortBy"
            class="sort-select"
            @change="handleSortChange"
          >
            <option value="updateTime">
              更新时间
            </option>
            <option value="createTime">
              创建时间
            </option>
            <option value="title">
              项目名称
            </option>
            <option value="likes">
              点赞数
            </option>
            <option value="progress">
              完成进度
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="filter-actions">
      <button
        class="reset-btn"
        type="button"
        @click="resetFilters"
      >
        <RotateCcwIcon />
        清空条件
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SearchIcon,
  XIcon,
  RotateCcwIcon
} from '@/components/icons'

// 筛选选项接口
interface FilterOptions {
  searchQuery: string
  statuses: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

// 项目状态选项
const projectStatuses = [
  { label: '规划中', value: 'planning' },
  { label: '开发中', value: 'in-progress' },
  { label: '已完成', value: 'completed' },
  { label: '已暂停', value: 'paused' }
]

// 响应式数据
const searchQuery = ref('')
const selectedStatuses = ref<string[]>([])
const sortBy = ref('updateTime')
const sortOrder = ref<'asc' | 'desc'>('desc')

// 事件处理
const handleSearch = () => {
  emitFilterChange()
}

const handleStatusChange = () => {
  emitFilterChange()
}

const handleSortChange = () => {
  emitFilterChange()
}

const clearSearch = () => {
  searchQuery.value = ''
  emitFilterChange()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatuses.value = []
  sortBy.value = 'updateTime'
  sortOrder.value = 'desc'
  emitFilterChange()
}

// 获取当前筛选条件
const getCurrentFilters = (): FilterOptions => ({
  searchQuery: searchQuery.value,
  statuses: [...selectedStatuses.value],
  sortBy: sortBy.value,
  sortOrder: sortOrder.value
})

// 发送筛选变化事件
const emitFilterChange = () => {
  const filters = getCurrentFilters()
  emit('filter-change', filters)
}

// 定义事件
interface Emits {
  'filter-change': [filters: FilterOptions]
}

const emit = defineEmits<Emits>()

</script>

<style scoped>
.project-filter {
  @apply bg-white rounded-xl border border-slate-200 p-5 space-y-5;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
}

.search-section {
  @apply space-y-3;
}

.search-input-wrapper {
  @apply relative;
}

.search-input {
  @apply w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-950 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500;
}

.clear-btn {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600;
}

.filter-grid {
  @apply grid grid-cols-1 gap-5;
}

.filter-group {
  @apply space-y-3;
}

.filter-label {
  @apply block text-sm font-semibold text-slate-900;
}

.status-options {
  @apply flex flex-wrap gap-2;
}

.status-option {
  @apply relative inline-flex cursor-pointer;
}

.status-option input {
  @apply sr-only;
}

.status-text {
  @apply inline-flex items-center rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition-colors;
}

.status-option input:checked + .status-text {
  @apply border-slate-950 bg-slate-950 text-white;
}

.sort-options {
  @apply flex gap-1;
}

.sort-select {
  @apply flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-600 focus:border-transparent;
}

.sort-order-btn {
  @apply w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors;
}

.sort-order-btn.desc {
  @apply bg-blue-50 border-blue-500 text-blue-600;
}

.filter-actions {
  @apply flex flex-wrap gap-2 pt-4 border-t border-slate-200;
}

.reset-btn {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors;
}

.reset-btn {
  @apply border-slate-300 text-slate-700 hover:bg-slate-50;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .project-filter {
    @apply p-4;
  }
  
  .filter-grid {
    @apply grid-cols-1 gap-4;
  }
  
  .filter-actions {
    @apply gap-2;
  }
  
  .reset-btn {
    @apply px-3 py-2 text-sm;
  }
}
</style>
