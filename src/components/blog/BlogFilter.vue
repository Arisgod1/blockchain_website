<template>
  <div class="blog-filter">
    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <SearchIcon class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索文章标题、内容、作者..."
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
        <label class="filter-label">文章分类</label>
        <div>
          <select
            v-model="selectedCategory"
            class="category-select"
            @change="handleCategoryChange"
          >
            <option
              v-for="category in categories"
              :key="category.value"
              :value="category.value"
            >
              {{ category.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-label">作者</label>
        <div class="author-filters">
          <select
            v-model="selectedAuthor"
            class="author-select"
            @change="handleAuthorChange"
          >
            <option value="">
              全部作者
            </option>
            <option 
              v-for="author in authors" 
              :key="author.id"
              :value="author.name"
            >
              {{ author.name }} ({{ author.articleCount }})
            </option>
          </select>
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-label">发布时间</label>
        <div class="date-filters">
          <select
            v-model="selectedDateRange"
            class="date-select"
            @change="handleDateRangeChange"
          >
            <option value="">
              全部时间
            </option>
            <option value="today">
              今天
            </option>
            <option value="week">
              最近一周
            </option>
            <option value="month">
              最近一月
            </option>
            <option value="quarter">
              最近三月
            </option>
            <option value="year">
              最近一年
            </option>
          </select>
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
            <option value="publishedAt">
              发布时间
            </option>
            <option value="views">
              浏览量
            </option>
            <option value="likes">
              点赞数
            </option>
            <option value="comments">
              评论数
            </option>
            <option value="readTime">
              阅读时间
            </option>
          </select>
          <button 
            class="sort-order-btn"
            :class="{ desc: sortOrder === 'desc' }"
            @click="toggleSortOrder"
          >
            <ArrowUpIcon v-if="sortOrder === 'asc'" />
            <ArrowDownIcon v-else />
          </button>
        </div>
      </div>

    </div>

    <div class="filter-actions">
      <button
        class="reset-btn"
        @click="resetFilters"
      >
        <RotateCcwIcon />
        重置筛选
      </button>
      <button
        class="advanced-btn"
        :class="{ active: showAdvanced }"
        @click="toggleAdvanced"
      >
        <SettingsIcon />
        高级筛选
      </button>
    </div>

    <div
      v-if="showAdvanced"
      class="advanced-panel"
    >
      <div class="advanced-group">
        <label class="filter-label">最短阅读时间</label>
        <input 
          v-model="minReadTime" 
          type="range" 
          min="1" 
          max="30" 
          class="time-range"
          @input="handleTimeRangeChange"
        >
        <div class="range-labels">
          <span>1分钟</span>
          <span>{{ minReadTime }}分钟</span>
          <span>30分钟</span>
        </div>
      </div>
      
      <div class="advanced-group">
        <label class="filter-label">是否精选</label>
        <div class="featured-filter">
          <label class="featured-option">
            <input
              v-model="featuredFilter"
              type="radio"
              value=""
              @change="handleFeaturedChange"
            >
            <span>全部</span>
          </label>
          <label class="featured-option">
            <input
              v-model="featuredFilter"
              type="radio"
              value="featured"
              @change="handleFeaturedChange"
            >
            <span>仅精选</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SearchIcon,
  XIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RotateCcwIcon,
  SettingsIcon,
} from '@/components/icons'

// 筛选选项接口
interface FilterOptions {
  searchQuery: string
  category: string
  author: string
  dateRange: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  minReadTime: number
  featuredOnly: boolean
}

// 分类选项
const categories = [
  { label: '全部', value: 'all', icon: null },
  { label: '技术深度', value: 'tech', icon: 'CodeIcon' },
  { label: '开发实践', value: 'practice', icon: 'ToolIcon' },
  { label: 'DeFi协议', value: 'defi', icon: 'CoinsIcon' },
  { label: '行业分析', value: 'analysis', icon: 'TrendingUpIcon' },
  { label: '区块链基础', value: 'blockchain', icon: 'LayersIcon' },
  { label: '智能合约', value: 'contract', icon: 'FileTextIcon' },
  { label: '共识算法', value: 'consensus', icon: 'GitBranchIcon' },
  { label: '项目分享', value: 'project', icon: 'FolderIcon' },
  { label: '学术研究', value: 'research', icon: 'BookOpenIcon' }
]

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedAuthor = ref('')
const selectedDateRange = ref('')
const sortBy = ref('publishedAt')
const sortOrder = ref<'asc' | 'desc'>('desc')
const minReadTime = ref(1)
const featuredFilter = ref('')
const showAdvanced = ref(false)

const authors = ref([
  { id: 1, name: '张三', articleCount: 15 },
  { id: 2, name: '李四', articleCount: 12 },
  { id: 3, name: '王五', articleCount: 8 },
  { id: 4, name: '赵六', articleCount: 20 },
  { id: 5, name: '孙七', articleCount: 6 }
])

// 事件处理
const handleSearch = () => {
  emitFilterChange()
}

const handleCategoryChange = () => {
  // select's v-model already updated selectedCategory
  emitFilterChange()
}

const handleAuthorChange = () => {
  emitFilterChange()
}

const handleDateRangeChange = () => {
  emitFilterChange()
}

const handleSortChange = () => {
  emitFilterChange()
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  emitFilterChange()
}

const handleTimeRangeChange = () => {
  emitFilterChange()
}

const handleFeaturedChange = () => {
  emitFilterChange()
}

const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

const clearSearch = () => {
  searchQuery.value = ''
  emitFilterChange()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedAuthor.value = ''
  selectedDateRange.value = ''
  sortBy.value = 'publishedAt'
  sortOrder.value = 'desc'
  minReadTime.value = 1
  featuredFilter.value = ''
  showAdvanced.value = false
  emitFilterChange()
}

// 获取当前筛选条件
const getCurrentFilters = (): FilterOptions => ({
  searchQuery: searchQuery.value,
  category: selectedCategory.value,
  author: selectedAuthor.value,
  dateRange: selectedDateRange.value,
  sortBy: sortBy.value,
  sortOrder: sortOrder.value,
  minReadTime: minReadTime.value,
  featuredOnly: featuredFilter.value === 'featured'
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

defineExpose({ resetFilters })

</script>

<style scoped lang="postcss">
.blog-filter {
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

.author-select,
.date-select {
  @apply w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-600 focus:border-transparent;
}

.sort-select {
  @apply px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-600 focus:border-transparent;
  min-width: 200px;
}

.category-select {
  @apply w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-600 focus:border-transparent;
}

.sort-options {
  @apply flex gap-0 ;
}

.sort-order-btn {
  @apply w-10 h-10 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors;
}

.sort-order-btn.desc {
  @apply bg-cyan-50 border-cyan-500 text-cyan-700;
}

.featured-filter {
  @apply space-y-2;
}

.featured-option {
  @apply flex items-center space-x-2 cursor-pointer;
}

.filter-actions {
  @apply flex flex-wrap gap-2 pt-4 border-t border-slate-200;
}

.reset-btn,
.advanced-btn {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors;
}

.reset-btn {
  @apply border-slate-300 text-slate-700 hover:bg-slate-50;
}

.advanced-btn {
  @apply border-slate-300 text-slate-700 hover:bg-slate-50;
}

.advanced-btn.active {
  @apply bg-cyan-50 border-cyan-500 text-cyan-700;
}

.advanced-panel {
  @apply p-4 bg-slate-50 rounded-lg space-y-4;
}

.advanced-group {
  @apply space-y-2;
}

.time-range {
  @apply w-full;
}

.range-labels {
  @apply flex justify-between text-xs text-slate-600;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .blog-filter {
    @apply p-4;
  }
  
  .filter-grid {
    @apply grid-cols-1 gap-4;
  }
  
  .filter-actions {
    @apply gap-2;
  }
}
</style>
