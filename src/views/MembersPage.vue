<template>
  <div class="members-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <UsersIcon class="title-icon" />
              团队成员
            </h1>
            <p class="page-description">
              认识我们的团队成员，了解每个人的专业技能和研究方向
            </p>
          </div>
          <div class="header-stats">
            <div class="stat-card">
              <div class="stat-value">
                {{ totalMembers }}
              </div>
              <div class="stat-label">
                团队成员
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-value">
                {{ activeMembers }}
              </div>
              <div class="stat-label">
                活跃成员
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-value">
                {{ totalProjects }}
              </div>
              <div class="stat-label">
                参与项目
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页面内容 -->
    <div class="page-content">
      <div class="container">
        <div class="content-layout">
          <!-- 筛选侧边栏 -->
          <aside class="filter-sidebar">
            <MemberFilter
              v-model:filters="filters"
              :roles="roleOptions"
              :tech-stacks="techStackOptions"
              @change="handleFiltersChange"
            />
          </aside>

          <!-- 成员列表 -->
          <main class="members-main">
            <!-- 列表头部 -->
            <div class="list-header">
              <div class="results-info">
                <span class="results-count">
                  共找到 {{ totalCount }} 位成员
                </span>
                <span
                  v-if="hasActiveFilters"
                  class="active-filters"
                >
                  （已应用筛选条件）
                </span>
              </div>
              <div class="view-toggle">
                <button
                  class="view-btn"
                  :class="{ active: viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                >
                  <GridIcon />
                </button>
                <button
                  class="view-btn"
                  :class="{ active: viewMode === 'list' }"
                  @click="viewMode = 'list'"
                >
                  <ListIcon />
                </button>
              </div>
            </div>

            <!-- 首屏加载 -->
            <div
              v-if="isLoading && !hasLoadedOnce"
              class="loading-state"
            >
              <div class="loading-spinner" />
              <p>正在加载团队成员...</p>
            </div>

            <!-- 错误状态 -->
            <div
              v-else-if="errorMessage && !members.length"
              class="error-state"
            >
              <p>{{ errorMessage }}</p>
              <BaseButton
                variant="outline"
                @click="loadMembers"
              >
                重试
              </BaseButton>
            </div>

            <!-- 成员内容 -->
            <div
              v-else
              class="members-grid-wrapper"
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
                  <p>正在刷新列表...</p>
                </div>
              </transition>

              <div
                v-if="members.length > 0"
                class="members-grid"
              >
                <MemberCard
                  v-for="member in paginatedMembers"
                  :key="member.id"
                  :member="member"
                  @click="selectMember(member)"
                />
              </div>

              <div
                v-else
                class="empty-state"
              >
                <div class="empty-icon">
                  <UsersIcon />
                </div>
                <h3 class="empty-title">
                  未找到匹配的成员
                </h3>
                <p class="empty-description">
                  请尝试调整筛选条件或搜索关键词
                </p>
                <BaseButton
                  variant="outline"
                  @click="clearAllFilters"
                >
                  清除所有筛选
                </BaseButton>
              </div>
            </div>

            <!-- 分页 -->
            <div
              v-if="totalCount > pageSize"
              class="pagination-wrapper"
            >
              <BasePagination
                v-model:current="currentPage"
                :total="totalCount"
                :page-size="pageSize"
                @change="handlePageChange"
              />
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- 成员详情模态框 -->
    <BaseModal
      v-model:show="showMemberModal"
      :title="selectedMember?.name || ''"
      size="lg"
    >
      <div
        v-if="selectedMember"
        class="member-detail"
      >
        <div class="member-header">
          <BaseAvatar
            class="member-avatar-large"
            :src="selectedMember.avatar"
            :alt="selectedMember.name"
            :fallback-text="selectedMember.name"
            size="120"
            ring
          />
          <div class="member-info">
            <h2 class="member-name">
              {{ selectedMember.name }}
            </h2>
            <p class="member-role">
              {{ selectedMember.role }}
            </p>
            <p
              v-if="selectedMember.grade && selectedMember.major"
              class="member-grade"
            >
              {{ selectedMember.grade }} • {{ selectedMember.major }}
            </p>
            <div class="member-links">
              <a
                v-if="selectedMember.github"
                :href="selectedMember.github"
                target="_blank"
                class="link-btn"
              >
                <GithubIcon />
                GitHub
              </a>
              <a
                v-if="selectedMember.email"
                :href="`mailto:${selectedMember.email}`"
                class="link-btn"
              >
                <EmailIcon />
                邮箱
              </a>
            </div>
          </div>
        </div>
        
        <div class="member-content">
          <div
            v-if="selectedMember.bio"
            class="member-bio"
          >
            <h3>个人简介</h3>
            <p>{{ selectedMember.bio }}</p>
          </div>
          
          <div class="member-skills">
            <h3>技能标签</h3>
            <div class="skills-list">
              <span
                v-for="skill in selectedMember.skills"
                :key="skill"
                class="skill-tag"
              >
                {{ skill }}
              </span>
            </div>
          </div>
          
          <div class="member-stats">
            <div class="stat-item">
              <CalendarIcon class="stat-icon" />
              <div>
                <div class="stat-label">
                  加入时间
                </div>
                <div class="stat-value">
                  {{ formatDate(selectedMember.joinDate) }}
                </div>
              </div>
            </div>
            <div class="stat-item">
              <ProjectIcon class="stat-icon" />
              <div>
                <div class="stat-label">
                  参与项目
                </div>
                <div class="stat-value">
                  {{ selectedMember.projectCount || 0 }}个
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Member, MemberListFilters, RoleOption, MemberListResponse } from '@/types/entities'
import { getMembers } from '@/api/member'
import { 
  UsersIcon, 
  GridIcon, 
  ListIcon, 
  GithubIcon, 
  EmailIcon,
  CalendarIcon,
  ProjectIcon
} from '@/components/icons'
import MemberCard from '@/components/members/MemberCard.vue'
import MemberFilter from '@/components/members/MemberFilter.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseAvatar from '@/components/common/BaseAvatar.vue'

// 页面元数据设置
onMounted(() => {
  document.title = '团队成员 - 大连理工大学区块链组'
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', '区块链组团队成员介绍，了解团队专业技能和研究方向')
  } else {
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = '区块链组团队成员介绍，了解团队专业技能和研究方向'
    document.head.appendChild(meta)
  }
})

const MEMBERS_CACHE_KEY = 'members:list-cache'

const members = ref<Member[]>([])
const totalCount = ref(0)
const totals = ref<Record<string, number> | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')
const hasLoadedOnce = ref(false)

const roleOptions = ref<RoleOption[]>([
  { id: 'all', name: '全部成员', count: 0 }
])

const defaultTechStacks = [
  'Solidity', 'Web3.js', 'React', 'Vue.js', 'Python', 'Django',
  'Node.js', 'TypeScript', 'IPFS', 'Ethereum', 'DeFi', 'NFT',
  'Java', 'Spring', 'Go', 'Docker', 'Kubernetes', 'MongoDB'
]
const techStackOptions = ref<string[]>([...defaultTechStacks])

// 筛选相关
type MembersPageFilters = MemberListFilters & {
  skills: string[]
  sortBy: 'name' | 'joinDate' | 'projectCount' | 'role'
  role: string
}

type MemberFilterPayload = {
  search?: string
  role?: string
  skills: string[]
  sortBy: string
  isActive?: boolean
}

const filters = ref<MembersPageFilters>({
  search: '',
  role: 'all',
  skills: [],
  sortBy: 'name',
  isActive: undefined
})

// 视图模式
const viewMode = ref<'grid' | 'list'>('grid')

// 分页
const currentPage = ref(1)
const pageSize = ref(12)

// 模态框
const showMemberModal = ref(false)
const selectedMember = ref<Member | null>(null)

// 统计数据
const totalMembers = computed(() => totals.value?.totalMembers ?? totalCount.value)
const activeMembers = computed(() => {
  if (typeof totals.value?.activeMembers === 'number') return totals.value.activeMembers
  return members.value.filter(member => member.isActive).length
})
const totalProjects = computed(() => {
  if (typeof totals.value?.totalProjects === 'number') return totals.value.totalProjects
  return members.value.reduce((sum, member) => sum + (member.projectCount || 0), 0)
})

// 是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return Boolean(
    filters.value.search ||
    (filters.value.role && filters.value.role !== 'all') ||
    (filters.value.skills && filters.value.skills.length > 0) ||
    filters.value.isActive !== undefined
  )
})

const paginatedMembers = computed(() => members.value)

const applyMemberResponse = (response: MemberListResponse) => {
  members.value = response.items || []
  totalCount.value = response.total ?? members.value.length
  totals.value = (response.totals as Record<string, number>) || null

  if (response.filters?.roles?.length) {
    const totalFromRoles = response.filters.roles.reduce((sum, role) => sum + (role.count || 0), 0)
    roleOptions.value = [
      { id: 'all', name: '全部成员', count: totalFromRoles },
      ...response.filters.roles
    ]
  } else {
    roleOptions.value = [{ id: 'all', name: '全部成员', count: totalCount.value }]
  }

  if (response.filters?.skills?.length) {
    techStackOptions.value = response.filters.skills as string[]
  } else {
    techStackOptions.value = [...defaultTechStacks]
  }
}

const cacheMemberSnapshot = (payload: MemberListResponse) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(MEMBERS_CACHE_KEY, JSON.stringify(payload))
  } catch (error) {
    console.warn('缓存成员列表失败', error)
  }
}

const hydrateMembersFromCache = (silent = false) => {
  if (typeof window === 'undefined') return false
  try {
    const cacheRaw = window.localStorage.getItem(MEMBERS_CACHE_KEY)
    if (!cacheRaw) return false
    const parsed = JSON.parse(cacheRaw) as MemberListResponse
    if (!parsed?.items?.length) return false
    applyMemberResponse(parsed)
    if (!silent) {
      errorMessage.value = ''
    }
    return true
  } catch (error) {
    console.warn('读取成员缓存失败', error)
    return false
  }
}

const loadMembers = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await getMembers({
      page: currentPage.value,
      pageSize: pageSize.value,
      search: filters.value.search,
      role: filters.value.role && filters.value.role !== 'all' ? filters.value.role : undefined,
      skills: filters.value.skills,
      sortBy: filters.value.sortBy as MemberListFilters['sortBy'],
      isActive: filters.value.isActive,
      sortOrder: 'asc'
    })

    applyMemberResponse(response)
    cacheMemberSnapshot(response)
  } catch (error) {
    console.error('获取成员列表失败', error)
    const fallbackMessage = error instanceof Error ? error.message : '获取成员列表失败'
    errorMessage.value = fallbackMessage

    if (!members.value.length) {
      const restored = hydrateMembersFromCache(true)
      if (restored) {
        errorMessage.value = '已显示最近一次的离线数据'
      } else {
        totalCount.value = 0
      }
    }
  } finally {
    isLoading.value = false
    hasLoadedOnce.value = true
  }
}

const handleFiltersChange = (newFilters: MemberFilterPayload) => {
  filters.value = {
    ...filters.value,
    ...newFilters,
    sortBy: (newFilters.sortBy as MembersPageFilters['sortBy']) || filters.value.sortBy
  }
  currentPage.value = 1
  loadMembers()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadMembers()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 选择成员
const selectMember = (member: Member) => {
  selectedMember.value = member
  showMemberModal.value = true
}

// 清除所有筛选
const clearAllFilters = () => {
  filters.value = {
    search: '',
    role: 'all',
    skills: [],
    sortBy: 'name',
    isActive: undefined
  }
  currentPage.value = 1
  loadMembers()
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}

watch(pageSize, () => {
  currentPage.value = 1
  loadMembers()
})

onMounted(() => {
  if (hydrateMembersFromCache(true)) {
    hasLoadedOnce.value = true
  }
  loadMembers()
})
</script>

<style scoped>
.members-page {
  @apply min-h-screen bg-gray-50;
}

.page-header {
  @apply bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16;
}

.header-content {
  @apply flex items-center justify-between;
}

.header-text {
  @apply max-w-2xl;
}

.page-title {
  @apply text-4xl font-bold mb-4 flex items-center gap-3;
}

.title-icon {
  @apply w-10 h-10;
}

.page-description {
  @apply text-xl text-blue-100;
}

.header-stats {
  @apply flex gap-6;
}

.stat-card {
  @apply bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center;
}

.stat-value {
  @apply text-2xl font-bold;
}

.stat-label {
  @apply text-sm text-blue-100;
}

.page-content {
  @apply py-12;
}

.content-layout {
  @apply flex gap-8;
}

.filter-sidebar {
  @apply w-80 flex-shrink-0;
}

.members-main {
  @apply flex-1;
}

.list-header {
  @apply flex items-center justify-between mb-8;
}

.results-info {
  @apply text-gray-600;
}

.results-count {
  @apply font-medium;
}

.active-filters {
  @apply text-blue-600;
}

.view-toggle {
  @apply flex border border-gray-300 rounded-lg overflow-hidden;
}

.view-btn {
  @apply p-2 text-gray-600 hover:bg-gray-100 transition-colors;
}

.view-btn.active {
  @apply bg-blue-500 text-white;
}

.members-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

.members-grid-wrapper {
  @apply relative min-h-[200px];
}

.grid-overlay {
  @apply absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm text-gray-600 rounded-2xl;
}

.loading-spinner.small {
  @apply w-8 h-8 mb-2 border-2 border-blue-200 border-t-blue-500;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-16 text-center;
}

.empty-icon {
  @apply w-16 h-16 text-gray-400 mb-4;
}

.empty-title {
  @apply text-xl font-medium text-gray-900 mb-2;
}

.empty-description {
  @apply text-gray-600 mb-6;
}

.pagination-wrapper {
  @apply mt-8 flex justify-center;
}

.loading-state,
.error-state {
  @apply flex flex-col items-center justify-center py-12 text-gray-600;
}

.loading-spinner {
  @apply w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 成员详情模态框样式 */
.member-detail {
  @apply space-y-6;
}

.member-header {
  @apply flex gap-6 pb-6 border-b border-gray-200;
}

.member-avatar-large {
  @apply w-28 h-28 sm:w-24 sm:h-24 rounded-full border-4 border-blue-100;
}

.member-info {
  @apply flex-1;
}

.member-name {
  @apply text-2xl font-bold text-gray-900 mb-2;
}

.member-role {
  @apply text-lg text-blue-600 font-medium mb-1;
}

.member-grade {
  @apply text-gray-600 mb-4;
}

.member-links {
  @apply flex gap-3;
}

.link-btn {
  @apply flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors;
}

.member-content {
  @apply space-y-6;
}

.member-bio h3,
.member-skills h3 {
  @apply text-lg font-medium text-gray-900 mb-3;
}

.member-bio p {
  @apply text-gray-600 leading-relaxed;
}

.skills-list {
  @apply flex flex-wrap gap-2;
}

.skill-tag {
  @apply px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full;
}

.member-stats {
  @apply grid grid-cols-2 gap-4;
}

.stat-item {
  @apply flex items-center gap-3 p-3 bg-gray-50 rounded-lg;
}

.stat-icon {
  @apply w-6 h-6 text-gray-400;
}

.stat-label {
  @apply text-sm text-gray-600;
}

.stat-value {
  @apply font-medium text-gray-900;
}

/* 移动端适配 */
@media (max-width: 1024px) {
  .content-layout {
    @apply flex-col;
  }
  
  .filter-sidebar {
    @apply w-full;
  }
}

@media (max-width: 768px) {
  .page-header {
    @apply py-12;
  }
  
  .header-content {
    @apply flex-col items-start gap-6;
  }
  
  .header-stats {
    @apply w-full;
  }
  
  .members-grid {
    @apply grid-cols-1 md:grid-cols-2;
  }
  
  .member-header {
    @apply flex-col items-center text-center;
  }
  
  .member-stats {
    @apply grid-cols-1;
  }
}
</style>