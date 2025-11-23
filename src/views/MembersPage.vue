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

interface MemberFiltersState {
  search: string
  role: string
  skills: string[]
  sortBy: string
  isActive?: boolean
}

type MemberFiltersPayload = Partial<MemberFiltersState>

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

// 模拟成员数据
const mockMembers: Member[] = [
  {
    id: '1',
    name: '张同学',
    role: '组长',
    avatar: '/images/avatars/zhang.jpg',
    grade: '研二',
    major: '计算机科学与技术',
    skills: ['Solidity', 'Web3.js', 'React', 'DeFi'],
    bio: '专注于智能合约开发和DeFi应用研究，有丰富的以太坊开发经验',
    github: 'https://github.com/zhang',
    email: 'zhang@example.com',
    joinDate: '2023-09-01',
    isActive: true,
    projectCount: 8
  },
  {
    id: '2',
    name: '李同学',
    role: '技术负责人',
    avatar: '/images/avatars/li.jpg',
    grade: '大三',
    major: '软件工程',
    skills: ['Python', 'Django', '区块链底层', '共识算法'],
    bio: '区块链底层技术研究者，熟悉多种共识算法和P2P网络协议',
    github: 'https://github.com/li',
    email: 'li@example.com',
    joinDate: '2023-03-01',
    isActive: true,
    projectCount: 12
  },
  {
    id: '3',
    name: '王同学',
    role: '前端开发',
    avatar: '/images/avatars/wang.jpg',
    grade: '大二',
    major: '数字媒体技术',
    skills: ['Vue.js', 'CSS', 'UI设计', 'Three.js'],
    bio: '热爱前端开发和用户体验设计，专注于3D可视化界面开发',
    github: 'https://github.com/wang',
    email: 'wang@example.com',
    joinDate: '2024-03-01',
    isActive: true,
    projectCount: 5
  }
]

// 扩展到28位成员
const allMembers = ref<Member[]>([
  ...mockMembers,
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `${i + 4}`,
    name: `成员${i + 4}`,
    role: ['开发成员', '研究员', '前端开发', '后端开发'][Math.floor(Math.random() * 4)],
    avatar: `/images/avatars/member${i + 4}.jpg`,
    grade: ['大一', '大二', '大三', '大四', '研一', '研二'][Math.floor(Math.random() * 6)],
    major: ['计算机科学与技术', '软件工程', '数字媒体技术', '信息安全'][Math.floor(Math.random() * 4)],
    skills: [
      ['Vue.js', 'React', 'TypeScript'],
      ['Python', 'Django', '机器学习'],
      ['Solidity', 'Web3.js', 'DeFi'],
      ['Node.js', 'MongoDB', 'Express'],
      ['Java', 'Spring', 'MySQL'],
      ['Go', 'Docker', 'Kubernetes']
    ][Math.floor(Math.random() * 6)],
    bio: '专注于相关技术领域的研究与开发',
    github: `https://github.com/member${i + 4}`,
    email: `member${i + 4}@example.com`,
    joinDate: `202${3 + Math.floor(Math.random()  * 2)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
    isActive: Math.random() > 0.2,
    projectCount: Math.floor(Math.random() * 15) + 1
  }))
])

// 筛选相关
const filters = ref<MemberFiltersState>({
  search: '',
  role: 'all',
  skills: [] as string[],
  sortBy: 'name',
  isActive: undefined as boolean | undefined
})

// 视图模式
const viewMode = ref<'grid' | 'list'>('grid')

// 分页
const currentPage = ref(1)
const pageSize = ref(12)

// 模态框
const showMemberModal = ref(false)
const selectedMember = ref<Member | null>(null)

// 角色选项
const roleOptions = [
  { id: 'all', name: '全部成员', count: allMembers.value.length },
  { id: '组长', name: '组长', count: allMembers.value.filter(m => m.role === '组长').length },
  { id: '技术负责人', name: '技术负责人', count: allMembers.value.filter(m => m.role === '技术负责人').length },
  { id: '前端开发', name: '前端开发', count: allMembers.value.filter(m => m.role === '前端开发').length },
  { id: '后端开发', name: '后端开发', count: allMembers.value.filter(m => m.role === '后端开发').length },
  { id: '开发成员', name: '开发成员', count: allMembers.value.filter(m => m.role === '开发成员').length },
  { id: '研究员', name: '研究员', count: allMembers.value.filter(m => m.role === '研究员').length }
]

// 技术栈选项
const techStackOptions = [
  'Solidity', 'Web3.js', 'React', 'Vue.js', 'Python', 'Django',
  'Node.js', 'TypeScript', 'IPFS', 'Ethereum', 'DeFi', 'NFT',
  'Java', 'Spring', 'Go', 'Docker', 'Kubernetes', 'MongoDB'
]

// 统计数据
const totalMembers = computed(() => allMembers.value.length)
const activeMembers = computed(() => allMembers.value.filter(m => m.isActive).length)
const totalProjects = computed(() => 
  allMembers.value.reduce((sum, member) => sum + (member.projectCount || 0), 0)
)

// 是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return filters.value.search || 
         filters.value.role !== 'all' || 
         filters.value.skills.length > 0 ||
         filters.value.isActive !== undefined
})

// 过滤成员
const filteredMembers = computed(() => {
  let result = allMembers.value

  // 按搜索关键词过滤
  if (filters.value.search) {
    const query = filters.value.search.toLowerCase()
    result = result.filter(member =>
      member.name.toLowerCase().includes(query) ||
      member.skills.some(skill => skill.toLowerCase().includes(query)) ||
      member.role.toLowerCase().includes(query)
    )
  }

  // 按角色过滤
  if (filters.value.role && filters.value.role !== 'all') {
    result = result.filter(member => member.role === filters.value.role)
  }

  // 按技能过滤
  if (filters.value.skills.length > 0) {
    result = result.filter(member =>
      filters.value.skills.every(skill =>
        member.skills.some(memberSkill => 
          memberSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    )
  }

  // 按活跃状态过滤
  if (filters.value.isActive !== undefined) {
    result = result.filter(member => member.isActive === filters.value.isActive)
  }

  // 排序
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

// 分页后的成员
const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMembers.value.slice(start, end)
})

// 处理筛选变化
const handleFiltersChange = (newFilters: MemberFiltersPayload) => {
  filters.value = { ...filters.value, ...newFilters }
  currentPage.value = 1
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  // 滚动到顶部
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
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}
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