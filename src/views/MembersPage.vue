<template>
  <div class="members-page">
    <!-- 页面头部 -->
    <header class="gradient-hero flowing-gradient-lagoon text-white overflow-hidden page-header">
      <div class="hero-stars">
        <span style="top:15%;left:12%;animation-duration:18s" />
        <span style="top:32%;left:80%;animation-duration:21s;animation-delay:1.2s" />
        <span style="top:60%;left:28%;animation-duration:15s;animation-delay:2.4s" />
        <span style="top:78%;left:66%;animation-duration:24s;animation-delay:3.1s" />
      </div>
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
    </header>

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
            <div
              v-if="isLoading"
              class="members-loading"
            >
              <div class="loading-spinner" />
              <p class="loading-text">
                加载成员数据中...
              </p>
            </div>

            <div v-else>
              <!-- 列表头部 -->
              <div class="list-header">
                <div class="results-info">
                  <span class="results-count">
                    共找到 {{ filteredMembers.length }} 位成员
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

              <!-- 成员网格 -->
              <div
                v-if="filteredMembers.length > 0"
                class="members-grid"
              >
                <MemberCard
                  v-for="member in paginatedMembers"
                  :key="member.id"
                  :member="member"
                  @click="selectMember(member)"
                />
              </div>

              <!-- 空状态 -->
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

              <!-- 分页 -->
              <div
                v-if="filteredMembers.length > pageSize"
                class="pagination-wrapper"
              >
                <BasePagination
                  v-model:current="currentPage"
                  :total="filteredMembers.length"
                  :page-size="pageSize"
                  @change="handlePageChange"
                />
              </div>
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
          <img
            :src="selectedMember.avatar || '/images/default-avatar.png'"
            :alt="selectedMember.name"
            class="member-avatar-large"
          >
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
import { ref, computed, onMounted } from 'vue'
import type { Member } from '@/types/entities'
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
import { throttle } from '@/utils/jieliu'
interface MemberFiltersState {
  search: string
  role: string
  skills: string[]
  sortBy: string
  isActive?: boolean
}

type MemberFiltersPayload = Partial<MemberFiltersState>

const allMembers = ref<Member[]>([])
const isLoading = ref(false)

const filters = ref<MemberFiltersState>({
  search: '',
  role: 'all',
  skills: [],
  sortBy: 'role',
  isActive: undefined
})

const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const pageSize = ref(12)
const showMemberModal = ref(false)
const selectedMember = ref<Member | null>(null)

const roleOptions = computed(() => {
  const counts = allMembers.value.reduce<Record<string, number>>((acc, member) => {
    const role = member.role || '未分类'
    acc[role] = (acc[role] ?? 0) + 1
    return acc
  }, {})

  return [
    { id: 'all', name: '全部成员', count: allMembers.value.length },
    ...Object.entries(counts).map(([role, count]) => ({
      id: role,
      name: role,
      count
    }))
  ]
})

const techStackOptions = [
  'Solidity', 'Web3.js', 'React', 'Vue.js', 'Python', 'Django',
  'Node.js', 'TypeScript', 'IPFS', 'Ethereum', 'DeFi', 'NFT',
  'Java', 'Spring', 'Go', 'Docker', 'Kubernetes', 'MongoDB'
]

const totalMembers = computed(() => allMembers.value.length)
const activeMembers = computed(() => allMembers.value.filter((member) => member.isActive).length)
const totalProjects = computed(() =>
  allMembers.value.reduce((sum, member) => sum + (member.projectCount || 0), 0)
)

const hasActiveFilters = computed(() =>
  Boolean(filters.value.search ||
    filters.value.role !== 'all' ||
    filters.value.skills.length > 0 ||
    filters.value.isActive !== undefined)
)

const filteredMembers = computed(() => {
  let result = [...allMembers.value]

  if (filters.value.search) {
    const query = filters.value.search.toLowerCase()
    result = result.filter((member) =>
      member.name.toLowerCase().includes(query) ||
      member.skills.some((skill) => skill.toLowerCase().includes(query)) ||
      member.role.toLowerCase().includes(query)
    )
  }

  if (filters.value.role && filters.value.role !== 'all') {
    result = result.filter((member) => member.role === filters.value.role)
  }

  if (filters.value.skills.length > 0) {
    result = result.filter((member) =>
      filters.value.skills.every((skill) =>
        member.skills.some((memberSkill) =>
          memberSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    )
  }

  if (filters.value.isActive !== undefined) {
    result = result.filter((member) => member.isActive === filters.value.isActive)
  }

  result = result.sort((a, b) => {
    switch (filters.value.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'joinDate':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
      case 'projectCount':
        return (b.projectCount || 0) - (a.projectCount || 0)
      case 'role':
        return a.role.localeCompare(b.role)
      default:
        return 0
    }
  })

  return result
})

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMembers.value.slice(start, end)
})

const fetchPageSize = computed(() => Math.max(pageSize.value * 3, 30))

type RawMember = Partial<Member> & Record<string, unknown>

const normalizeMember = (raw: RawMember): Member => {
  const joinDate = typeof raw.joinDate === 'string' && raw.joinDate
    ? raw.joinDate
    : typeof raw.createdAt === 'string' && raw.createdAt
      ? raw.createdAt
      : ''

  const skills = Array.isArray(raw.skills)
    ? (raw.skills as unknown[]).filter((skill): skill is string => typeof skill === 'string')
    : []

  const projectCount = typeof raw.projectCount === 'number'
    ? raw.projectCount
    : 0

  const status = typeof raw.status === 'string' ? raw.status : undefined
  const isActive = typeof raw.isActive === 'boolean'
    ? raw.isActive
    : status === 'ACTIVE'

  const id = raw.id !== undefined ? String(raw.id) : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const name = typeof raw.name === 'string' ? raw.name : '未知成员'
  const role = typeof raw.role === 'string' ? raw.role : '成员'

  return {
    id,
    name,
    role,
    avatar: typeof raw.avatar === 'string' && raw.avatar
      ? raw.avatar
      : typeof raw.avatarUrl === 'string'
        ? raw.avatarUrl
        : undefined,
    bio: typeof raw.bio === 'string' ? raw.bio : undefined,
    skills,
    grade: typeof raw.grade === 'string' ? raw.grade : undefined,
    major: typeof raw.major === 'string' ? raw.major : undefined,
    projectCount,
    email: typeof raw.email === 'string' ? raw.email : undefined,
    github: typeof raw.github === 'string'
      ? raw.github
      : typeof raw.githubUrl === 'string'
        ? raw.githubUrl
        : undefined,
    linkedin: typeof raw.linkedin === 'string'
      ? raw.linkedin
      : typeof raw.linkedinUrl === 'string'
        ? raw.linkedinUrl
        : undefined,
    joinDate,
    isActive
  }
}

const loadMembers = async () => {
  isLoading.value = true
  try {
    const response = await getMembers({
      page: 0,
      size: fetchPageSize.value,
      keyword: filters.value.search || undefined,
      role: filters.value.role !== 'all' ? filters.value.role : undefined
    })
    const rawList = response.content ?? []
    allMembers.value = rawList.map((member) => normalizeMember(member as RawMember))
  } catch (error) {
    console.error('获取成员列表失败:', error)
    allMembers.value = []
  } finally {
    isLoading.value = false
  }
}
const throttlloadMembers = throttle(loadMembers, 5000);
const handleFiltersChange = (newFilters: MemberFiltersPayload) => {
  filters.value = { ...filters.value, ...newFilters }
  currentPage.value = 1
  throttlloadMembers()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const selectMember = (member: Member) => {
  selectedMember.value = member
  showMemberModal.value = true
}

const clearAllFilters = () => {
  filters.value = {
    search: '',
    role: 'all',
    skills: [],
    sortBy: 'name',
    isActive: undefined
  }
  currentPage.value = 1
  throttlloadMembers()
}

const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '未知'
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}

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

  throttlloadMembers()
})
</script>

<style scoped lang="postcss">
.members-page {
  @apply min-h-screen bg-gray-50;
}


.page-header {
  @apply text-white py-16;
}

.header-content {
  @apply flex flex-col lg:flex-row items-center justify-between gap-10;
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
  @apply flex flex-wrap gap-6 justify-center lg:justify-end;
}

.stat-card {
  @apply bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 min-w-[140px];
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

.members-loading {
  @apply flex flex-col items-center justify-center py-16;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4;
}

.loading-text {
  @apply text-gray-600;
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
  @apply mt-12 flex justify-center;
}

/* 成员详情模态框样式 */
.member-detail {
  @apply space-y-6;
}

.member-header {
  @apply flex gap-6 pb-6 border-b border-gray-200;
}

.member-avatar-large {
  @apply w-20 h-20 rounded-full object-cover border-4 border-blue-100;
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