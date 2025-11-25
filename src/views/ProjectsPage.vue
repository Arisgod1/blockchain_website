<template>
  <div class="projects-page">
    <!-- 页面头部 -->
    <header class="gradient-hero flowing-gradient-nebula text-white overflow-hidden page-header">
      <div class="hero-stars">
        <span style="top:10%;left:15%;animation-duration:19s" />
        <span style="top:30%;left:78%;animation-duration:23s;animation-delay:0.8s" />
        <span style="top:58%;left:25%;animation-duration:16s;animation-delay:2s" />
        <span style="top:80%;left:65%;animation-duration:25s;animation-delay:3.4s" />
      </div>
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">
            项目展示
          </h1>
          <p class="page-description">
            探索我们的区块链项目，从概念到实现，见证技术的力量
          </p>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-value">
              {{ stats.totalProjects }}
            </div>
            <div class="stat-label">
              总项目数
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-value">
              {{ stats.activeProjects }}
            </div>
            <div class="stat-label">
              活跃项目
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-value">
              {{ stats.completedProjects }}
            </div>
            <div class="stat-label">
              已完成
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-value">
              {{ stats.totalContributors }}
            </div>
            <div class="stat-label">
              贡献者
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div class="page-content">
      <!-- 筛选侧边栏 -->
      <div
        class="filter-sidebar"
        :class="{ 'filter-sidebar-mobile': showMobileFilters }"
      >
        <div class="sidebar-header">
          <h3 class="sidebar-title">
            项目筛选
          </h3>
          <button
            class="close-sidebar-btn md:hidden"
            @click="toggleMobileFilters"
          >
            <XIcon />
          </button>
        </div>
        <ProjectFilter @filter-change="handleFilterChange" />
      </div>

      <!-- 项目列表区域 -->
      <div class="projects-main">
        <!-- 工具栏 -->
        <div class="projects-toolbar">
          <div class="toolbar-left">
            <button 
              class="mobile-filter-btn md:hidden"
              @click="toggleMobileFilters"
            >
              <FilterIcon />
              筛选
            </button>
            <div class="view-mode-selector">
              <button 
                :class="['view-mode-btn', { active: viewMode === 'grid' }]"
                @click="setViewMode('grid')"
              >
                <GridIcon />
              </button>
              <button 
                :class="['view-mode-btn', { active: viewMode === 'list' }]"
                @click="setViewMode('list')"
              >
                <ListIcon />
              </button>
            </div>
          </div>
          
          <div class="toolbar-right">
            <div class="per-page-selector">
              <select
                v-model.number="perPage"
                class="per-page-select"
                @change="handlePerPageChange"
              >
                <option value="12">
                  12个/页
                </option>
                <option value="24">
                  24个/页
                </option>
                <option value="48">
                  48个/页
                </option>
              </select>
            </div>
            <div>
              <button
                class="px-3 py-2 bg-green-500 text-white rounded-lg"
                @click="openCreateModal"
              >
                + 新建项目
              </button>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div
          v-if="isLoading"
          class="loading-container"
        >
          <div class="loading-spinner" />
          <p class="loading-text">
            加载项目中...
          </p>
        </div>

        <!-- 空状态 -->
        <div
          v-else-if="filteredProjects.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">
            <FolderXIcon />
          </div>
          <h3 class="empty-title">
            未找到匹配的项目
          </h3>
          <p class="empty-description">
            尝试调整筛选条件或搜索关键词
          </p>
          <button
            class="empty-action-btn"
            @click="resetFilters"
          >
            重置筛选条件
          </button>
        </div>

        <!-- 项目网格 -->
        <div
          v-else
          :class="['projects-grid', `view-${viewMode}`]"
        >
          <ProjectCard
            v-for="project in paginatedProjects"
            :key="project.id"
            :project="project"
            @select="showProjectDetail"
            @like="handleProjectLike"
            @documentation="showProjectDocumentation"
          />
        </div>

        <!-- 分页 -->
        <div
          v-if="filteredProjects.length > 0"
          class="pagination-container"
        >
          <div class="pagination-info">
            显示 {{ paginationRange.start }} - {{ paginationRange.end }} 项，
            共 {{ totalElements }} 项
          </div>
          <div class="pagination">
            <button 
              :disabled="currentPage === 1"
              class="pagination-btn"
              @click="goToPage(currentPage - 1)"
            >
              <ChevronLeftIcon />
              上一页
            </button>
            
            <div class="pagination-numbers">
              <button
                v-for="page in visiblePages"
                :key="page"
                :class="['pagination-number', { active: page === currentPage }]"
                @click="typeof page === 'number' && goToPage(page)"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              :disabled="currentPage === totalPages"
              class="pagination-btn"
              @click="goToPage(currentPage + 1)"
            >
              下一页
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目详情模态框 -->
    <ProjectDetailModal
      v-if="selectedProject"
      :project="selectedProject"
      @close="closeProjectDetail"
      @like="handleProjectLike"
    />

    <!-- 新建项目模态 -->
    <ProjectCreateModal
      v-if="isCreateModalVisible"
      @created="handleProjectCreated"
      @close="closeCreateModal"
    />

    <!-- 移动端遮罩 -->
    <div 
      v-if="showMobileFilters"
      class="mobile-overlay md:hidden"
      @click="toggleMobileFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Project, FilterOptions } from '@/types/entities'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import ProjectFilter from '@/components/projects/ProjectFilter.vue'
import ProjectDetailModal from '@/components/projects/ProjectDetailModal.vue'
import ProjectCreateModal from '@/components/projects/ProjectCreateModal.vue'
import { getProjects } from '@/api/project'
import { Status } from '@/types/entities'
import {
  FilterIcon,
  GridIcon,
  ListIcon,
  XIcon,
  FolderXIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@/components/icons'

interface ProjectFilterSelection {
  searchQuery?: string
  category?: string
  statuses?: string[]
  techStack?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  teamSizes?: string[]
  showActiveOnly?: boolean
}

// 页面元数据设置
onMounted(() => {
  document.title = '项目展示 - 大连理工大学区块链组'
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', '浏览我们的区块链项目集合，包括DeFi、NFT、智能合约等多个领域的创新项目')
  } else {
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = '浏览我们的区块链项目集合，包括DeFi、NFT、智能合约等多个领域的创新项目'
    document.head.appendChild(meta)
  }
})

// 响应式数据
const isLoading = ref(true)
const viewMode = ref<'grid' | 'list'>('grid')
const showMobileFilters = ref(false)
const currentPage = ref(1)
const perPage = ref(12)
const projects = ref<Project[]>([])
const isCreateModalVisible = ref(false)
const selectedProject = ref<Project | null>(null)
const filters = ref<FilterOptions>({})
const totalElements = ref(0)

// 计算属性
const stats = computed(() => {
  const activeProjectsCount = projects.value.filter(p => String(p.status) === String(Status.InProgress) || String(p.status).toUpperCase() === 'IN_PROGRESS').length
  const completedProjectsCount = projects.value.filter(p => String(p.status) === String(Status.Completed) || String(p.status).toUpperCase() === 'COMPLETED').length
  const uniqueContributors = new Set(projects.value.flatMap(p => p.contributors || [])).size

  return {
    totalProjects: totalElements.value,
    activeProjects: activeProjectsCount,
    completedProjects: completedProjectsCount,
    totalContributors: Math.max(uniqueContributors, 15)
  }
})

const filteredProjects = computed(() => projects.value)

const totalPages = computed(() => Math.max(1, Math.ceil(totalElements.value / perPage.value || 1)))

const paginatedProjects = computed(() => projects.value)

const paginationRange = computed(() => {
  if (totalElements.value === 0) {
    return { start: 0, end: 0 }
  }
  const start = (currentPage.value - 1) * perPage.value + 1
  const end = Math.min(currentPage.value * perPage.value, totalElements.value)
  return { start, end }
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2

  const rangeStart = Math.max(1, current - delta)
  const rangeEnd = Math.min(total, current + delta)

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i)
  }

  if (rangeStart > 1) {
    pages.unshift('...')
    pages.unshift(1)
  }

  if (rangeEnd < total) {
    pages.push('...')
    if (total > 1) pages.push(total)
  }

  return pages
})

// 方法
const handleFilterChange = (newFilters: ProjectFilterSelection) => {
  filters.value = {
    search: newFilters.searchQuery,
    category: newFilters.category,
    status: newFilters.statuses && newFilters.statuses.length > 0 ? newFilters.statuses[0] : undefined,
    tags: newFilters.techStack || [],
    sortBy: newFilters.sortBy,
    sortOrder: newFilters.sortOrder
  }
  currentPage.value = 1
  void loadProjects()
}

const setViewMode = (mode: 'grid' | 'list') => {
  viewMode.value = mode
}

const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value
}

const handlePerPageChange = () => {
  currentPage.value = 1
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const showProjectDetail = (project: Project) => {
  selectedProject.value = project
}

const closeProjectDetail = () => {
  selectedProject.value = null
}

const showProjectDocumentation = (project: Project) => {
  // 打开项目文档
  if (project.documentation) {
    window.open(project.documentation, '_blank')
  }
}

const handleProjectLike = (project: Project) => {
  const index = projects.value.findIndex(p => p.id === project.id)
  if (index > -1) {
    projects.value[index] = { ...project }
  }

  if (selectedProject.value?.id === project.id) {
    selectedProject.value = { ...project }
  }
}

const resetFilters = () => {
  filters.value = {}
  currentPage.value = 1
  void loadProjects()
}

const loadProjects = async () => {
  isLoading.value = true
  try {
    const queryParams: Record<string, unknown> = {
      page: currentPage.value - 1,
      size: perPage.value,
      keyword: filters.value.search || undefined,
      category: filters.value.category && filters.value.category !== 'all' ? filters.value.category : undefined,
      status: filters.value.status,
      tag: filters.value.tags && filters.value.tags.length > 0 ? filters.value.tags[0] : undefined,
      sortBy: filters.value.sortBy,
      sortOrder: filters.value.sortOrder
    }
    const res = await getProjects(queryParams)
    projects.value = res.content || []
    totalElements.value = res.totalElements || projects.value.length
  } catch (err) {
    console.error('获取项目列表失败', err)
    projects.value = []
    totalElements.value = 0
  } finally {
    isLoading.value = false
  }
}

watch(currentPage, (newPage, oldPage) => {
  if (newPage !== oldPage) {
    void loadProjects()
  }
})

watch(perPage, (newSize, oldSize) => {
  if (newSize !== oldSize) {
    currentPage.value = 1
    void loadProjects()
  }
})

// 生命周期
onMounted(() => {
  loadProjects()
})

// 打开新建模态
const openCreateModal = () => { isCreateModalVisible.value = true }
const closeCreateModal = () => { isCreateModalVisible.value = false }

const handleProjectCreated = () => {
  closeCreateModal()
  // 刷新列表以确保数据与后端一致
  currentPage.value = 1
  void loadProjects()
}

</script>

<style scoped>
.projects-page {
  @apply min-h-screen bg-gray-50;
}

.page-header {
  @apply text-white;
}

.header-content {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12;
}

.header-text {
  @apply text-center mb-8;
}

.page-title {
  @apply text-4xl font-bold mb-4 text-white;
}

.page-description {
  @apply text-xl text-indigo-100 max-w-3xl mx-auto;
}

.header-stats {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto;
}

.stat-card {
  @apply bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20;
}

.stat-value {
  @apply text-3xl font-bold mb-2;
}

.stat-label {
  @apply text-indigo-100 text-sm;
}

.page-content {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
}

.filter-sidebar {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-8;
}

.sidebar-header {
  @apply flex items-center justify-between mb-8;
}

.sidebar-title {
  @apply text-lg font-semibold text-gray-900;
}

.close-sidebar-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100;
}

.filter-sidebar-mobile {
  @apply fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300;
}

.projects-main {
  @apply space-y-6;
}

.projects-toolbar {
  @apply flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4;
}

.toolbar-left {
  @apply flex items-center gap-4;
}

.mobile-filter-btn {
  @apply flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg;
}

.view-mode-selector {
  @apply flex items-center gap-1 bg-gray-100 rounded-lg p-1;
}

.view-mode-btn {
  @apply w-8 h-8 flex items-center justify-center rounded transition-colors;
}

.view-mode-btn.active {
  @apply bg-white shadow-sm text-blue-600;
}

.toolbar-right {
  @apply flex items-center gap-4;
}

.per-page-selector {
  @apply flex items-center gap-2;
}

.per-page-select {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.loading-container {
  @apply flex flex-col items-center justify-center py-16;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4;
}

.loading-text {
  @apply text-gray-600;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-16 text-center;
}

.empty-icon {
  @apply w-16 h-16 text-gray-400 mb-4;
}

.empty-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.empty-description {
  @apply text-gray-600 mb-6;
}

.empty-action-btn {
  @apply px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors;
}

.projects-grid {
  @apply space-y-6;
}

.projects-grid.view-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.projects-grid.view-list {
  @apply space-y-4;
}

.pagination-container {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.pagination-info {
  @apply text-sm text-gray-600 mb-4;
}

.pagination {
  @apply flex items-center justify-center gap-2;
}

.pagination-btn {
  @apply flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors;
}

.pagination-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.pagination-numbers {
  @apply flex items-center gap-1;
}

.pagination-number {
  @apply w-10 h-10 flex items-center justify-center text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors;
}

.pagination-number.active {
  @apply bg-blue-500 text-white border-blue-500;
}

.mobile-overlay {
  @apply fixed inset-0 bg-black/50 z-40;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filter-sidebar-mobile {
    @apply -translate-x-full;
  }
  
  .filter-sidebar-mobile.show {
    @apply translate-x-0;
  }
  
  .header-stats {
    @apply grid-cols-2 gap-2;
  }
  
  .stat-card {
    @apply p-4;
  }
  
  .stat-value {
    @apply text-2xl;
  }
  
  .projects-toolbar {
    @apply flex-col items-stretch gap-4;
  }
  
  .toolbar-left {
    @apply justify-between;
  }
  
  .projects-grid.view-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .pagination {
    @apply flex-col gap-4;
  }
  
  .pagination-numbers {
    @apply order-first;
  }
}
</style>