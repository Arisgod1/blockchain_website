<template>
  <div class="project-filter">
    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <SearchIcon class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索项目名称、描述、技术栈..."
          class="search-input"
          @input="handleSearch"
        />
        <button 
          v-if="searchQuery"
          @click="clearSearch"
          class="clear-btn"
        >
          <XIcon />
        </button>
      </div>
    </div>

    <!-- 筛选器网格 -->
    <div class="filter-grid">
      <!-- 分类筛选 -->
      <div class="filter-group">
        <label class="filter-label">项目分类</label>
        <div class="category-tags">
          <button
            v-for="category in categories"
            :key="category.value"
            :class="['category-tag', { active: selectedCategory === category.value }]"
            @click="selectCategory(category.value)"
          >
            {{ category.label }}
          </button>
        </div>
      </div>

      <!-- 状态筛选 -->
      <div class="filter-group">
        <label class="filter-label">项目状态</label>
        <div class="status-options">
          <label 
            v-for="status in projectStatuses" 
            :key="status.value"
            class="status-option"
          >
            <input
              type="checkbox"
              :value="status.value"
              v-model="selectedStatuses"
              @change="handleStatusChange"
            />
            <span class="status-text">{{ status.label }}</span>
          </label>
        </div>
      </div>

      <!-- 技术栈筛选 -->
      <div class="filter-group">
        <label class="filter-label">技术栈</label>
        <div class="tech-stack-filters">
          <div class="selected-techs" v-if="selectedTechStack.length > 0">
            <span 
              v-for="tech in selectedTechStack" 
              :key="tech"
              class="selected-tech-tag"
            >
              {{ tech }}
              <button @click="removeTech(tech)" class="remove-tech-btn">
                <XIcon />
              </button>
            </span>
            <button @click="clearTechStack" class="clear-tech-btn">
              清除全部
            </button>
          </div>
          <div class="tech-stack-selector">
            <select 
              v-model="techToAdd"
              @change="addTech"
              class="tech-select"
            >
              <option value="">选择技术栈</option>
              <option 
                v-for="tech in availableTechStack" 
                :key="tech"
                :value="tech"
              >
                {{ tech }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 排序选项 -->
      <div class="filter-group">
        <label class="filter-label">排序方式</label>
        <div class="sort-options">
          <select v-model="sortBy" @change="handleSortChange" class="sort-select">
            <option value="updateTime">更新时间</option>
            <option value="createTime">创建时间</option>
            <option value="title">项目名称</option>
            <option value="likes">点赞数</option>
            <option value="progress">完成进度</option>
          </select>
          <button 
            @click="toggleSortOrder"
            class="sort-order-btn"
            :class="{ desc: sortOrder === 'desc' }"
          >
            <ArrowUpIcon v-if="sortOrder === 'asc'" />
            <ArrowDownIcon v-else />
          </button>
        </div>
      </div>

      <!-- 团队规模 -->
      <div class="filter-group">
        <label class="filter-label">团队规模</label>
        <div class="team-size-options">
          <label 
            v-for="size in teamSizes" 
            :key="size.value"
            class="team-size-option"
          >
            <input
              type="checkbox"
              :value="size.value"
              v-model="selectedTeamSizes"
              @change="handleTeamSizeChange"
            />
            <span class="size-text">{{ size.label }}</span>
          </label>
        </div>
      </div>

      <!-- 活跃状态 -->
      <div class="filter-group">
        <label class="filter-label">活跃状态</label>
        <div class="activity-filter">
          <label class="activity-option">
            <input
              type="checkbox"
              v-model="showActiveOnly"
              @change="handleActivityFilter"
            />
            <span class="activity-text">只显示活跃项目</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 筛选结果统计 -->
    <div class="filter-stats">
      <div class="stats-item">
        <span class="stats-label">共找到</span>
        <span class="stats-value">{{ totalCount }}</span>
        <span class="stats-label">个项目</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">显示</span>
        <span class="stats-value">{{ filteredCount }}</span>
        <span class="stats-label">个项目</span>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="filter-actions">
      <button @click="resetFilters" class="reset-btn">
        <RotateCcwIcon />
        重置筛选
      </button>
      <button @click="saveFilters" class="save-btn">
        <BookmarkIcon />
        保存筛选
      </button>
      <button @click="exportResults" class="export-btn">
        <DownloadIcon />
        导出结果
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 筛选选项接口
interface FilterOptions {
  searchQuery: string
  category: string
  statuses: string[]
  techStack: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
  teamSizes: string[]
  showActiveOnly: boolean
}

// 分类选项
const categories = [
  { label: '全部', value: 'all' },
  { label: 'DeFi', value: 'defi' },
  { label: 'NFT', value: 'nft' },
  { label: 'Web3', value: 'web3' },
  { label: '智能合约', value: 'smart-contract' },
  { label: '共识算法', value: 'consensus' },
  { label: '钱包', value: 'wallet' },
  { label: '交易所', value: 'exchange' },
  { label: '元宇宙', value: 'metaverse' }
]

// 项目状态选项
const projectStatuses = [
  { label: '规划中', value: 'planning' },
  { label: '开发中', value: 'in-progress' },
  { label: '已完成', value: 'completed' },
  { label: '已暂停', value: 'paused' }
]

// 技术栈选项
const availableTechStack = [
  'Solidity', 'Rust', 'Go', 'JavaScript', 'TypeScript',
  'Python', 'Java', 'C++', 'React', 'Vue.js', 'Node.js',
  'Web3.js', 'Ethers.js', 'Hardhat', 'Truffle', 'IPFS',
  'The Graph', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis'
]

// 团队规模选项
const teamSizes = [
  { label: '1-5人', value: 'small' },
  { label: '6-10人', value: 'medium' },
  { label: '11-20人', value: 'large' },
  { label: '20人以上', value: 'xlarge' }
]

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedStatuses = ref<string[]>([])
const selectedTechStack = ref<string[]>([])
const sortBy = ref('updateTime')
const sortOrder = ref<'asc' | 'desc'>('desc')
const selectedTeamSizes = ref<string[]>([])
const showActiveOnly = ref(false)
const techToAdd = ref('')

// 计算属性
const totalCount = ref(45) // 总项目数
const filteredCount = ref(45) // 筛选后项目数

// 事件处理
const handleSearch = () => {
  emitFilterChange()
}

const selectCategory = (category: string) => {
  selectedCategory.value = category
  emitFilterChange()
}

const handleStatusChange = () => {
  emitFilterChange()
}

const addTech = () => {
  if (techToAdd.value && !selectedTechStack.value.includes(techToAdd.value)) {
    selectedTechStack.value.push(techToAdd.value)
    techToAdd.value = ''
    emitFilterChange()
  }
}

const removeTech = (tech: string) => {
  const index = selectedTechStack.value.indexOf(tech)
  if (index > -1) {
    selectedTechStack.value.splice(index, 1)
    emitFilterChange()
  }
}

const clearTechStack = () => {
  selectedTechStack.value = []
  emitFilterChange()
}

const handleSortChange = () => {
  emitFilterChange()
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  emitFilterChange()
}

const handleTeamSizeChange = () => {
  emitFilterChange()
}

const handleActivityFilter = () => {
  emitFilterChange()
}

const clearSearch = () => {
  searchQuery.value = ''
  emitFilterChange()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedStatuses.value = []
  selectedTechStack.value = []
  sortBy.value = 'updateTime'
  sortOrder.value = 'desc'
  selectedTeamSizes.value = []
  showActiveOnly.value = false
  techToAdd.value = ''
  emitFilterChange()
}

const saveFilters = () => {
  const filterOptions = getCurrentFilters()
  localStorage.setItem('projectFilters', JSON.stringify(filterOptions))
  alert('筛选条件已保存')
}

const exportResults = () => {
  const filters = getCurrentFilters()
  const params = new URLSearchParams()
  
  if (filters.searchQuery) params.append('search', filters.searchQuery)
  if (filters.category && filters.category !== 'all') params.append('category', filters.category)
  if (filters.statuses.length) params.append('statuses', filters.statuses.join(','))
  if (filters.techStack.length) params.append('techStack', filters.techStack.join(','))
  if (filters.teamSizes.length) params.append('teamSizes', filters.teamSizes.join(','))
  if (filters.sortBy !== 'updateTime') params.append('sortBy', filters.sortBy)
  if (filters.sortOrder !== 'desc') params.append('sortOrder', filters.sortOrder)
  if (filters.showActiveOnly) params.append('activeOnly', 'true')
  
  const url = `/projects?${params.toString()}`
  window.open(url, '_blank')
}

// 获取当前筛选条件
const getCurrentFilters = (): FilterOptions => ({
  searchQuery: searchQuery.value,
  category: selectedCategory.value,
  statuses: [...selectedStatuses.value],
  techStack: [...selectedTechStack.value],
  sortBy: sortBy.value,
  sortOrder: sortOrder.value,
  teamSizes: [...selectedTeamSizes.value],
  showActiveOnly: showActiveOnly.value
})

// 发送筛选变化事件
const emitFilterChange = () => {
  const filters = getCurrentFilters()
  emit('filter-change', filters)
}

// 监听筛选条件变化，更新计数
watch([searchQuery, selectedCategory, selectedStatuses, selectedTechStack, selectedTeamSizes, showActiveOnly], () => {
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
const BookmarkIcon = () => import('@/components/icons').then(m => m.BookmarkIcon)
const DownloadIcon = () => import('@/components/icons').then(m => m.DownloadIcon)
</script>

<style scoped>
.project-filter {
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
  @apply px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer transition-all hover:border-blue-500 hover:text-blue-600;
}

.category-tag.active {
  @apply bg-blue-500 text-white border-blue-500;
}

.status-options,
.team-size-options,
.activity-filter {
  @apply space-y-2;
}

.status-option,
.team-size-option,
.activity-option {
  @apply flex items-center space-x-2 cursor-pointer;
}

.status-text,
.size-text,
.activity-text {
  @apply text-sm text-gray-700;
}

.tech-stack-filters {
  @apply space-y-3;
}

.selected-techs {
  @apply flex flex-wrap gap-2;
}

.selected-tech-tag {
  @apply inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full;
}

.remove-tech-btn {
  @apply w-4 h-4 flex items-center justify-center rounded-full hover:bg-blue-200;
}

.clear-tech-btn {
  @apply px-2 py-1 text-xs text-blue-600 hover:text-blue-800 underline;
}

.tech-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.sort-options {
  @apply flex gap-2;
}

.sort-select {
  @apply flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.sort-order-btn {
  @apply w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors;
}

.sort-order-btn.desc {
  @apply bg-blue-50 border-blue-500 text-blue-600;
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
.export-btn {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors;
}

.reset-btn {
  @apply border-gray-300 text-gray-700 hover:bg-gray-50;
}

.save-btn {
  @apply border-blue-300 text-blue-700 hover:bg-blue-50;
}

.export-btn {
  @apply border-green-300 text-green-700 hover:bg-green-50;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .project-filter {
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
  
  .filter-stats {
    @apply flex-col items-start gap-2;
  }
  
  .filter-actions {
    @apply gap-2;
  }
  
  .reset-btn,
  .save-btn,
  .export-btn {
    @apply px-3 py-2 text-sm;
  }
}
</style>