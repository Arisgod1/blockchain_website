<template>
  <div class="member-filter">
    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <SearchIcon class="search-icon" />
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="搜索成员姓名或技能..."
          class="search-input"
          @input="handleSearch"
        />
        <button
          v-if="localFilters.search"
          @click="clearSearch"
          class="clear-btn"
        >
          <XIcon />
        </button>
      </div>
    </div>

    <!-- 角色筛选 -->
    <div class="filter-section">
      <h4 class="filter-title">角色分类</h4>
      <div class="filter-chips">
        <button
          v-for="role in roles"
          :key="role.id"
          class="filter-chip"
          :class="{ active: localFilters.role === role.id }"
          @click="selectRole(role.id)"
        >
          {{ role.name }}
          <span class="count" v-if="role.count !== undefined">({{ role.count }})</span>
        </button>
      </div>
    </div>

    <!-- 技术栈筛选 -->
    <div class="filter-section">
      <h4 class="filter-title">技术栈</h4>
      <div class="filter-chips">
        <button
          v-for="tech in techStacks"
          :key="tech"
          class="filter-chip"
          :class="{ active: localFilters.skills.includes(tech) }"
          @click="toggleSkill(tech)"
        >
          {{ tech }}
        </button>
      </div>
    </div>

    <!-- 排序选项 -->
    <div class="filter-section">
      <h4 class="filter-title">排序方式</h4>
      <select
        v-model="localFilters.sortBy"
        class="sort-select"
        @change="handleSortChange"
      >
        <option value="name">按姓名排序</option>
        <option value="joinDate">按加入时间</option>
        <option value="projectCount">按项目数量</option>
        <option value="role">按角色</option>
      </select>
    </div>

    <!-- 活跃状态 -->
    <div class="filter-section">
      <h4 class="filter-title">成员状态</h4>
      <div class="status-toggle">
        <label class="toggle-item">
          <input
            v-model="localFilters.isActive"
            type="checkbox"
            @change="handleStatusChange"
          />
          <span class="toggle-switch"></span>
          <span class="toggle-label">仅显示活跃成员</span>
        </label>
      </div>
    </div>

    <!-- 清除筛选 -->
    <div class="filter-actions">
      <button
        @click="clearAllFilters"
        class="clear-all-btn"
      >
        <RefreshCcwIcon />
        清除所有筛选
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { SearchIcon, XIcon, RefreshCcwIcon } from '@/components/icons'

interface RoleOption {
  id: string
  name: string
  count?: number
}

interface FilterOptions {
  search?: string
  role?: string
  skills: string[]
  sortBy: string
  isActive?: boolean
}

interface Props {
  filters: FilterOptions
  roles?: RoleOption[]
  techStacks?: string[]
}

interface Emits {
  'update:filters': [filters: FilterOptions]
  'change': [filters: FilterOptions]
}

const props = withDefaults(defineProps<Props>(), {
  roles: () => [
    { id: 'all', name: '全部成员', count: 28 },
    { id: 'leader', name: '组长' },
    { id: 'tech-lead', name: '技术负责人' },
    { id: 'developer', name: '开发成员' },
    { id: 'researcher', name: '研究员' }
  ],
  techStacks: () => [
    'Solidity', 'Web3.js', 'React', 'Vue.js', 'Python', 'Django',
    'Node.js', 'TypeScript', 'IPFS', 'Ethereum', 'DeFi', 'NFT'
  ]
})

const emit = defineEmits<Emits>()

const localFilters = ref<FilterOptions>({
  search: '',
  role: 'all',
  skills: [],
  sortBy: 'name',
  isActive: undefined,
  ...props.filters
})

// 监听 props 变化
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...localFilters.value, ...newFilters }
}, { deep: true })

// 搜索处理
const handleSearch = () => {
  updateFilters()
}

// 清除搜索
const clearSearch = () => {
  localFilters.value.search = ''
  updateFilters()
}

// 选择角色
const selectRole = (roleId: string) => {
  localFilters.value.role = roleId
  updateFilters()
}

// 切换技能筛选
const toggleSkill = (skill: string) => {
  const skills = localFilters.value.skills
  const index = skills.indexOf(skill)
  
  if (index > -1) {
    skills.splice(index, 1)
  } else {
    skills.push(skill)
  }
  
  updateFilters()
}

// 排序变更
const handleSortChange = () => {
  updateFilters()
}

// 状态变更
const handleStatusChange = () => {
  updateFilters()
}

// 清除所有筛选
const clearAllFilters = () => {
  localFilters.value = {
    search: '',
    role: 'all',
    skills: [],
    sortBy: 'name',
    isActive: undefined
  }
  updateFilters()
}

// 更新筛选条件
const updateFilters = () => {
  emit('update:filters', { ...localFilters.value })
  emit('change', { ...localFilters.value })
}
</script>

<style scoped>
.member-filter {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6;
}

.search-section {
  @apply relative;
}

.search-input-wrapper {
  @apply relative flex items-center;
}

.search-input {
  @apply w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.search-icon {
  @apply absolute left-3 w-5 h-5 text-gray-400;
}

.clear-btn {
  @apply absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors;
}

.filter-section {
  @apply space-y-3;
}

.filter-title {
  @apply text-sm font-medium text-gray-900;
}

.filter-chips {
  @apply flex flex-wrap gap-2;
}

.filter-chip {
  @apply px-3 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors;
}

.filter-chip.active {
  @apply bg-blue-500 text-white border-blue-500;
}

.count {
  @apply ml-1 text-xs opacity-75;
}

.sort-select {
  @apply w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.status-toggle {
  @apply flex items-center space-x-3;
}

.toggle-item {
  @apply flex items-center space-x-3 cursor-pointer;
}

.toggle-item input {
  @apply sr-only;
}

.toggle-switch {
  @apply relative w-10 h-6 bg-gray-300 rounded-full transition-colors;
}

.toggle-item input:checked + .toggle-switch {
  @apply bg-blue-500;
}

.toggle-switch::before {
  @apply absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform;
  content: '';
}

.toggle-item input:checked + .toggle-switch::before {
  @apply transform translate-x-4;
}

.toggle-label {
  @apply text-sm text-gray-700;
}

.filter-actions {
  @apply pt-4 border-t border-gray-200;
}

.clear-all-btn {
  @apply w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .member-filter {
    @apply p-4;
  }
  
  .filter-chips {
    @apply gap-1;
  }
  
  .filter-chip {
    @apply px-2 py-1 text-xs;
  }
}
</style>