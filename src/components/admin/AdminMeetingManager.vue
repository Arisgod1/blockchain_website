<template>
  <div class="admin-meeting-manager">
    <div class="manager-header">
      <h2>例会管理</h2>
      <div class="header-actions">
        <BaseButton 
          variant="primary"
          @click="handleCreate"
        >
          + 新建例会
        </BaseButton>
        <BaseButton 
          variant="secondary"
          @click="handleRefresh"
        >
          刷新
        </BaseButton>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <MeetingFilter 
        :initial-filters="filters"
        @filter-change="handleFilterChange"
      />
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <div class="stats-grid">
        <BaseCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon meeting-icon">
              📅
            </div>
            <div class="stat-info">
              <div class="stat-number">
                {{ totalMeetings }}
              </div>
              <div class="stat-label">
                总例会数
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon recent-icon">
              🆕
            </div>
            <div class="stat-info">
              <div class="stat-number">
                {{ recentMeetings }}
              </div>
              <div class="stat-label">
                本周例会
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon participants-icon">
              👥
            </div>
            <div class="stat-info">
              <div class="stat-number">
                {{ totalParticipants }}
              </div>
              <div class="stat-label">
                参与人次
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon action-icon">
              ✅
            </div>
            <div class="stat-info">
              <div class="stat-number">
                {{ completedActions }}
              </div>
              <div class="stat-label">
                待办完成
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- 例会列表 -->
    <div class="meetings-section">
      <BaseCard class="content-card">
        <template #header>
          <div class="section-header">
            <h3>例会列表</h3>
            <div class="view-controls">
              <button 
                class="view-btn"
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >
                <GridIcon size="16" />
              </button>
              <button 
                class="view-btn"
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                <ListIcon size="16" />
              </button>
            </div>
            <div
              class="search-actions"
              style="margin-left:1rem; display:flex; gap:0.5rem; align-items:center;"
            >
              <input
                v-model="searchQuery"
                class="search-input"
                placeholder="搜索标题或关键字"
              >
              <BaseButton
                variant="primary"
                @click="applySearch"
              >
                搜索
              </BaseButton>
              <BaseButton
                variant="secondary"
                @click="resetSearch"
              >
                重置
              </BaseButton>
              <BaseButton
                variant="primary"
                @click="goCreateMeeting"
              >
                新建
              </BaseButton>
            </div>
          </div>
        </template>

        <div
          v-if="loading"
          class="loading-container"
        >
          <LoadingSpinner />
          <p>加载例会数据中...</p>
        </div>

        <div
          v-else-if="filteredMeetings.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">
            📅
          </div>
          <h3>暂无例会记录</h3>
          <p>您还没有创建任何例会记录</p>
          <BaseButton
            variant="primary"
            @click="handleCreate"
          >
            创建第一个例会
          </BaseButton>
        </div>

        <div v-else>
          <!-- 网格视图 -->
          <div
            v-if="viewMode === 'grid'"
            class="meetings-grid"
          >
            <div 
              v-for="meeting in paginatedMeetings" 
              :key="meeting.id"
              class="meeting-grid-item"
            >
              <MeetingCard 
                :meeting="meeting"
                :show-actions="true"
                @view="handleView"
                @edit="handleEdit"
                @delete="handleDelete"
                @duplicate="handleDuplicate"
              />
            </div>
          </div>

          <!-- 列表视图 -->
          <div
            v-else
            class="meetings-list"
          >
            <div 
              v-for="meeting in paginatedMeetings" 
              :key="meeting.id"
              class="meeting-list-item"
            >
              <div class="meeting-list-content">
                <div class="meeting-main-info">
                  <h4>{{ meeting.title }}</h4>
                  <div
                    v-if="resolveMeetingAttendees(meeting).length"
                    class="meeting-attendees-preview"
                  >
                    <img
                      v-for="attendee in resolveMeetingAttendees(meeting).slice(0, 3)"
                      :key="`${meeting.id}-${attendee.id}`"
                      :src="attendee.avatar || '/images/default-avatar.svg'"
                      :alt="attendee.name"
                      class="attendee-avatar"
                      :title="attendee.name"
                    >
                    <span
                      v-if="resolveMeetingAttendees(meeting).length > 3"
                      class="attendee-more"
                    >
                      +{{ resolveMeetingAttendees(meeting).length - 3 }}
                    </span>
                  </div>
                  <div class="meeting-meta">
                    <span class="meta-item">
                      📅 {{ formatDate(resolveMeetingDate(meeting)) }}
                    </span>
                    <span class="meta-item">
                      🕐 {{ resolveMeetingTime(meeting) }}
                    </span>
                    <span class="meta-item">
                      👥 {{ meeting.attendees.length }} 人参与
                    </span>
                  </div>
                </div>
                <div class="meeting-actions">
                  <button 
                    class="action-btn view-btn"
                    title="查看详情"
                    @click="handleView(meeting)"
                  >
                    👁️
                  </button>
                  <button 
                    class="action-btn edit-btn"
                    title="编辑"
                    @click="handleEdit(meeting)"
                  >
                    ✏️
                  </button>
                  <button 
                    class="action-btn duplicate-btn"
                    title="复制"
                    @click="handleDuplicate(meeting)"
                  >
                    📋
                  </button>
                  <button 
                    class="action-btn delete-btn"
                    title="删除"
                    @click="handleDelete(meeting)"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination-section">
            <BasePagination 
              v-model:current="pagination.current"
              :page-size="pagination.pageSize"
              :total="filteredMeetings.length"
              @page-change="handlePageChange"
              @update:page-size="handlePageSizeChange"
            />
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- 详情弹窗 -->
    <MeetingDetailModal 
      :meeting="detailModal.meeting"
      :is-open="detailModal.show"
      @close="detailModal.show = false"
      @view-files="handleViewFiles"
      @view-recording="handleViewRecording"
    />

    <!-- 删除通过确认框处理（与项目管理一致） -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { getMeetings, createMeeting, deleteMeeting } from '@/api/meeting'
import { 
  BaseButton, 
  BaseCard, 
  BasePagination, 
  LoadingSpinner 
} from '@/components/common'
import { GridIcon, ListIcon } from '@/components/icons'
import MeetingFilter from '@/components/meetings/MeetingFilter.vue'
import MeetingCard from '@/components/meetings/MeetingCard.vue'
import MeetingDetailModal from '@/components/meetings/MeetingDetailModal.vue'
import type { Meeting, MeetingAttendee } from '@/types/entities'
import { onAdminRefresh } from '@/utils/adminEvents'
import { recordAdminOperation } from '@/composables/useAdminLogs'
import { mergeAttendeesWithMembers } from '@/utils/attendeeMapper'

interface MeetingFilterState {
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

const normalizeMeetingFilters = (incoming?: MeetingFilterState): MeetingFilterState => ({
  searchQuery: incoming?.searchQuery ?? '',
  statuses: incoming?.statuses ?? [],
  types: incoming?.types ?? [],
  attendeeSizes: incoming?.attendeeSizes ?? [],
  tags: incoming?.tags ?? [],
  dateRange: incoming?.dateRange
    ? {
        start: incoming.dateRange.start ?? '',
        end: incoming.dateRange.end ?? ''
      }
    : undefined,
  sortBy: incoming?.sortBy ?? 'date',
  sortDirection: incoming?.sortDirection ?? 'desc'
})

// 设置页面元数据
useHead({
  title: '例会管理 - 管理员后台',
  meta: [
    { name: 'description', content: '管理例会记录、查看统计信息' }
  ]
})

// 响应式数据
const meetings = ref<Meeting[]>([])
const loading = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

const filters = ref<MeetingFilterState>(normalizeMeetingFilters())

const searchQuery = ref('')

const applySearch = () => {
  filters.value.searchQuery = searchQuery.value
  pagination.value.current = 1
}

const router = useRouter()

const resetSearch = () => {
  searchQuery.value = ''
  filters.value.searchQuery = ''
  pagination.value.current = 1
}

const goCreateMeeting = () => {
  router.push({ name: 'AdminMeetingCreate' })
}

const pagination = ref({
  current: 1,
  pageSize: 12
})

const buildMeetingQueryParams = () => {
  const params: Record<string, unknown> = {
    page: 0,
    size: 500
  }

  return params
}

const detailModal = reactive({
  show: false,
  meeting: null as Meeting | null
}) as { show: boolean; meeting: Meeting | null }

// 删除改为使用 `confirm()`，不再需要 deleteModal

// 计算属性

const resolveMeetingDate = (meeting: Meeting) => meeting.meetingTime || meeting.meeting_time || ''
const resolveMeetingTime = (meeting: Meeting) => meeting.meeting_time || (meeting.meetingTime?.split('T')[1]?.slice(0, 5) ?? '未设置')
const resolveMeetingAttendees = (meeting: Meeting): MeetingAttendee[] => mergeAttendeesWithMembers(meeting.attendees ?? [])

const classifyAttendeeSize = (count: number) => {
  if (count <= 10) return 'small'
  if (count <= 30) return 'medium'
  return 'large'
}

const filteredMeetings = computed(() => {
  const keyword = filters.value.searchQuery?.trim().toLowerCase()
  const next = [...meetings.value]

  const matchesKeyword = (meeting: Meeting) => {
    if (!keyword) return true
    return [
      meeting.title,
      meeting.summary,
      meeting.location,
      meeting.content,
      meeting.agenda?.join(' '),
      meeting.decisions?.join(' ')
    ].some((field) => field && field.toLowerCase().includes(keyword))
  }

  const matchesStatuses = (meeting: Meeting) => {
    if (!filters.value.statuses?.length) return true
    return filters.value.statuses.includes(meeting.status || '')
  }

  const matchesTypes = (meeting: Meeting) => {
    if (!filters.value.types?.length) return true
    return (meeting.types || []).some((t) => filters.value.types?.includes(t))
  }

  const matchesAttendeeSize = (meeting: Meeting) => {
    if (!filters.value.attendeeSizes?.length) return true
    const sizeLabel = classifyAttendeeSize(meeting.attendees?.length || 0)
    return filters.value.attendeeSizes.includes(sizeLabel)
  }

  const matchesTags = (meeting: Meeting) => {
    if (!filters.value.tags?.length) return true
    return (meeting.tags || []).some((tag) => filters.value.tags?.includes(tag))
  }

  const matchesDateRange = (meeting: Meeting) => {
    const dateStr = resolveMeetingDate(meeting)
    if (!filters.value.dateRange || (!filters.value.dateRange.start && !filters.value.dateRange.end)) return true
    if (!dateStr) return false
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return false
    const { start, end } = filters.value.dateRange
    if (start && date < new Date(start)) return false
    if (end && date > new Date(end)) return false
    return true
  }

  const filtered = next.filter((meeting) =>
    matchesKeyword(meeting) &&
    matchesStatuses(meeting) &&
    matchesTypes(meeting) &&
    matchesAttendeeSize(meeting) &&
    matchesTags(meeting) &&
    matchesDateRange(meeting)
  )

  const sortBy = filters.value.sortBy || 'date'
  const sortDirection = filters.value.sortDirection || 'desc'

  const compare = (a: Meeting, b: Meeting) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1
    if (sortBy === 'title') {
      return multiplier * (a.title || '').localeCompare(b.title || '')
    }
    if (sortBy === 'attendee_count') {
      return multiplier * ((a.attendees?.length || 0) - (b.attendees?.length || 0))
    }
    if (sortBy === 'duration') {
      return multiplier * ((a.duration || 0) - (b.duration || 0))
    }
    // default: date
    const aDate = new Date(resolveMeetingDate(a)).getTime()
    const bDate = new Date(resolveMeetingDate(b)).getTime()
    return multiplier * ((aDate || 0) - (bDate || 0))
  }

  return filtered.sort(compare)
})

const paginatedMeetings = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  return filteredMeetings.value.slice(start, start + pagination.value.pageSize)
})

type MeetingLogAction = 'create' | 'update' | 'delete' | 'refresh' | 'duplicate'

const cleanupFns: Array<() => void> = []

const logMeetingAction = (action: MeetingLogAction, message: string, result: 'success' | 'failure' = 'success', targetId?: string | number) => {
  recordAdminOperation({
    entity: 'meetings',
    action,
    message,
    targetId,
    result
  }).catch((error) => {
    console.warn('记录例会操作日志失败:', error)
  })
}

const totalMeetings = computed(() => meetings.value.length)

const recentMeetings = computed(() => {
  const thisWeek = new Date()
  thisWeek.setDate(thisWeek.getDate() - 7)
  return meetings.value.filter((meeting) => {
    const dateStr = resolveMeetingDate(meeting)
    if (!dateStr) return false
    const meetingDate = new Date(dateStr)
    return !Number.isNaN(meetingDate.getTime()) && meetingDate >= thisWeek
  }).length
})

const totalParticipants = computed(() => {
  return meetings.value.reduce((total, meeting) => 
    total + meeting.attendees.length, 0
  )
})

const completedActions = computed(() => {
  return meetings.value.reduce((total, meeting) => {
    const actionItems = Array.isArray(meeting.actionItems) ? meeting.actionItems : []
    return total + actionItems.filter(item => item.status === 'completed').length
  }, 0)
})

// 方法
const formatDate = (dateStr: string) => {
  if (!dateStr) return '未设置'
  const dt = new Date(dateStr)
  return Number.isNaN(dt.getTime()) ? dateStr : dt.toLocaleDateString('zh-CN')
}

watch(filteredMeetings, (list) => {
  const maxPage = Math.max(1, Math.ceil(list.length / pagination.value.pageSize) || 1)
  if (pagination.value.current > maxPage) {
    pagination.value.current = maxPage
  }
})

watch(() => pagination.value.pageSize, () => {
  pagination.value.current = 1
})

const loadMeetings = async () => {
  loading.value = true
  try {
    const response = await getMeetings(buildMeetingQueryParams())
    meetings.value = (response.content || []).map((meeting) => ({
      ...meeting,
      attendees: resolveMeetingAttendees(meeting)
    }))
  } catch (error) {
    console.error('加载例会数据失败:', error)
  } finally {
    loading.value = false
  }
}

const handleFilterChange = (nextFilters: MeetingFilterState) => {
  filters.value = normalizeMeetingFilters(nextFilters)
  pagination.value.current = 1
}

const handlePageChange = (page: number) => {
  pagination.value.current = page
}

const handlePageSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.current = 1
}

const handleCreate = () => {
  console.debug('[AdminMeetingManager] handleCreate called - navigate to editor')
  router.push({ name: 'AdminMeetingCreate' })
}

const handleView = (meeting: Meeting) => {
  console.debug('[AdminMeetingManager] handleView', meeting && meeting.id)
  detailModal.show = true
  detailModal.meeting = meeting
}

const handleViewFiles = (meeting: Meeting) => {
  const file = meeting.files?.[0]
  if (file?.url) {
    window.open(file.url, '_blank')
  }
}

const handleViewRecording = (meeting: Meeting) => {
  if (meeting.recording) {
    window.open(meeting.recording, '_blank')
  }
}

const handleEdit = (meeting: Meeting) => {
  console.debug('[AdminMeetingManager] handleEdit - navigate to editor', meeting && meeting.id)
  if (!meeting || !meeting.id) return
  router.push({ name: 'AdminMeetingEdit', params: { id: meeting.id } })
}

const handleDelete = async (meeting: Meeting) => {
  console.debug('[AdminMeetingManager] handleDelete', meeting && meeting.id)
  if (!confirm(`确定要删除例会 "${meeting.title}" 吗？`)) return
  try {
    await deleteMeeting(meeting.id)
    await loadMeetings()
    logMeetingAction('delete', `删除例会「${meeting.title}」`, 'success', meeting.id)
  } catch (error) {
    console.error('删除例会失败:', error)
    logMeetingAction('delete', `删除例会「${meeting.title}」失败`, 'failure', meeting.id)
  }
}

const handleDuplicate = async (meeting: Meeting) => {
  console.debug('[AdminMeetingManager] handleDuplicate', meeting && meeting.id)
  try {
    const payload: Partial<Meeting> = {
      ...meeting,
      id: undefined,
      title: `${meeting.title} (副本)`,
      meetingTime: new Date().toISOString().split('T')[0]
    }
    const duplicated = await createMeeting(payload)
    await loadMeetings()
    logMeetingAction('duplicate', `复制例会「${meeting.title}」`, 'success', duplicated.id)
  } catch (error) {
    console.error('复制例会失败:', error)
    logMeetingAction('duplicate', `复制例会「${meeting.title}」失败`, 'failure', meeting.id)
  }
}

// 删除使用 confirm()，无需额外的 confirmDelete 函数

const handleRefresh = () => {
  loadMeetings()
  logMeetingAction('refresh', '手动刷新例会列表')
}

onMounted(() => {
  loadMeetings()
  const stopRefreshListener = onAdminRefresh((detail) => {
    if (detail.entity === 'all' || detail.entity === 'meetings') {
      loadMeetings()
      const action = detail.action ?? 'refresh'
      logMeetingAction('refresh', `全局触发 ${action} 同步例会数据`)
    }
  })
  cleanupFns.push(stopRefreshListener)
})

onUnmounted(() => {
  cleanupFns.forEach((stop) => stop())
})
</script>

<style scoped>
.admin-meeting-manager {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.manager-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.filter-section {
  margin-bottom: 2rem;
}

.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.stat-card {
  padding: 1.5rem;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
}

.meeting-icon { background: #dbeafe; }
.recent-icon { background: #dcfce7; }
.participants-icon { background: #fef3c7; }
.action-icon { background: #e0e7ff; }

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.content-card {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.view-controls {
  display: flex;
  gap: 0.25rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.view-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.view-btn.active,
.view-btn:hover {
  background: white;
  color: #374151;
}

.loading-container,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.meetings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.meeting-grid-item {
  height: 100%;
}

.meetings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.meeting-list-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s;
}

.meeting-list-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.meeting-list-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meeting-main-info {
  flex: 1;
}

.meeting-attendees-preview {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0.25rem 0 0.5rem;
}

.attendee-avatar {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.attendee-more {
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.25rem;
}

.meeting-main-info h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.meeting-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 0.875rem;
  color: #6b7280;
}

.meeting-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.view-btn {
  background: #dbeafe;
  color: #1d4ed8;
}

.view-btn:hover {
  background: #bfdbfe;
}

.edit-btn {
  background: #fef3c7;
  color: #d97706;
}

.edit-btn:hover {
  background: #fed7aa;
}

.duplicate-btn {
  background: #dcfce7;
  color: #059669;
}

.duplicate-btn:hover {
  background: #bbf7d0;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fecaca;
}

.pagination-section {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.warning-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .admin-meeting-manager {
    padding: 1rem;
  }
  
  .manager-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .meetings-grid {
    grid-template-columns: 1fr;
  }
  
  .meeting-list-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .meeting-actions {
    margin-left: 0;
    justify-content: center;
  }
}
</style>