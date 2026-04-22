<template>
  <div class="admin-member-manager">
    <div class="manager-header">
      <h2>成员管理</h2>
      <div class="header-actions">
        <BaseButton 
          variant="primary"
          @click="handleCreate"
        >
          + 添加成员
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
      <MemberFilter 
        v-model:filters="filters"
        :roles="roleOptions"
        @change="handleFilterChange"
      />
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <div class="stats-grid">
        <BaseCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon member-icon">
              👥
            </div>
            <div class="stat-info">
              <div class="stat-number">
                {{ totalMembers }}
              </div>
              <div class="stat-label">
                总成员数
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon active-icon">
              ✅
            </div>
            <div class="stat-info">
              <div class="stat-number">
                {{ activeMembers }}
              </div>
              <div class="stat-label">
                活跃成员
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon new-icon">
              🆕
            </div>
            <div class="stat-info">
              <div class="stat-number">
                {{ newMembers }}
              </div>
              <div class="stat-label">
                本月新增
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon skills-icon">
              🎯
            </div>
            <div class="stat-info">
              <div class="stat-number">
                {{ avgSkillsPerMember }}
              </div>
              <div class="stat-label">
                平均技能数
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- 成员列表 -->
    <div class="members-section">
      <BaseCard class="content-card">
        <template #header>
          <div class="section-header">
            <h3>成员列表</h3>
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

        <div
          v-if="loading"
          class="loading-container"
        >
          <LoadingSpinner />
          <p>加载成员数据中...</p>
        </div>

        <div
          v-else-if="filteredMembers.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">
            👥
          </div>
          <h3>暂无成员记录</h3>
          <p>您还没有添加任何团队成员</p>
          <BaseButton
            variant="primary"
            @click="handleCreate"
          >
            添加第一个成员
          </BaseButton>
        </div>

        <div v-else>
          <!-- 网格视图 -->
          <div
            v-if="viewMode === 'grid'"
            class="members-grid"
          >
            <div 
              v-for="member in paginatedMembers" 
              :key="member.id"
              class="member-grid-item"
            >
              <MemberCard 
                :member="member"
                :show-actions="true"
                @view="handleView"
                @edit="handleEdit"
                @delete="handleDelete"
                @toggle-status="handleToggleStatus"
              />
            </div>
          </div>

          <!-- 列表视图 -->
          <div
            v-else
            class="members-list"
          >
            <div 
              v-for="member in paginatedMembers" 
              :key="member.id"
              class="member-list-item"
            >
              <div class="member-list-content">
                <div class="member-main-info">
                  <div class="member-avatar">
                    <img 
                      v-if="member.avatar" 
                      :src="member.avatar" 
                      :alt="member.name"
                      class="avatar-image"
                    >
                    <div
                      v-else
                      class="avatar-placeholder"
                    >
                      {{ member.name.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  
                  <div class="member-details">
                    <h4>{{ member.name }}</h4>
                    <div class="member-meta">
                      <span class="meta-item">{{ member.role }}</span>
                      <span class="meta-item">
                        📅 {{ formatDate(member.joinDate) }}
                      </span>
                      <span class="meta-item">
                        🔧 {{ member.skills.length }} 项技能
                      </span>
                      <span 
                        class="status-badge"
                        :class="member.isActive ? 'active' : 'inactive'"
                      >
                        {{ member.isActive ? '活跃' : '非活跃' }}
                      </span>
                    </div>
                    
                    <div class="member-skills">
                      <span 
                        v-for="skill in member.skills.slice(0, 3)" 
                        :key="skill"
                        class="skill-tag"
                      >
                        {{ skill }}
                      </span>
                      <span 
                        v-if="member.skills.length > 3"
                        class="more-skills"
                      >
                        +{{ member.skills.length - 3 }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="member-actions">
                  <button 
                    class="action-btn view-btn"
                    title="查看详情"
                    @click="handleView(member)"
                  >
                    👁️
                  </button>
                  <button 
                    class="action-btn edit-btn"
                    title="编辑"
                    @click="handleEdit(member)"
                  >
                    ✏️
                  </button>
                  <button 
                    class="action-btn toggle-btn"
                    :title="member.isActive ? '设为非活跃' : '设为活跃'"
                    @click="handleToggleStatus(member)"
                  >
                    {{ member.isActive ? '⏸️' : '▶️' }}
                  </button>
                  <button 
                    class="action-btn delete-btn"
                    title="删除"
                    @click="handleDelete(member)"
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
              :total="paginationTotal"
              @page-change="handlePageChange"
              @update:page-size="handlePageSizeChange"
            />
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- 详情弹窗 -->
    <MemberDetailModal 
      v-model:show="detailModal.show"
      :member="detailModal.member"
      @close="detailModal.show = false"
    />

    <div
      class="search-actions"
      style="margin-left:1rem; display:flex; gap:0.5rem; align-items:center;"
    >
      <input
        v-model="searchQuery"
        class="search-input"
        placeholder="搜索姓名或关键字"
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
        @click="goCreateMember"
      >
        新建
      </BaseButton>
    </div>

    <!-- 删除通过确认框处理（与项目管理一致） -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { getMembers, updateMember, deleteMember } from '@/api/member'
import { 
  BaseButton, 
  BaseCard, 
  BasePagination, 
  LoadingSpinner 
} from '@/components/common'
import { GridIcon, ListIcon } from '@/components/icons'
import MemberFilter from '@/components/members/MemberFilter.vue'
import MemberCard from '@/components/members/MemberCard.vue'
import MemberDetailModal from '@/components/members/MemberDetailModal.vue'
import type { Member, FilterOptions } from '@/types/entities'
import { onAdminRefresh } from '@/utils/adminEvents'
import { recordAdminOperation } from '@/composables/useAdminLogs'

interface MemberFilterOptions extends Omit<FilterOptions, 'sortBy'> {
  skills: string[]
  role?: string
  sortBy: string
  isActive?: boolean
}

// 设置页面元数据
useHead({
  title: '成员管理 - 管理员后台',
  meta: [
    { name: 'description', content: '管理团队成员信息、查看统计数据' }
  ]
})

// 响应式数据
const members = ref<Member[]>([])
const loading = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

const filters = ref<MemberFilterOptions>({
  search: '',
  status: '',
  sortBy: 'id',
  sortOrder: 'asc',
  skills: [],
  role: 'all',
  isActive: undefined
})

const searchQuery = ref('')

const applySearch = () => {
  filters.value.search = searchQuery.value
  pagination.value.current = 1
}

const router = useRouter()

const resetSearch = () => {
  searchQuery.value = ''
  filters.value.search = ''
  pagination.value.current = 1
}

const goCreateMember = () => {
  router.push({ name: 'AdminMemberCreate' })
}

const pagination = ref({
  current: 1,
  pageSize: 12,
  total: 0
})

const detailModal = reactive({
  show: false,
  member: null as Member | null
}) as { show: boolean; member: Member | null }

// 删除改为使用 `confirm()`，不再需要 deleteModal

// 计算属性

type MemberLogAction = 'create' | 'update' | 'delete' | 'refresh'

const cleanupFns: Array<() => void> = []

const logMemberAction = (action: MemberLogAction, message: string, result: 'success' | 'failure' = 'success', targetId?: string | number) => {
  recordAdminOperation({
    entity: 'members',
    action,
    message,
    targetId,
    result
  }).catch((error) => {
    console.warn('记录成员操作日志失败:', error)
  })
}

const totalMembers = computed(() => filteredMembers.value.length)

const activeMembers = computed(() => {
  return members.value.filter(member => member.isActive).length
})

const newMembers = computed(() => {
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)
  return members.value.filter(member => 
    new Date(member.joinDate) >= thisMonth
  ).length
})

const avgSkillsPerMember = computed(() => {
  if (members.value.length === 0) return 0
  const totalSkills = members.value.reduce((total, member) => 
    total + member.skills.length, 0
  )
  return Math.round((totalSkills / members.value.length) * 10) / 10
})

const roleOptions = computed(() => {
  const counts = members.value.reduce<Record<string, number>>((acc, member) => {
    const role = member.role || '未分类'
    acc[role] = (acc[role] ?? 0) + 1
    return acc
  }, {})

  return [
    { id: 'all', name: '全部成员', count: members.value.length },
    ...Object.entries(counts).map(([role, count]) => ({ id: role, name: role, count }))
  ]
})

const filteredMembers = computed(() => {
  const keyword = filters.value.search?.trim().toLowerCase() || ''
  const sortBy = filters.value.sortBy || 'name'
  const sortOrder = filters.value.sortOrder === 'desc' ? -1 : 1

  const matchesKeyword = (member: Member) => {
    if (!keyword) return true
    return (
      member.name?.toLowerCase().includes(keyword) ||
      member.role?.toLowerCase().includes(keyword) ||
      member.bio?.toLowerCase().includes(keyword) ||
      member.skills?.some((skill) => skill.toLowerCase().includes(keyword))
    )
  }

  const matchesRole = (member: Member) => {
    if (!filters.value.role || filters.value.role === 'all') return true
    return member.role === filters.value.role
  }

  const matchesStatus = (member: Member) => {
    if (typeof filters.value.isActive !== 'boolean') return true
    return member.isActive === filters.value.isActive
  }

  const matchesSkills = (member: Member) => {
    if (!filters.value.skills?.length) return true
    return filters.value.skills.every((skill) => member.skills?.includes(skill))
  }

  const list = members.value.filter((member) =>
    matchesKeyword(member) && matchesRole(member) && matchesStatus(member) && matchesSkills(member)
  )

  return list.sort((a, b) => {
    if (sortBy === 'id') {
      const aNum = Number(a.id)
      const bNum = Number(b.id)
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return (aNum - bNum) * sortOrder
      }
      return String(a.id ?? '').localeCompare(String(b.id ?? '')) * sortOrder
    }
    if (sortBy === 'joinDate') {
      return (new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()) * sortOrder
    }
    if (sortBy === 'projectCount') {
      return ((a.projectCount || 0) - (b.projectCount || 0)) * sortOrder
    }
    if (sortBy === 'role') {
      return (a.role || '').localeCompare(b.role || '') * sortOrder
    }
    return (a.name || '').localeCompare(b.name || '') * sortOrder
  })
})

const paginationTotal = computed(() => filteredMembers.value.length)

const paginatedMembers = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  return filteredMembers.value.slice(start, start + pagination.value.pageSize)
})

// 方法
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const buildMemberQueryParams = () => {
  return {
    page: 0,
    size: 1000
  }
}

const normalizeMember = (member: Member): Member => ({
  ...member,
  // 防御性填充，避免后续计算中出现 undefined
  avatar: (() => {
    const raw = member.avatar ?? (member as Member & { avatarUrl?: string }).avatarUrl ?? ''
    const normalized = raw.replace(/\\/g, '/').trim()
    if (!normalized) return ''
    if (/^(data:|blob:)/i.test(normalized)) return normalized
    if (/^https?:\/\//i.test(normalized)) return normalized
    if (normalized.startsWith('/')) return normalized
    if (/^(src|assets)\//i.test(normalized)) return `/${normalized}`
    const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
    return base ? `${base}/${normalized}` : normalized
  })(),
  skills: member.skills ?? [],
  joinDate: member.joinDate ?? '',
  isActive: member.isActive ?? false
})

const loadMembers = async () => {
  loading.value = true
  try {
    const response = await getMembers(buildMemberQueryParams())
    members.value = (response.content || []).map(normalizeMember)
    pagination.value.total = members.value.length
    pagination.value.current = 1
  } catch (error) {
    console.error('加载成员数据失败:', error)
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

const handlePageSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.current = 1
}

watch(filteredMembers, (list) => {
  const maxPage = Math.max(1, Math.ceil(list.length / pagination.value.pageSize))
  if (pagination.value.current > maxPage) {
    pagination.value.current = maxPage
  }
})

const handleCreate = () => {
  console.debug('[AdminMemberManager] handleCreate called - navigate to editor')
  router.push({ name: 'AdminMemberCreate' })
}

const handleView = (member: Member) => {
  console.debug('[AdminMemberManager] handleView', member && member.id)
  detailModal.show = true
  detailModal.member = member
}

const handleEdit = (member: Member) => {
  console.debug('[AdminMemberManager] handleEdit - navigate to editor', member && member.id)
  if (!member || !member.id) return
  router.push({ name: 'AdminMemberEdit', params: { id: member.id } })
}

const handleToggleStatus = async (member: Member) => {
  console.debug('[AdminMemberManager] handleToggleStatus', member && member.id)
  const nextStatus = !member.isActive
  try {
    await updateMember(member.id, { isActive: nextStatus })
    await loadMembers()
    const statusLabel = nextStatus ? '活跃' : '非活跃'
    logMemberAction('update', `切换成员「${member.name}」状态为 ${statusLabel}`, 'success', member.id)
  } catch (error) {
    console.error('切换成员状态失败:', error)
    logMemberAction('update', `切换成员「${member.name}」状态失败`, 'failure', member.id)
  }
}

const handleDelete = async (member: Member) => {
  console.debug('[AdminMemberManager] handleDelete', member && member.id)
  if (!confirm(`确定要删除成员 "${member.name}" 吗？`)) return
  try {
    await deleteMember(member.id)
    await loadMembers()
    logMemberAction('delete', `删除成员「${member.name}」`, 'success', member.id)
  } catch (error) {
    console.error('删除成员失败:', error)
    logMemberAction('delete', `删除成员「${member.name}」失败`, 'failure', member.id)
  }
}

// 删除使用 confirm()，无需额外的 confirmDelete 函数

const handleRefresh = () => {
  loadMembers()
  logMemberAction('refresh', '手动刷新成员列表')
}

onMounted(() => {
  loadMembers()
  const stopRefresh = onAdminRefresh((detail) => {
    if (detail.entity === 'all' || detail.entity === 'members') {
      loadMembers()
      logMemberAction('refresh', `全局触发 ${detail.action ?? 'refresh'} 同步成员数据`)
    }
  })
  cleanupFns.push(stopRefresh)
})

onUnmounted(() => {
  cleanupFns.forEach((stop) => stop())
})
</script>

<style scoped>
.admin-member-manager {
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

.member-icon { background: #dbeafe; }
.active-icon { background: #dcfce7; }
.new-icon { background: #fef3c7; }
.skills-icon { background: #e0e7ff; }

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

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.member-grid-item {
  height: 100%;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.member-list-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s;
}

.member-list-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.member-list-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.member-main-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.member-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
}

.member-details {
  flex: 1;
  min-width: 0;
}

.member-details h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.member-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.meta-item {
  font-size: 0.875rem;
  color: #6b7280;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.member-skills {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.skill-tag {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

.more-skills {
  padding: 0.25rem 0.5rem;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
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

.toggle-btn {
  background: #e0e7ff;
  color: #4f46e5;
}

.toggle-btn:hover {
  background: #c7d2fe;
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
  .admin-member-manager {
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
  
  .members-grid {
    grid-template-columns: 1fr;
  }
  
  .member-list-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .member-actions {
    justify-content: center;
  }
}
</style>