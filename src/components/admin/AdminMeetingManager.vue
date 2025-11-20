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
        v-model:filters="filters"
        @change="handleFilterChange"
      />
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <div class="stats-grid">
        <BaseCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon meeting-icon">📅</div>
            <div class="stat-info">
              <div class="stat-number">{{ totalMeetings }}</div>
              <div class="stat-label">总例会数</div>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon recent-icon">🆕</div>
            <div class="stat-info">
              <div class="stat-number">{{ recentMeetings }}</div>
              <div class="stat-label">本周例会</div>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon participants-icon">👥</div>
            <div class="stat-info">
              <div class="stat-number">{{ totalParticipants }}</div>
              <div class="stat-label">参与人次</div>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon action-icon">✅</div>
            <div class="stat-info">
              <div class="stat-number">{{ completedActions }}</div>
              <div class="stat-label">待办完成</div>
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
          </div>
        </template>

        <div v-if="loading" class="loading-container">
          <LoadingSpinner />
          <p>加载例会数据中...</p>
        </div>

        <div v-else-if="filteredMeetings.length === 0" class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>暂无例会记录</h3>
          <p>您还没有创建任何例会记录</p>
          <BaseButton variant="primary" @click="handleCreate">
            创建第一个例会
          </BaseButton>
        </div>

        <div v-else>
          <!-- 网格视图 -->
          <div v-if="viewMode === 'grid'" class="meetings-grid">
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
          <div v-else class="meetings-list">
            <div 
              v-for="meeting in paginatedMeetings" 
              :key="meeting.id"
              class="meeting-list-item"
            >
              <div class="meeting-list-content">
                <div class="meeting-main-info">
                  <h4>{{ meeting.title }}</h4>
                  <div class="meeting-meta">
                    <span class="meta-item">
                      📅 {{ formatDate(meeting.date) }}
                    </span>
                    <span class="meta-item">
                      🕐 {{ meeting.time }}
                    </span>
                    <span class="meta-item">
                      👥 {{ meeting.attendees.length }} 人参与
                    </span>
                  </div>
                </div>
                <div class="meeting-actions">
                  <button 
                    class="action-btn view-btn"
                    @click="handleView(meeting)"
                    title="查看详情"
                  >
                    👁️
                  </button>
                  <button 
                    class="action-btn edit-btn"
                    @click="handleEdit(meeting)"
                    title="编辑"
                  >
                    ✏️
                  </button>
                  <button 
                    class="action-btn duplicate-btn"
                    @click="handleDuplicate(meeting)"
                    title="复制"
                  >
                    📋
                  </button>
                  <button 
                    class="action-btn delete-btn"
                    @click="handleDelete(meeting)"
                    title="删除"
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
              :current="pagination.current"
              :page-size="pagination.pageSize"
              :total="pagination.total"
              @change="handlePageChange"
            />
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- 详情弹窗 -->
    <MeetingDetailModal 
      v-model:show="detailModal.show"
      :meeting="detailModal.meeting"
      @close="detailModal.show = false"
    />

    <!-- 编辑/创建弹窗 -->
    <MeetingEditModal 
      v-model:show="editModal.show"
      :meeting="editModal.meeting"
      :is-create="editModal.isCreate"
      @save="handleSave"
      @close="editModal.show = false"
    />

    <!-- 删除确认弹窗 -->
    <BaseModal 
      v-model:show="deleteModal.show"
      title="确认删除"
      size="sm"
    >
      <p>确定要删除例会「{{ deleteModal.meeting?.title }}」吗？</p>
      <p class="warning-text">此操作不可撤销。</p>

      <template #footer>
        <BaseButton 
          variant="secondary" 
          @click="deleteModal.show = false"
        >
          取消
        </BaseButton>
        <BaseButton 
          variant="danger"
          :loading="deleteModal.loading"
          @click="confirmDelete"
        >
          删除
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { getMeetings, createMeeting, updateMeeting, deleteMeeting } from '@/api/meeting'
import { 
  BaseButton, 
  BaseCard, 
  BasePagination, 
  BaseModal,
  LoadingSpinner 
} from '@/components/common'
import { GridIcon, ListIcon } from '@/components/icons'
import MeetingFilter from '@/components/meetings/MeetingFilter.vue'
import MeetingCard from '@/components/meetings/MeetingCard.vue'
import MeetingDetailModal from '@/components/meetings/MeetingDetailModal.vue'
import type { Meeting, FilterOptions } from '@/types/entities'

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

const filters = ref<FilterOptions>({
  search: '',
  status: '',
  sortBy: 'date',
  sortOrder: 'desc'
})

const pagination = ref({
  current: 1,
  pageSize: 12,
  total: 0
})

const detailModal = ref({
  show: false,
  meeting: null as Meeting | null
})

const editModal = ref({
  show: false,
  meeting: null as Meeting | null,
  isCreate: false
})

const deleteModal = ref({
  show: false,
  meeting: null as Meeting | null,
  loading: false
})

// 计算属性
const filteredMeetings = computed(() => meetings.value)

const paginatedMeetings = computed(() => meetings.value)

watch(() => pagination.value.current, () => {
  loadMeetings()
})

watch(() => filters.value, () => {
  pagination.value.current = 1
  loadMeetings()
}, { deep: true })

const totalMeetings = computed(() => meetings.value.length)

const recentMeetings = computed(() => {
  const thisWeek = new Date()
  thisWeek.setDate(thisWeek.getDate() - 7)
  return meetings.value.filter(meeting => 
    new Date(meeting.date) >= thisWeek
  ).length
})

const totalParticipants = computed(() => {
  return meetings.value.reduce((total, meeting) => 
    total + meeting.attendees.length, 0
  )
})

const completedActions = computed(() => {
  return meetings.value.reduce((total, meeting) => 
    total + meeting.actionItems.filter(item => item.status === 'completed').length, 0
  )
})

// 方法
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const loadMeetings = async () => {
  loading.value = true
  try {
    const response = await getMeetings({
      page: pagination.value.current - 1, // API uses 0-based indexing
      size: pagination.value.pageSize,
      keyword: filters.value.search,
      // startDate: filters.value.dateRange?.start, // Assuming filters might have dateRange later or we ignore it for now if not in FilterOptions
      // endDate: filters.value.dateRange?.end
    })
    
    meetings.value = response.content
    pagination.value.total = response.totalElements
  } catch (error) {
    console.error('加载例会数据失败:', error)
  } finally {
    loading.value = false
  }
}

const handleFilterChange = () => {
  pagination.value.current = 1
}

const handlePageChange = (page: number) => {
  pagination.value.current = page
}

const handleCreate = () => {
  editModal.value = {
    show: true,
    meeting: null,
    isCreate: true
  }
}

const handleView = (meeting: Meeting) => {
  detailModal.value = {
    show: true,
    meeting
  }
}

const handleEdit = (meeting: Meeting) => {
  editModal.value = {
    show: true,
    meeting: { ...meeting },
    isCreate: false
  }
}

const handleDelete = (meeting: Meeting) => {
  deleteModal.value = {
    show: true,
    meeting,
    loading: false
  }
}

const handleDuplicate = (meeting: Meeting) => {
  const duplicatedMeeting = {
    ...meeting,
    id: Date.now().toString(),
    title: `${meeting.title} (副本)`,
    date: new Date().toISOString().split('T')[0]
  }
  
  meetings.value.unshift(duplicatedMeeting)
}

const handleSave = async (meeting: Meeting) => {
  try {
    if (editModal.value.isCreate) {
      await createMeeting(meeting)
    } else {
      await updateMeeting(meeting.id, meeting)
    }
    await loadMeetings()
    editModal.value.show = false
  } catch (error) {
    console.error('保存例会失败:', error)
  }
}

const confirmDelete = async () => {
  if (!deleteModal.value.meeting) return
  
  deleteModal.value.loading = true
  
  try {
    await deleteMeeting(deleteModal.value.meeting.id)
    await loadMeetings()
    deleteModal.value.show = false
  } catch (error) {
    console.error('删除例会失败:', error)
  } finally {
    deleteModal.value.loading = false
  }
}

const handleRefresh = () => {
  loadMeetings()
}

// 组件挂载时加载数据
onMounted(() => {
  loadMeetings()
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