<template>
  <div class="meetings-page">
    <!-- 页面头部 -->
    <header class="gradient-hero flowing-gradient-twilight text-white overflow-hidden meetings-header">
      <div class="hero-stars">
        <span style="top:14%;left:18%;animation-duration:18s" />
        <span style="top:38%;left:82%;animation-duration:20s;animation-delay:1.4s" />
        <span style="top:62%;left:30%;animation-duration:17s;animation-delay:2.2s" />
        <span style="top:80%;left:68%;animation-duration:24s;animation-delay:3.5s" />
      </div>
      <div class="header-overlay" />
      <div class="header-content">
        <div class="container">
          <div class="header-text">
            <h1 class="page-title">
              <span class="title-icon">📝</span>
              例会记录
            </h1>
            <p class="page-subtitle">
              团队会议纪要和学术讨论记录
            </p>
          </div>
          
          <!-- 统计数据 -->
          <div class="header-stats">
            <div class="stat-card">
              <div class="stat-icon">
                📅
              </div>
              <div class="stat-content">
                <div class="stat-number">
                  {{ stats.totalMeetings }}
                </div>
                <div class="stat-label">
                  总会次数
                </div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                👥
              </div>
              <div class="stat-content">
                <div class="stat-number">
                  {{ stats.totalParticipants }}
                </div>
                <div class="stat-label">
                  总参与人次
                </div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                ⏱️
              </div>
              <div class="stat-content">
                <div class="stat-number">
                  {{ stats.totalHours }}h
                </div>
                <div class="stat-label">
                  总会议时长
                </div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                📄
              </div>
              <div class="stat-content">
                <div class="stat-number">
                  {{ stats.totalDocuments }}
                </div>
                <div class="stat-label">
                  会议文档
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <section class="meetings-content">
      <div class="container">
        <div class="content-layout">
          <!-- 筛选侧边栏 -->
          <aside
            v-if="!isMobile"
            class="meetings-sidebar"
          >
            <div class="sidebar-sticky">
              <MeetingFilter
                :meetings="filteredMeetings"
                :initial-filters="currentFilters"
                @filter-change="handleFilterChange"
              />
            </div>
          </aside>

          <!-- 移动端筛选按钮 -->
          <button 
            v-if="isMobile"
            class="mobile-filter-toggle"
            :class="{ 'is-active': showMobileFilter }"
            @click="showMobileFilter = !showMobileFilter"
          >
            <svg
              class="toggle-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h8v-2h-8V17h8V15h-8v-2h8V9h-8V7h8V5h-8v2h-8V5H3v2h8v2H3v2h8v2H3v2h8v2H3v2h8v2H3z" />
            </svg>
            筛选条件
          </button>

          <!-- 移动端筛选面板 -->
          <div 
            v-if="isMobile"
            class="mobile-filter-panel"
            :class="{ 'is-open': showMobileFilter }"
          >
            <div class="mobile-filter-content">
              <MeetingFilter
                :meetings="filteredMeetings"
                :initial-filters="currentFilters"
                @filter-change="handleFilterChange"
              />
            </div>
            <div
              class="mobile-filter-backdrop"
              @click="showMobileFilter = false"
            />
          </div>

          <!-- 会议列表区域 -->
          <main class="meetings-main">
            <!-- 视图控制栏 -->
            <div class="view-controls">
              <div class="view-options">
                <button
                  class="view-btn"
                  :class="{ 'is-active': viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                >
                  <svg
                    class="view-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 3v8h8V3H3zm0 10v8h8v-8H3zm10-10v8h8V3h-8zm0 10v8h8v-8h-8z" />
                  </svg>
                  网格视图
                </button>
                <button
                  class="view-btn"
                  :class="{ 'is-active': viewMode === 'list' }"
                  @click="viewMode = 'list'"
                >
                  <svg
                    class="view-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                  </svg>
                  列表视图
                </button>
              </div>
              
              <div class="pagination-info">
                <span class="info-text">
                  显示 {{ getDisplayedCount() }} / 共 {{ filteredMeetings.length }} 个会议
                </span>
              </div>
            </div>

            <!-- 加载状态 -->
            <div
              v-if="isLoading"
              class="loading-state"
            >
              <div class="loading-spinner" />
              <p class="loading-text">
                正在加载会议数据...
              </p>
            </div>

            <!-- 空状态 -->
            <div
              v-else-if="filteredMeetings.length === 0"
              class="empty-state"
            >
              <div class="empty-icon">
                📝
              </div>
              <h3 class="empty-title">
                没有找到会议记录
              </h3>
              <p class="empty-description">
                {{ hasActiveFilters ? '尝试调整筛选条件' : '暂时没有会议记录' }}
              </p>
              <button 
                v-if="hasActiveFilters"
                class="empty-action"
                @click="clearAllFilters"
              >
                清除所有筛选
              </button>
            </div>

            <!-- 会议列表 -->
            <div 
              v-else
              class="meetings-list"
              :class="[
                `meetings-list-${viewMode}`,
                { 'is-loading': isLoadingMore }
              ]"
            >
              <MeetingCard
                v-for="meeting in paginatedMeetings"
                :key="meeting.id"
                :meeting="meeting"
                :view-mode="viewMode"
                @view-detail="meeting => handleViewDetail(meeting as MeetingRecord)"
                @view-files="meeting => handleViewFiles(meeting as MeetingRecord)"
                @view-recording="meeting => handleViewRecording(meeting as MeetingRecord)"
              />
            </div>

            <!-- 分页控制 -->
            <div 
              v-if="filteredMeetings.length > itemsPerPage"
              class="pagination-controls"
            >
              <button
                class="pagination-btn"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                上一页
              </button>
              
              <div class="pagination-pages">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  class="pagination-page"
                  :class="{ 'is-active': page === currentPage }"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>
              </div>
              
              <button
                class="pagination-btn"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                下一页
              </button>
            </div>

            <!-- 加载更多按钮 -->
            <div 
              v-if="viewMode === 'grid' && hasMoreItems"
              class="load-more-section"
            >
              <button
                class="load-more-btn"
                :disabled="isLoadingMore"
                @click="loadMore"
              >
                <span v-if="!isLoadingMore">加载更多</span>
                <span
                  v-else
                  class="loading-text"
                >加载中...</span>
              </button>
            </div>
          </main>
        </div>
      </div>
    </section>

    <!-- 会议详情模态框 -->
    <MeetingDetailModal
      v-if="selectedMeeting"
      :meeting="selectedMeeting"
      :is-open="showDetailModal"
      @close="closeDetailModal"
      @view-files="handleViewFiles"
      @view-recording="handleViewRecording"
    />

    <!-- 相关文件查看模态框 -->
    <FileViewerModal
      v-if="selectedFiles"
      :files="selectedFiles"
      :is-open="showFilesModal"
      @close="closeFilesModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useHead } from '@vueuse/head'
import MeetingCard from '@/components/meetings/MeetingCard.vue'
import MeetingFilter from '@/components/meetings/MeetingFilter.vue'
import MeetingDetailModal from '@/components/meetings/MeetingDetailModal.vue'
import FileViewerModal from '@/components/meetings/FileViewerModal.vue'
import { getMeetings } from '@/api/meeting'
import type { Meeting, MeetingFile } from '@/types/entities'

type MeetingRecord = Meeting

interface MeetingFilterValues {
  statuses?: string[]
  types?: string[]
  attendeeSizes?: string[]
  dateRange?: { start: string; end: string }
  tags?: string[]
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  searchQuery?: string
}

// 页面元数据
useHead({
  title: '例会记录 - 区块链组',
  meta: [
    {
      name: 'description',
      content: '查看团队会议纪要、技术讨论和学术活动记录'
    },
    {
      name: 'keywords',
      content: '会议记录,例会纪要,技术讨论,学术活动'
    }
  ]
})

// 响应式数据
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const isLoading = ref(false)
const isLoadingMore = ref(false)
const showMobileFilter = ref(false)
const selectedMeeting = ref<MeetingRecord | null>(null)
const showDetailModal = ref(false)
const selectedFiles = ref<MeetingFile[]>([])
const showFilesModal = ref(false)
const isMobile = ref(false)

// 筛选条件
const currentFilters = ref<MeetingFilterValues>({})

const meetings = ref<MeetingRecord[]>([])

const fetchPageSize = computed(() => Math.max(itemsPerPage.value * 5, 60))

const buildQueryParams = () => {
  const params: Record<string, unknown> = {
    page: 0,
    size: fetchPageSize.value
  }

  if (currentFilters.value.searchQuery) {
    params.topic = currentFilters.value.searchQuery
  }

  if (currentFilters.value.types?.length) {
    params.type = currentFilters.value.types.join(',')
  }

  if (currentFilters.value.dateRange?.start || currentFilters.value.dateRange?.end) {
    params.dateRange = `${currentFilters.value.dateRange?.start ?? ''},${currentFilters.value.dateRange?.end ?? ''}`
  }

  return params
}

const loadMeetings = async () => {
  isLoading.value = true
  try {
    const response = await getMeetings(buildQueryParams())
    meetings.value = response.content ?? []
  } catch (error) {
    console.error('获取会议列表失败:', error)
    meetings.value = []
  } finally {
    isLoading.value = false
  }
}

// 计算属性
const filteredMeetings = computed(() => {
  let result = [...meetings.value]
  const filters = currentFilters.value

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    result = result.filter(meeting => {
      const titleMatch = meeting.title.toLowerCase().includes(query)
      const summaryText = meeting.summary?.toLowerCase() ?? ''
      const summaryMatch = summaryText.includes(query)
      const tagMatch = meeting.tags?.some(tag => tag.toLowerCase().includes(query)) ?? false
      return titleMatch || summaryMatch || tagMatch
    })
  }

  if (filters.statuses?.length) {
    result = result.filter(meeting => {
      const status = meeting.status ?? ''
      return filters.statuses?.includes(status) ?? false
    })
  }

  if (filters.types?.length) {
    result = result.filter(meeting => meeting.types?.some(type => filters.types?.includes(type)) ?? false)
  }

  if (filters.tags?.length) {
    result = result.filter(meeting => meeting.tags?.some(tag => filters.tags?.includes(tag)) ?? false)
  }

  if (filters.attendeeSizes?.length) {
    result = result.filter(meeting => {
      const count = Array.isArray(meeting.attendees) ? meeting.attendees.length : 0
      return filters.attendeeSizes?.some(size => {
        if (size === 'small') return count < 10
        if (size === 'medium') return count >= 10 && count <= 20
        if (size === 'large') return count > 20
        return false
      }) ?? false
    })
  }

  if (filters.dateRange?.start) {
    const startDate = new Date(filters.dateRange.start).getTime()
    result = result.filter(meeting => new Date(meeting.date).getTime() >= startDate)
  }

  if (filters.dateRange?.end) {
    const endDate = new Date(filters.dateRange.end).getTime()
    result = result.filter(meeting => new Date(meeting.date).getTime() <= endDate)
  }

  const sortBy = filters.sortBy ?? 'date'
  const sortDirection = filters.sortDirection ?? 'desc'

  result.sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1
    switch (sortBy) {
      case 'title':
        return direction * a.title.localeCompare(b.title)
      case 'attendee_count': {
        const countA = Array.isArray(a.attendees) ? a.attendees.length : 0
        const countB = Array.isArray(b.attendees) ? b.attendees.length : 0
        return direction * (countA - countB)
      }
      case 'duration':
        return direction * ((a.duration ?? 0) - (b.duration ?? 0))
      case 'date':
      default:
        return direction * (new Date(a.date).getTime() - new Date(b.date).getTime())
    }
  })

  return result
})

const paginatedMeetings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredMeetings.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredMeetings.value.length / itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const current = currentPage.value
  const total = totalPages.value
  const delta = 2

  const start = Math.max(1, current - delta)
  const end = Math.min(total, current + delta)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const hasMoreItems = computed(() => {
  return currentPage.value * itemsPerPage.value < filteredMeetings.value.length
})

const hasActiveFilters = computed(() => {
  const filters = currentFilters.value
  return Boolean(
    filters.searchQuery ||
    filters.statuses?.length ||
    filters.types?.length ||
    filters.attendeeSizes?.length ||
    filters.tags?.length ||
    filters.dateRange?.start ||
    filters.dateRange?.end
  )
})

watch(filteredMeetings, () => {
  if (filteredMeetings.value.length === 0) {
    currentPage.value = 1
    return
  }

  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
})

// 统计数据
const stats = computed(() => {
  const totalMeetings = meetings.value.length
  const totalParticipants = meetings.value.reduce((sum: number, meeting: MeetingRecord) => {
    return sum + meeting.attendees.length
  }, 0)
  const totalMinutes = meetings.value.reduce((sum: number, meeting: MeetingRecord) => {
    return sum + (meeting.duration ?? 0)
  }, 0)
  const totalHours = Math.round(totalMinutes / 60)
  const totalDocuments = meetings.value.reduce((sum: number, meeting: MeetingRecord) => {
    return sum + (meeting.files?.length || 0)
  }, 0)

  return {
    totalMeetings,
    totalParticipants,
    totalHours,
    totalDocuments
  }
})

// 方法
const getDisplayedCount = (): number => {
  const end = currentPage.value * itemsPerPage.value
  return Math.min(end, filteredMeetings.value.length)
}

const handleFilterChange = (filters: MeetingFilterValues) => {
  currentFilters.value = { ...currentFilters.value, ...filters }
  currentPage.value = 1
  void loadMeetings()
}

const handleViewDetail = (meeting: MeetingRecord) => {
  selectedMeeting.value = meeting
  showDetailModal.value = true
}

const handleViewFiles = (meeting: MeetingRecord) => {
  selectedFiles.value = meeting.files || []
  showFilesModal.value = true
}

const handleViewRecording = (meeting: MeetingRecord) => {
  if (meeting.recording) {
    window.open(meeting.recording, '_blank')
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedMeeting.value = null
}

const closeFilesModal = () => {
  showFilesModal.value = false
  selectedFiles.value = []
}

const clearAllFilters = () => {
  currentFilters.value = {}
  currentPage.value = 1
  void loadMeetings()
}

const loadMore = async () => {
  if (!hasMoreItems.value || isLoadingMore.value) return
  isLoadingMore.value = true
  setTimeout(() => {
    currentPage.value++
    isLoadingMore.value = false
  }, 300)
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

// 生命周期
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  void loadMeetings()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped lang="postcss">
/* 页面基础样式 */
.meetings-page {
  @apply min-h-screen bg-gray-50;
}

/* 页面头部 */
.meetings-header {
  @apply relative overflow-hidden;
}

.header-overlay {
  @apply absolute inset-0;
  background:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 55%),
    radial-gradient(circle at 80% 30%, rgba(255,255,255,0.25), transparent 55%),
    linear-gradient(120deg, rgba(15,23,42,0.35), rgba(15,23,42,0));
}

.header-content {
  @apply relative z-10 py-16;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.header-text {
  @apply text-center mb-12;
}

.page-title {
  @apply text-4xl md:text-5xl font-bold text-white mb-4;
}

.title-icon {
  @apply mr-4;
}

.page-subtitle {
  @apply text-xl text-white/90;
}

.header-stats {
  @apply grid grid-cols-2 md:grid-cols-4 gap-6;
}

.stat-card {
  @apply bg-white/10 backdrop-blur-md rounded-xl p-6 text-center
         border border-white/20;
}

.stat-icon {
  @apply text-3xl mb-3;
}

.stat-number {
  @apply text-3xl font-bold text-white mb-1;
}

.stat-label {
  @apply text-white/80 text-sm;
}

/* 主内容区域 */
.meetings-content {
  @apply py-12;
}

.content-layout {
  @apply grid grid-cols-1 lg:grid-cols-4 gap-8;
}

.meetings-sidebar {
  @apply lg:col-span-1;
}

.sidebar-sticky {
  @apply sticky top-8;
}

/* 移动端筛选 */
.mobile-filter-toggle {
  @apply fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 text-white
         rounded-full shadow-lg flex items-center justify-center
         transition-all duration-300;
}

.mobile-filter-toggle.is-active {
  @apply bg-blue-700 scale-110;
}

.toggle-icon {
  @apply w-6 h-6;
}

.mobile-filter-panel {
  @apply fixed inset-0 z-50 hidden;
}

.mobile-filter-panel.is-open {
  @apply block;
}

.mobile-filter-content {
  @apply relative z-10 h-full overflow-y-auto bg-white p-6;
}

.mobile-filter-backdrop {
  @apply absolute inset-0 bg-black bg-opacity-50;
}

/* 主内容区 */
.meetings-main {
  @apply lg:col-span-3;
}

/* 视图控制 */
.view-controls {
  @apply flex items-center justify-between mb-8 p-4 bg-white rounded-xl shadow-sm;
}

.view-options {
  @apply flex space-x-2;
}

.view-btn {
  @apply flex items-center space-x-2 px-4 py-2 text-sm border border-gray-200
         rounded-lg cursor-pointer transition-colors duration-200;
}

.view-btn.is-active {
  @apply bg-blue-50 border-blue-300 text-blue-700;
}

.view-icon {
  @apply w-4 h-4;
}

.pagination-info {
  @apply text-sm text-gray-600;
}

/* 状态显示 */
.loading-state {
  @apply flex flex-col items-center justify-center py-20 text-center;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full
         animate-spin mb-4;
}

.loading-text {
  @apply text-gray-600;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-20 text-center;
}

.empty-icon {
  @apply text-6xl mb-4;
}

.empty-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.empty-description {
  @apply text-gray-600 mb-6;
}

.empty-action {
  @apply px-6 py-2 bg-blue-600 text-white rounded-lg
         hover:bg-blue-700 transition-colors duration-200;
}

/* 会议列表 */
.meetings-list {
  @apply grid gap-6 mb-8;
}

.meetings-list-grid {
  @apply grid-cols-1 md:grid-cols-2 xl:grid-cols-3;
}

.meetings-list-list {
  @apply grid-cols-1;
}

.meetings-list.is-loading {
  @apply opacity-50;
}

/* 分页控制 */
.pagination-controls {
  @apply flex items-center justify-center space-x-2;
}

.pagination-btn {
  @apply px-4 py-2 text-sm border border-gray-300 rounded-lg
         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
         transition-colors duration-200;
}

.pagination-pages {
  @apply flex space-x-1;
}

.pagination-page {
  @apply w-10 h-10 text-sm border border-gray-300 rounded-lg
         hover:bg-gray-50 transition-colors duration-200;
}

.pagination-page.is-active {
  @apply bg-blue-600 text-white border-blue-600;
}

/* 加载更多 */
.load-more-section {
  @apply text-center;
}

.load-more-btn {
  @apply px-8 py-3 border border-gray-300 rounded-lg
         hover:bg-gray-50 transition-colors duration-200;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-stats {
    @apply grid-cols-2;
  }
  
  .view-controls {
    @apply flex-col space-y-4;
  }
  
  .meetings-list-grid {
    @apply grid-cols-1;
  }
  
  .pagination-controls {
    @apply flex-wrap;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .meetings-page {
    @apply bg-gray-900;
  }
  
  .view-controls,
  .empty-state,
  .loading-state {
    @apply bg-gray-800;
  }
  
  .view-btn,
  .pagination-btn,
  .pagination-page,
  .load-more-btn {
    @apply border-gray-600 text-gray-300;
  }
  
  .view-btn:hover,
  .pagination-btn:hover,
  .pagination-page:hover,
  .load-more-btn:hover {
    @apply bg-gray-700;
  }
  
  .view-btn.is-active,
  .pagination-page.is-active {
    @apply bg-blue-600 text-white;
  }
  
  .empty-title {
    @apply text-white;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .view-btn,
  .pagination-btn,
  .pagination-page,
  .load-more-btn {
    @apply border-2;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .mobile-filter-toggle {
    @apply transition-none;
  }
  
  .loading-spinner {
    @apply animate-none;
  }
}
</style>