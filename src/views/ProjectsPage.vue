<template>
  <div class="projects-page">
    <!-- 页面头部 -->
    <div class="page-header">
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
    </div>

    <!-- 主要内容区域 -->
    <div class="page-content">
      <div class="container">
        <div class="content-layout">
          <!-- 筛选侧边栏 -->
          <aside class="filter-sidebar">
            <div class="sidebar-header">
              <h3 class="sidebar-title">
                项目筛选
              </h3>
            </div>
            <ProjectFilter @filter-change="handleFilterChange" />
          </aside>

          <!-- 项目列表区域 -->
          <main class="projects-main">
            <!-- 工具栏 -->
            <div class="projects-toolbar">
              <div class="toolbar-left">
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
                    v-model="perPage"
                    class="per-page-select"
                    @change="handlePerPageChange"
                  >
                    <option :value="12">
                      12个/页
                    </option>
                    <option :value="24">
                      24个/页
                    </option>
                    <option :value="48">
                      48个/页
                    </option>
                  </select>
                </div>
                <div>
                  <BaseButton
                    size="sm"
                    @click="openCreateModal"
                  >
                    + 新建项目
                  </BaseButton>
                </div>
              </div>
            </div>

            <div
              v-if="usingFallback"
              class="fallback-banner"
            >
              <span>当前展示本地示例数据，后台服务启动后将自动同步。</span>
            </div>

            <!-- 加载状态 -->
            <div
              v-if="isLoading && !hasLoadedOnce"
              class="loading-container"
            >
              <div class="loading-spinner" />
              <p class="loading-text">
                加载项目中...
              </p>
            </div>

            <!-- 错误状态 -->
            <div
              v-else-if="errorMessage && !hasProjects"
              class="error-state"
            >
              <p>{{ errorMessage }}</p>
              <BaseButton
                variant="outline"
                @click="() => loadProjects()"
              >
                重试
              </BaseButton>
            </div>

            <!-- 空状态 -->
            <div
              v-else-if="!hasProjects"
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
              class="projects-grid-wrapper"
            >
              <transition
                name="fade"
                appear
              >
                <div
                  v-if="isLoading && hasLoadedOnce"
                  class="grid-overlay"
                >
                  <div class="loading-spinner small" />
                  <p class="loading-text">
                    正在刷新项目列表...
                  </p>
                </div>
              </transition>

              <div :class="['projects-grid', `view-${viewMode}`]">
                <ProjectCard
                  v-for="project in paginatedProjects"
                  :key="project.id"
                  :project="project"
                  @select="showProjectDetail"
                  @like="handleProjectLike"
                  @documentation="showProjectDocumentation"
                />
              </div>
            </div>

            <!-- 分页 -->
            <div
              v-if="hasProjects && totalElements > perPage"
              class="pagination-container"
            >
              <div class="pagination-info">
                显示 {{ pageRange.start }} - {{ pageRange.end }} 项，共 {{ totalElements }} 项
              </div>
              <BasePagination
                v-model:current="currentPage"
                :page-size="perPage"
                :total="totalElements"
                @change="handlePageChange"
              />
            </div>
          </main>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Project, FilterOptions, ProjectPage } from '@/types/entities'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import ProjectFilter from '@/components/projects/ProjectFilter.vue'
import ProjectDetailModal from '@/components/projects/ProjectDetailModal.vue'
import ProjectCreateModal from '@/components/projects/ProjectCreateModal.vue'
import { getProjects } from '@/api/project'
import { Status } from '@/types/entities'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseButton from '@/components/common/BaseButton.vue'

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
const PROJECTS_CACHE_KEY = 'projects:list-cache'

const isLoading = ref(true)
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const perPage = ref(12)
const totalProjects = ref<Project[]>([])
const isCreateModalVisible = ref(false)
const selectedProject = ref<Project | null>(null)
const filters = ref<FilterOptions>({})
const totalElements = ref(0)
const errorMessage = ref('')
const hasLoadedOnce = ref(false)
const usingFallback = ref(false)

// 计算属性
const stats = computed(() => {
  const totalProjectsCount = totalProjects.value.length
  const activeProjectsCount = totalProjects.value.filter(p => String(p.status) === String(Status.InProgress) || String(p.status).toUpperCase() === 'IN_PROGRESS').length
  const completedProjectsCount = totalProjects.value.filter(p => String(p.status) === String(Status.Completed) || String(p.status).toUpperCase() === 'COMPLETED').length
  
  const uniqueContributors = new Set(totalProjects.value.flatMap(p => p.contributors || [])).size
  
  return {
    totalProjects: totalProjectsCount,
    activeProjects: activeProjectsCount,
    completedProjects: completedProjectsCount,
    totalContributors: Math.max(uniqueContributors, 15)
  }
})

const paginatedProjects = computed(() => {
  if (usingFallback.value) {
    const start = (currentPage.value - 1) * perPage.value
    return totalProjects.value.slice(start, start + perPage.value)
  }
  return totalProjects.value
})

const hasProjects = computed(() => totalElements.value > 0)

const pageRange = computed(() => {
  if (!hasProjects.value || !paginatedProjects.value.length) {
    return { start: 0, end: 0 }
  }
  const start = (currentPage.value - 1) * perPage.value + 1
  const end = usingFallback.value
    ? Math.min(start + perPage.value - 1, totalElements.value)
    : start + paginatedProjects.value.length - 1
  return { start, end }
})

const applyProjectResponse = (response: ProjectPage, options: { resetPage?: boolean } = {}) => {
  totalProjects.value = response.content ?? []
  totalElements.value = response.totalElements ?? response.total ?? totalProjects.value.length
  const fallbackMode = Boolean(response.fromFallback)
  usingFallback.value = fallbackMode

  if (!fallbackMode) {
    const resolvedPage = response.page ?? (response.number ?? 0) + 1
    currentPage.value = options.resetPage ? 1 : resolvedPage
  } else if (options.resetPage) {
    currentPage.value = 1
  }
}

const cacheProjectsSnapshot = (payload: ProjectPage) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(payload))
  } catch (error) {
    console.warn('缓存项目列表失败', error)
  }
}

const hydrateProjectsFromCache = (silent = false) => {
  if (typeof window === 'undefined') return false
  try {
    const cacheRaw = window.localStorage.getItem(PROJECTS_CACHE_KEY)
    if (!cacheRaw) return false
    const parsed = JSON.parse(cacheRaw) as ProjectPage
    if (!parsed?.content?.length) return false
    applyProjectResponse({ ...parsed, fromFallback: true }, { resetPage: true })
    if (!silent) {
      errorMessage.value = ''
    }
    return true
  } catch (error) {
    console.warn('读取项目缓存失败', error)
    return false
  }
}

// 方法
interface ProjectFilterPayload {
  searchQuery?: string
  category?: string
  statuses?: string[]
  techStack?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

const handleFilterChange = (newFilters: ProjectFilterPayload) => {
  filters.value = {
    search: newFilters.searchQuery,
    category: newFilters.category,
    status: newFilters.statuses && newFilters.statuses.length > 0 ? newFilters.statuses[0] : undefined,
    tags: newFilters.techStack,
    sortBy: newFilters.sortBy,
    sortOrder: newFilters.sortOrder
  }
  currentPage.value = 1
  loadProjects({ resetPage: true })
}

const setViewMode = (mode: 'grid' | 'list') => {
  viewMode.value = mode
}

const handlePerPageChange = () => {
  currentPage.value = 1
  if (usingFallback.value) return
  loadProjects({ resetPage: true })
}

const handlePageChange = (page: number) => {
  if (page === currentPage.value) return
  currentPage.value = page
  if (usingFallback.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  loadProjects()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const showProjectDetail = (project: Project) => {
  selectedProject.value = project
}

const closeProjectDetail = () => {
  selectedProject.value = null
}

const resolveDocumentationLink = (project: Project): string | null => {
  const docSources = [project.documentation, project.documentationUrl]
  for (const source of docSources) {
    if (typeof source === 'string' && source.trim().length > 0) {
      return source.trim()
    }
  }
  return null
}

const showProjectDocumentation = (project: Project) => {
  const docLink = resolveDocumentationLink(project)
  if (docLink) {
    window.open(docLink, '_blank')
  }
}

const handleProjectLike = (project: Project) => {
  // 处理项目点赞
  const index = totalProjects.value.findIndex(p => p.id === project.id)
  if (index > -1) {
    totalProjects.value[index] = project
  }
}

const resetFilters = () => {
  filters.value = {}
  currentPage.value = 1
  loadProjects({ resetPage: true })
}

const loadProjects = async (options: { resetPage?: boolean } = {}) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await getProjects({
      page: Math.max(currentPage.value - 1, 0),
      size: perPage.value,
      keyword: filters.value.search,
      category: filters.value.category,
      status: filters.value.status
    })
    applyProjectResponse(res, options)
    cacheProjectsSnapshot(res)
  } catch (err) {
    console.error('获取项目列表失败', err)
    const message = err instanceof Error ? err.message : '获取项目列表失败'
    errorMessage.value = message
    if (!totalProjects.value.length) {
      if (hydrateProjectsFromCache(true)) {
        errorMessage.value = '当前展示离线缓存数据'
      } else {
        totalProjects.value = []
        totalElements.value = 0
      }
    }
  } finally {
    isLoading.value = false
    hasLoadedOnce.value = true
  }
}

// 生命周期
onMounted(() => {
  if (hydrateProjectsFromCache(true)) {
    hasLoadedOnce.value = true
  }
  loadProjects()
})

// 打开新建模态
const openCreateModal = () => { isCreateModalVisible.value = true }
const closeCreateModal = () => { isCreateModalVisible.value = false }

const handleProjectCreated = (project: Project) => {
  // 将新项目添加到列表顶部并关闭模态
  totalProjects.value.unshift(project)
  totalElements.value += 1
  closeCreateModal()
}

// 图标组件
const GridIcon = () => import('@/components/icons').then(m => m.GridIcon)
const ListIcon = () => import('@/components/icons').then(m => m.ListIcon)
const FolderXIcon = () => import('@/components/icons').then(m => m.FolderXIcon)
</script>

<style scoped lang="postcss">
.projects-page {
  @apply min-h-screen bg-gray-50;
}

.page-header {
  @apply bg-gradient-to-r from-blue-600 to-purple-700 text-white;
}

.header-content {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12;
}

.header-text {
  @apply text-center mb-8;
}

.page-title {
  @apply text-4xl font-bold mb-4;
}

.page-description {
  @apply text-xl text-blue-100 max-w-3xl mx-auto;
}

.header-stats {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto;
}

.stat-card {
  @apply bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center;
}

.stat-value {
  @apply text-3xl font-bold mb-2;
}

.stat-label {
  @apply text-blue-100 text-sm;
}

.page-content {
  @apply py-12;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.content-layout {
  @apply grid gap-8 items-start;
  grid-template-columns: minmax(0, 300px) minmax(0, 1fr);
}

.filter-sidebar {
  @apply w-full lg:w-80 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit lg:sticky lg:top-8;
}

.sidebar-header {
  @apply flex items-center justify-between mb-6;
}

.sidebar-title {
  @apply text-lg font-semibold text-gray-900;
}

.close-sidebar-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100;
}

.projects-main {
  @apply flex-1 space-y-6;
}

.projects-toolbar {
  @apply flex flex-wrap items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4;
}

.fallback-banner {
  @apply mt-4 mb-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-center gap-2;
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

.loading-spinner.small {
  @apply w-8 h-8 border-2 border-blue-200 border-t-blue-500 mb-2;
}

.loading-text {
  @apply text-gray-600;
}

.error-state {
  @apply flex flex-col items-center justify-center py-16 text-center text-gray-600 gap-4;
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
  @apply relative;
}

.projects-grid.view-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.projects-grid.view-list {
  @apply flex flex-col gap-4;
}

.projects-grid-wrapper {
  @apply relative min-h-[300px];
}

.grid-overlay {
  @apply absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm text-gray-600;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-content {
    @apply py-8;
  }

  .content-layout {
    grid-template-columns: 1fr;
  }

  .filter-sidebar {
    @apply w-full;
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

@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
}
</style>