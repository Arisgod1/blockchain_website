<template>
  <div class="meetings-page">
    <!-- 页面头部 -->
    <section class="meetings-header">
      <div class="header-background">
        <div class="header-light-trails">
          <span class="light-strip strip-1" />
          <span class="light-strip strip-2" />
          <span class="light-strip strip-3" />
        </div>
        <div class="header-overlay" />
      </div>
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
    </section>

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
                ref="meetingFilterRef"
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
                ref="meetingFilterMobileRef"
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
                  显示 {{ getDisplayedCount() }} / 共 {{ usingFallback ? filteredMeetings.length : totalElements || filteredMeetings.length }} 个会议
                </span>
              </div>
            </div>

            <div
              v-if="usingFallback"
              class="fallback-banner"
            >
              当前展示的是离线缓存数据，服务恢复后会自动同步最新内容。
            </div>

            <!-- 加载状态 -->
            <div
              v-if="isLoading && !hasLoadedOnce"
              class="loading-state"
            >
              <div class="loading-spinner" />
              <p class="loading-text">
                正在加载会议数据...
              </p>
            </div>

            <!-- 错误状态 -->
            <div
              v-else-if="errorMessage && !filteredMeetings.length"
              class="error-state"
            >
              <div class="empty-icon">
                ⚠️
              </div>
              <h3 class="empty-title">
                数据获取失败
              </h3>
              <p class="empty-description">
                {{ errorMessage }}
              </p>
              <button
                class="empty-action"
                @click="loadMeetings({ force: true, resetPage: true })"
              >
                重新加载
              </button>
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
                @click="resetAllFilters"
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
              <transition
                name="fade"
                appear
              >
                <div
                  v-if="isLoading && hasLoadedOnce"
                  class="grid-overlay"
                >
                  <div class="loading-spinner" />
                  <p class="loading-text">
                    正在刷新会议列表...
                  </p>
                </div>
              </transition>
              <MeetingCard
                v-for="meeting in paginatedMeetings"
                :key="meeting.id"
                :meeting="meeting"
                :view-mode="viewMode"
                @view-detail="handleViewDetail"
                @view-files="handleViewFiles"
                @view-recording="handleViewRecording"
              />
            </div>

            <!-- 分页控制 -->
            <div 
              v-if="filteredMeetings.length && totalPages > 1"
              class="pagination-controls"
            >
              <button
                class="pagination-btn"
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
              >
                上一页
              </button>
              
              <div class="pagination-pages">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  class="pagination-page"
                  :class="{ 'is-active': page === currentPage }"
                  @click="changePage(page)"
                >
                  {{ page }}
                </button>
              </div>
              
              <button
                class="pagination-btn"
                :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHead } from '@vueuse/head'
import MeetingCard from '@/components/meetings/MeetingCard.vue'
import MeetingFilter from '@/components/meetings/MeetingFilter.vue'
import MeetingDetailModal from '@/components/meetings/MeetingDetailModal.vue'
import FileViewerModal from '@/components/meetings/FileViewerModal.vue'
import { getMeetings } from '@/api/meeting'
import type { Meeting, MeetingFile, MeetingPage } from '@/types/entities'

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

const MEETINGS_CACHE_KEY = 'meetings:list-cache'

// 响应式数据
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const isLoading = ref(false)
const isLoadingMore = ref(false)
const showMobileFilter = ref(false)
const showDetailModal = ref(false)
const showFilesModal = ref(false)
const isMobile = ref(false)
const selectedMeeting = ref<Meeting | null>(null)
const selectedFiles = ref<MeetingFile[] | null>(null)
const meetings = ref<Meeting[]>([])
const filteredMeetings = ref<Meeting[]>([])
const totalElements = ref(0)
const serverTotalPages = ref(0)
const hasLoadedOnce = ref(false)
const usingFallback = ref(false)
const errorMessage = ref('')

interface MeetingFilterPayload {
  searchQuery?: string
  statuses?: string[]
  types?: string[]
  attendeeSizes?: string[]
  tags?: string[]
  dateRange?: {
    start?: string
    end?: string
  }
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

const defaultFilters: MeetingFilterPayload = {
  searchQuery: '',
  statuses: [],
  types: [],
  attendeeSizes: [],
  tags: [],
  sortBy: 'date',
  sortDirection: 'desc'
}

const currentFilters = ref<MeetingFilterPayload>({ ...defaultFilters })

type MeetingFilterPublicInstance = {
  resetFilters?: () => void
}

const meetingFilterRef = ref<MeetingFilterPublicInstance | null>(null)
const meetingFilterMobileRef = ref<MeetingFilterPublicInstance | null>(null)

const paginatedMeetings = computed(() => {
  if (usingFallback.value) {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredMeetings.value.slice(start, start + itemsPerPage.value)
  }
  return filteredMeetings.value
})

const totalPages = computed(() => {
  if (usingFallback.value) {
    return Math.max(1, Math.ceil(filteredMeetings.value.length / itemsPerPage.value))
  }
  return Math.max(1, serverTotalPages.value || 1)
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
  if (!usingFallback.value) return false
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

const stats = computed(() => {
  const source = usingFallback.value ? meetings.value : filteredMeetings.value
  const totalMeetings = usingFallback.value ? source.length : totalElements.value || source.length
  const totalParticipants = source.reduce((sum, meeting) => sum + (meeting.attendees?.length || 0), 0)
  const totalHours = Math.round(source.reduce((sum, meeting) => sum + (meeting.duration || 0), 0) / 60)
  const totalDocuments = source.reduce((sum, meeting) => sum + (meeting.files?.length || 0), 0)

  return {
    totalMeetings,
    totalParticipants,
    totalHours,
    totalDocuments
  }
})

const getDisplayedCount = (): number => {
  if (usingFallback.value) {
    return Math.min(currentPage.value * itemsPerPage.value, filteredMeetings.value.length)
  }
  return filteredMeetings.value.length
}

const getAttendeeCount = (meeting: Meeting) => {
  return Array.isArray(meeting.attendees) ? meeting.attendees.length : 0
}

const matchesAttendeeSize = (meeting: Meeting, size: string) => {
  const count = getAttendeeCount(meeting)
  switch (size) {
    case 'small':
      return count < 10
    case 'medium':
      return count >= 10 && count <= 20
    case 'large':
      return count > 20
    default:
      return true
  }
}

const sortClientMeetings = (list: Meeting[], sortBy?: string, direction: 'asc' | 'desc' = 'desc') => {
  const sorted = [...list]
  const multiplier = direction === 'asc' ? 1 : -1
  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title?.localeCompare(b.title ?? '') ?? 0) * multiplier
      case 'attendee_count':
        return (getAttendeeCount(a) - getAttendeeCount(b)) * multiplier
      case 'duration':
        return ((a.duration ?? 0) - (b.duration ?? 0)) * multiplier
      case 'date':
      default:
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * multiplier
    }
  })
  return sorted
}

const applyClientFilters = (options: { resetPage?: boolean } = {}) => {
  let result = [...meetings.value]
  const filters = currentFilters.value

  if (filters.searchQuery) {
    const query = filters.searchQuery.trim().toLowerCase()
    result = result.filter(meeting => {
      return [
        meeting.title,
        meeting.summary,
        meeting.location,
        meeting.tags?.join(',')
      ].some(field => field?.toLowerCase().includes(query))
    })
  }

  if (filters.statuses?.length) {
    result = result.filter(meeting => filters.statuses?.includes(meeting.status ?? ''))
  }

  if (filters.types?.length) {
    result = result.filter(meeting => {
      const typeList = meeting.types ?? []
      return filters.types?.some(type => typeList.includes(type))
    })
  }

  if (filters.tags?.length) {
    result = result.filter(meeting => {
      const tagList = meeting.tags ?? []
      return filters.tags?.some(tag => tagList.includes(tag))
    })
  }

  if (filters.attendeeSizes?.length) {
    result = result.filter(meeting => filters.attendeeSizes?.some(size => matchesAttendeeSize(meeting, size)))
  }

  if (filters.dateRange?.start || filters.dateRange?.end) {
    const start = filters.dateRange.start ? new Date(filters.dateRange.start).getTime() : null
    const end = filters.dateRange.end ? new Date(filters.dateRange.end).getTime() : null
    result = result.filter(meeting => {
      const time = new Date(meeting.date).getTime()
      if (start && time < start) return false
      if (end && time > end) return false
      return true
    })
  }

  result = sortClientMeetings(result, filters.sortBy, filters.sortDirection)
  filteredMeetings.value = result

  if (options.resetPage) {
    currentPage.value = 1
  }
}

const buildMeetingQuery = () => {
  const filters = currentFilters.value
  const params: Record<string, unknown> = {
    page: Math.max(currentPage.value - 1, 0),
    size: itemsPerPage.value,
    sortBy: filters.sortBy,
    sortOrder: filters.sortDirection
  }

  if (filters.searchQuery) params.keyword = filters.searchQuery
  if (filters.statuses?.length) params.status = filters.statuses.join(',')
  if (filters.types?.length) params.types = filters.types.join(',')
  if (filters.tags?.length) params.tags = filters.tags.join(',')
  if (filters.dateRange?.start) params.startDate = filters.dateRange.start
  if (filters.dateRange?.end) params.endDate = filters.dateRange.end
  if (filters.attendeeSizes?.length) params.attendeeSize = filters.attendeeSizes.join(',')

  return params
}

const applyMeetingResponse = (response: MeetingPage, options: { resetPage?: boolean } = {}) => {
  meetings.value = response.content ?? []
  totalElements.value = response.totalElements ?? meetings.value.length
  serverTotalPages.value = response.totalPages ?? 0
  usingFallback.value = Boolean(response.fromFallback)

  if (usingFallback.value) {
    applyClientFilters({ resetPage: options.resetPage })
  } else {
    filteredMeetings.value = meetings.value
    const resolvedPage = response.page ?? (typeof response.number === 'number' ? response.number + 1 : 1)
    currentPage.value = options.resetPage ? 1 : resolvedPage
  }
}

const cacheMeetingsSnapshot = (payload: MeetingPage) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(MEETINGS_CACHE_KEY, JSON.stringify(payload))
  } catch (error) {
    console.warn('缓存例会数据失败', error)
  }
}

const hydrateMeetingsFromCache = (silent = false) => {
  if (typeof window === 'undefined') return false
  try {
    const cached = window.localStorage.getItem(MEETINGS_CACHE_KEY)
    if (!cached) return false
    const parsed = JSON.parse(cached) as MeetingPage
    if (!parsed?.content?.length) return false
    applyMeetingResponse({ ...parsed, fromFallback: true }, { resetPage: true })
    if (!silent) {
      errorMessage.value = ''
    }
    return true
  } catch (error) {
    console.warn('读取例会缓存失败', error)
    return false
  }
}

const loadMeetings = async (options: { resetPage?: boolean; force?: boolean } = {}) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    if (usingFallback.value && !options.force) {
      applyClientFilters()
      return
    }

    const params = buildMeetingQuery()
    const response = await getMeetings(params)
    applyMeetingResponse(response, options)
    cacheMeetingsSnapshot(response)
  } catch (error) {
    console.error('获取例会数据失败:', error)
    const message = error instanceof Error ? error.message : '获取例会记录失败'
    errorMessage.value = message

    if (!meetings.value.length) {
      const restored = hydrateMeetingsFromCache(true)
      if (restored) {
        errorMessage.value = '当前展示离线缓存数据'
      }
    }
  } finally {
    isLoading.value = false
    hasLoadedOnce.value = true
  }
}

const handleFilterChange = (filters: MeetingFilterPayload) => {
  currentFilters.value = {
    ...defaultFilters,
    ...filters
  }
  currentPage.value = 1
  if (isMobile.value) {
    showMobileFilter.value = false
  }
  if (usingFallback.value) {
    applyClientFilters({ resetPage: true })
  } else {
    loadMeetings({ resetPage: true })
  }
}

const resetAllFilters = () => {
  currentFilters.value = { ...defaultFilters }
  meetingFilterRef.value?.resetFilters?.()
  meetingFilterMobileRef.value?.resetFilters?.()
  currentPage.value = 1
  if (usingFallback.value) {
    applyClientFilters({ resetPage: true })
  } else {
    loadMeetings({ resetPage: true })
  }
}

const handleViewDetail = (meeting: Meeting) => {
  selectedMeeting.value = meeting
  showDetailModal.value = true
}

const handleViewFiles = (meeting: Meeting) => {
  selectedFiles.value = meeting.files ?? []
  showFilesModal.value = true
}

const handleViewRecording = (meeting: Meeting) => {
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
  selectedFiles.value = null
}

const changePage = (page: number) => {
  if (page === currentPage.value || page < 1 || page > totalPages.value) return
  currentPage.value = page
  if (usingFallback.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  loadMeetings()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const loadMore = async () => {
  if (!usingFallback.value || isLoadingMore.value) return
  if (currentPage.value >= totalPages.value) return
  isLoadingMore.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  changePage(currentPage.value + 1)
  isLoadingMore.value = false
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

// 生命周期
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  if (hydrateMeetingsFromCache(true)) {
    hasLoadedOnce.value = true
  }
  loadMeetings({ resetPage: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
/* 页面基础样式 */
.meetings-page {
  @apply min-h-screen bg-gray-50;
}

/* 页面头部 */
.meetings-header {
  @apply relative overflow-hidden;
}

.header-background {
  @apply absolute inset-0 overflow-hidden;
  background: radial-gradient(circle at 30% 20%, rgba(248, 250, 252, 0.08), transparent 55%),
              radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.15), transparent 45%),
              #1d1b38;
  background-size: 200% 200%;
  animation: gradientShift 16s ease-in-out infinite;
}

.header-light-trails {
  @apply absolute inset-0 overflow-hidden;
  mix-blend-mode: screen;
  pointer-events: none;
}

.light-strip {
  @apply absolute rounded-full opacity-40;
  --strip-rotation: 0deg;
  width: 45%;
  height: 160%;
  top: -30%;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0));
  filter: blur(2px);
  animation: lightSweep 8s linear infinite;
  transform: rotate(var(--strip-rotation));
}

.strip-1 {
  left: -5%;
  --strip-rotation: -12deg;
  animation-delay: 0s;
}

.strip-2 {
  left: 25%;
  --strip-rotation: 8deg;
  animation-delay: 2s;
}

.strip-3 {
  right: -10%;
  --strip-rotation: 18deg;
  animation-delay: 4s;
}

.header-overlay {
  @apply absolute inset-0 bg-slate-900/60 backdrop-blur-md;
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

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes lightSweep {
  0% {
    transform: rotate(var(--strip-rotation)) translateX(-160%);
    opacity: 0;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    transform: rotate(var(--strip-rotation)) translateX(160%);
    opacity: 0;
  }
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