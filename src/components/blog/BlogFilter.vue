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

    <!-- 筛选器网格 -->
    <div class="filter-grid">
      <!-- 分类筛选 -->
      <div class="filter-group">
        <label class="filter-label">文章分类</label>
        <div class="category-tags">
          <button
            v-for="category in categories"
            :key="category.value"
            :class="['category-tag', { active: selectedCategory === category.value }]"
            @click="selectCategory(category.value)"
          >
            <component
              :is="category.icon"
              v-if="category.icon"
              class="category-icon"
            />
            {{ category.label }}
          </button>
        </div>
      </div>

      <!-- 标签云 -->
      <div class="filter-group">
        <label class="filter-label">热门标签</label>
        <div class="tag-cloud">
          <button
            v-for="tag in popularTags"
            :key="tag.name"
            :class="['tag-cloud-item', { active: selectedTags.includes(tag.name) }]"
            :style="{ fontSize: `${Math.max(0.8, Math.min(1.4, tag.weight))}rem` }"
            @click="toggleTag(tag.name)"
          >
            {{ tag.name }}
            <span class="tag-count">{{ tag.count }}</span>
          </button>
        </div>
      </div>

      <!-- 作者筛选 -->
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

      <!-- 时间范围 -->
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

      <!-- 排序选项 -->
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

      <!-- 阅读难度 -->
      <div class="filter-group">
        <label class="filter-label">阅读难度</label>
        <div class="difficulty-filters">
          <label 
            v-for="level in difficultyLevels" 
            :key="level.value"
            class="difficulty-option"
          >
            <input
              v-model="selectedDifficulties"
              type="checkbox"
              :value="level.value"
              @change="handleDifficultyChange"
            >
            <span
              class="difficulty-text"
              :class="`difficulty-${level.value}`"
            >
              {{ level.label }}
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- 活跃标签显示 -->
    <div
      v-if="selectedTags.length > 0"
      class="active-filters"
    >
      <div class="active-filters-label">
        已选标签:
      </div>
      <div class="active-tags">
        <span 
          v-for="tag in selectedTags" 
          :key="tag"
          class="active-tag"
          @click="removeTag(tag)"
        >
          {{ tag }}
          <XIcon class="remove-tag-icon" />
        </span>
      </div>
      <button
        class="clear-all-tags"
        @click="clearAllTags"
      >
        清除全部
      </button>
    </div>

    <!-- 筛选结果统计 -->
    <div class="filter-stats">
      <div class="stats-item">
        <span class="stats-label">共找到</span>
        <span class="stats-value">{{ totalCount }}</span>
        <span class="stats-label">篇文章</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">显示</span>
        <span class="stats-value">{{ filteredCount }}</span>
        <span class="stats-label">篇文章</span>
      </div>
    </div>

    <!-- 快速操作 -->
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
      <button
        class="save-btn"
        @click="saveFilters"
      >
        <BookmarkIcon />
        保存筛选
      </button>
    </div>

    <!-- 高级筛选面板 -->
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
import { ref, watch } from 'vue'

// 筛选选项接口
interface FilterOptions {
  searchQuery: string
  category: string
  tags: string[]
  author: string
  dateRange: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  difficulties: string[]
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

// 阅读难度选项
const difficultyLevels = [
  { label: '入门', value: 'beginner' },
  { label: '中级', value: 'intermediate' },
  { label: '高级', value: 'advanced' },
  { label: '专家', value: 'expert' }
]

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedTags = ref<string[]>([])
const selectedAuthor = ref('')
const selectedDateRange = ref('')
const sortBy = ref('publishedAt')
const sortOrder = ref<'asc' | 'desc'>('desc')
const selectedDifficulties = ref<string[]>([])
const minReadTime = ref(1)
const featuredFilter = ref('')
const showAdvanced = ref(false)

// 计算属性
const totalCount = ref(128) // 总文章数
const filteredCount = ref(128) // 筛选后文章数

// 模拟数据
const popularTags = ref([
  { name: 'Solidity', count: 25, weight: 1.3 },
  { name: 'DeFi', count: 32, weight: 1.4 },
  { name: 'NFT', count: 18, weight: 1.1 },
  { name: '智能合约', count: 28, weight: 1.35 },
  { name: 'Web3', count: 22, weight: 1.2 },
  { name: '共识算法', count: 15, weight: 1.0 },
  { name: '加密货币', count: 20, weight: 1.15 },
  { name: '区块链', count: 35, weight: 1.4 },
  { name: '安全', count: 12, weight: 0.9 },
  { name: '钱包', count: 16, weight: 1.05 }
])

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

const selectCategory = (category: string) => {
  selectedCategory.value = category
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

const removeTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
    emitFilterChange()
  }
}

const clearAllTags = () => {
  selectedTags.value = []
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

const handleDifficultyChange = () => {
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
  selectedTags.value = []
  selectedAuthor.value = ''
  selectedDateRange.value = ''
  sortBy.value = 'publishedAt'
  sortOrder.value = 'desc'
  selectedDifficulties.value = []
  minReadTime.value = 1
  featuredFilter.value = ''
  showAdvanced.value = false
  emitFilterChange()
}

const saveFilters = () => {
  const filterOptions = getCurrentFilters()
  localStorage.setItem('blogFilters', JSON.stringify(filterOptions))
  alert('筛选条件已保存')
}

// 获取当前筛选条件
const getCurrentFilters = (): FilterOptions => ({
  searchQuery: searchQuery.value,
  category: selectedCategory.value,
  tags: [...selectedTags.value],
  author: selectedAuthor.value,
  dateRange: selectedDateRange.value,
  sortBy: sortBy.value,
  sortOrder: sortOrder.value,
  difficulties: [...selectedDifficulties.value],
  minReadTime: minReadTime.value,
  featuredOnly: featuredFilter.value === 'featured'
})

// 发送筛选变化事件
const emitFilterChange = () => {
  const filters = getCurrentFilters()
  emit('filter-change', filters)
}

// 监听筛选条件变化，更新计数
watch([searchQuery, selectedCategory, selectedTags, selectedAuthor, selectedDateRange, selectedDifficulties, minReadTime, featuredFilter], () => {
  // 这里应该根据筛选条件更新 filteredCount
  // 实际项目中应该调用 API 获取真实的筛选结果数量
}, { deep: true })

// 定义事件
interface Emits {
  'filter-change': [filters: FilterOptions]
}

const emit = defineEmits<Emits>()

// 图标组件
const SearchIcon = () => import('@/components/icons').then(m => m.SearchIcon)
const XIcon = () => import('@/components/icons').then(m => m.XIcon)
const ArrowUpIcon = () => import('@/components/icons').then(m => m.ArrowUpIcon)
const ArrowDownIcon = () => import('@/components/icons').then(m => m.ArrowDownIcon)
const RotateCcwIcon = () => import('@/components/icons').then(m => m.RotateCcwIcon)
const SettingsIcon = () => import('@/components/icons').then(m => m.SettingsIcon)
const BookmarkIcon = () => import('@/components/icons').then(m => m.BookmarkIcon)

defineExpose({
  resetFilters
})
</script>

<style scoped>
.blog-filter {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6;
}

.search-section {
  @apply space-y-3;
}

.search-input-wrapper {
  @apply relative;
}

.search-input {
  @apply w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400;
}

.clear-btn {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600;
}

.filter-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.filter-group {
  @apply space-y-3;
}

.filter-label {
  @apply block text-sm font-medium text-gray-700;
}

.category-tags {
  @apply flex flex-wrap gap-2;
}

.category-tag {
  @apply flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer transition-all hover:border-blue-500 hover:text-blue-600;
}

.category-tag.active {
  @apply bg-blue-500 text-white border-blue-500;
}

.category-icon {
  @apply w-4 h-4;
}

.tag-cloud {
  @apply flex flex-wrap gap-2 max-h-32 overflow-y-auto;
}

.tag-cloud-item {
  @apply inline-flex items-center gap-1 px-2 py-1 text-sm border border-gray-300 rounded cursor-pointer transition-all hover:border-blue-500 hover:text-blue-600;
}

.tag-cloud-item.active {
  @apply bg-blue-500 text-white border-blue-500;
}

.tag-count {
  @apply text-xs opacity-75;
}

.author-select,
.date-select,
.sort-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.sort-options {
  @apply flex gap-2;
}

.sort-order-btn {
  @apply w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors;
}

.sort-order-btn.desc {
  @apply bg-blue-50 border-blue-500 text-blue-600;
}

.difficulty-filters,
.featured-filter {
  @apply space-y-2;
}

.difficulty-option,
.featured-option {
  @apply flex items-center space-x-2 cursor-pointer;
}

.difficulty-text {
  @apply text-sm;
}

.difficulty-beginner {
  @apply text-green-600;
}

.difficulty-intermediate {
  @apply text-yellow-600;
}

.difficulty-advanced {
  @apply text-orange-600;
}

.difficulty-expert {
  @apply text-red-600;
}

.active-filters {
  @apply flex items-center gap-3 p-4 bg-blue-50 rounded-lg;
}

.active-filters-label {
  @apply text-sm font-medium text-blue-800;
}

.active-tags {
  @apply flex flex-wrap gap-2 flex-1;
}

.active-tag {
  @apply inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-full cursor-pointer hover:bg-blue-600 transition-colors;
}

.remove-tag-icon {
  @apply w-3 h-3;
}

.clear-all-tags {
  @apply px-2 py-1 text-xs text-blue-600 hover:text-blue-800 underline;
}

.filter-stats {
  @apply flex items-center justify-between py-3 border-t border-gray-200;
}

.stats-item {
  @apply flex items-center space-x-1;
}

.stats-label {
  @apply text-sm text-gray-600;
}

.stats-value {
  @apply text-lg font-semibold text-blue-600;
}

.filter-actions {
  @apply flex flex-wrap gap-3 pt-3 border-t border-gray-200;
}

.reset-btn,
.save-btn,
.advanced-btn {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors;
}

.reset-btn {
  @apply border-gray-300 text-gray-700 hover:bg-gray-50;
}

.advanced-btn {
  @apply border-gray-300 text-gray-700 hover:bg-gray-50;
}

.advanced-btn.active {
  @apply bg-blue-50 border-blue-500 text-blue-600;
}

.save-btn {
  @apply border-blue-300 text-blue-700 hover:bg-blue-50;
}

.advanced-panel {
  @apply p-4 bg-gray-50 rounded-lg space-y-4;
}

.advanced-group {
  @apply space-y-2;
}

.time-range {
  @apply w-full;
}

.range-labels {
  @apply flex justify-between text-xs text-gray-600;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .blog-filter {
    @apply p-4;
  }
  
  .filter-grid {
    @apply grid-cols-1 gap-4;
  }
  
  .category-tags {
    @apply gap-1;
  }
  
  .category-tag {
    @apply px-2 py-1 text-xs;
  }
  
  .tag-cloud {
    @apply max-h-24;
  }
  
  .filter-stats {
    @apply flex-col items-start gap-2;
  }
  
  .filter-actions {
    @apply gap-2;
  }
  
  .active-filters {
    @apply flex-col items-start gap-2;
  }
}
</style>