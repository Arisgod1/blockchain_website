<template>
  <div class="events-page">
    <!-- 页面头部 -->
    <header class="gradient-hero flowing-gradient-solstice hero-header">
      <div class="hero-inner">
        <span class="hero-eyebrow">EVENTS · 会议活动</span>
        <h1 class="hero-title">
          会议活动，
          <span class="hero-title-accent">链接前沿智慧</span>
        </h1>
        <p class="hero-subtitle">
          汇聚区块链领域的前沿洞察与行业力量，共同参与专业会议、学术研讨与行业峰会，塑造区块链的未来。
        </p>
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-icon">🗓️</div>
            <div class="hero-stat-body">
              <div class="hero-stat-value">{{ stats.totalEvents }}</div>
              <div class="hero-stat-label">年度活动</div>
            </div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-icon">👥</div>
            <div class="hero-stat-body">
              <div class="hero-stat-value">{{ stats.totalParticipants }}+</div>
              <div class="hero-stat-label">参与人次</div>
            </div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-icon">🚀</div>
            <div class="hero-stat-body">
              <div class="hero-stat-value">{{ stats.upcomingEvents }}</div>
              <div class="hero-stat-label">即将举行</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 导航标签 -->
    <nav class="bg-white shadow-sm border-b sticky top-0 z-30">
      <div class="container mx-auto px-3 sm:px-4">
        <div class="flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="py-3 sm:py-4 px-1 sm:px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8 md:py-12">
      <!-- 筛选和搜索 -->
      <section class="mb-6 md:mb-8">
        <div class="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
          <div class="w-full md:flex-1 md:max-w-md">
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索活动..."
                class="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
          </div>

          <div class="grid grid-cols-2 md:flex gap-2 md:gap-4">
            <select
              v-model="selectedCategory"
              class="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            >
              <option value="">
                全部分类
              </option>
              <option value="conference">
                区块链会议
              </option>
              <option value="seminar">
                学术研讨
              </option>
              <option value="workshop">
                技术工作坊
              </option>
              <option value="summit">
                行业峰会
              </option>
            </select>
            
            <select
              v-model="selectedStatus"
              class="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            >
              <option value="">
                全部状态
              </option>
              <option value="upcoming">
                即将开始
              </option>
              <option value="ongoing">
                正在进行
              </option>
              <option value="completed">
                已结束
              </option>
            </select>
          </div>
        </div>
      </section>

      <!-- 活动统计 -->
      <section class="mb-6 md:mb-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div
            v-for="stat in eventTypeStats"
            :key="stat.type"
            class="bg-white rounded-lg p-4 md:p-6 shadow-sm border text-center"
          >
            <div class="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">
              {{ stat.count }}
            </div>
            <div class="text-xs md:text-sm text-gray-600">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </section>

      <!-- 活动列表 -->
      <section>
        <!-- 加载状态 -->
        <div
          v-if="isLoading"
          class="flex items-center justify-center py-12"
        >
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>

        <!-- 空状态 -->
        <div
          v-else-if="filteredEvents.length === 0"
          class="text-center py-12"
        >
          <div class="text-6xl mb-4">
            🔍
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            没有找到活动
          </h3>
          <p class="text-gray-600">
            请尝试调整筛选条件或搜索关键词
          </p>
        </div>

        <!-- 活动网格 -->
        <div
          v-else
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <div
            v-for="event in paginatedEvents"
            :key="event.id"
            class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <!-- 活动图片 -->
            <div class="relative h-40 sm:h-48 overflow-hidden">
              <img 
                :src="event.image" 
                :alt="event.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
              <div class="absolute top-4 left-4">
                <span 
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusClass(event.status)"
                >
                  {{ getStatusText(event.status) }}
                </span>
              </div>
              <div class="absolute top-4 right-4">
                <span class="px-3 py-1 bg-black/50 text-white rounded-full text-sm">
                  {{ event.category }}
                </span>
              </div>
            </div>

            <!-- 活动信息 -->
            <div class="p-4 sm:p-6">
              <div class="flex items-center text-xs sm:text-sm text-gray-500 mb-2">
                <svg
                  class="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {{ formatDate(event.date) }}
              </div>
              
              <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {{ event.title }}
              </h3>

              <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                {{ event.description }}
              </p>

              <div class="flex flex-wrap items-center gap-y-1 gap-x-3 justify-between">
                <div class="flex items-center text-xs sm:text-sm text-gray-500 min-w-0">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span class="truncate">{{ event.location }}</span>
                </div>
                <div class="flex items-center text-xs sm:text-sm text-gray-500 flex-shrink-0">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  {{ event.attendees }}人
                </div>
              </div>
              
              <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex gap-2">
                  <button 
                    class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    @click="viewEventDetails(event)"
                  >
                    查看详情
                  </button>
                  <button 
                    v-if="event.status === 'upcoming'"
                    class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    @click="registerForEvent(event)"
                  >
                    立即报名
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div
          v-if="totalPages > 1"
          class="flex justify-center mt-8 md:mt-12"
        >
          <nav class="flex flex-wrap justify-center gap-2">
            <button
              :disabled="currentPage === 1"
              class="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentPage--"
            >
              上一页
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              class="w-10 h-10 flex items-center justify-center text-sm border rounded-lg"
              :class="page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'"
              @click="currentPage = page"
            >
              {{ page }}
            </button>

            <button
              :disabled="currentPage === totalPages"
              class="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentPage++"
            >
              下一页
            </button>
          </nav>
        </div>
      </section>
    </main>

    <!-- 活动详情弹窗 -->
    <div 
      v-if="showDetailModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="closeDetailModal"
    >
      <div 
        class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="relative">
          <img
            :src="selectedEvent?.image"
            :alt="selectedEvent?.title"
            class="w-full h-48 sm:h-64 object-cover rounded-t-2xl"
          >
          <button 
            class="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
            @click="closeDetailModal"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div class="p-4 sm:p-6">
          <div class="flex items-center justify-between mb-3 sm:mb-4 gap-2">
            <span
              class="px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap"
              :class="getStatusClass(selectedEvent?.status)"
            >
              {{ getStatusText(selectedEvent?.status) }}
            </span>
            <span class="text-xs sm:text-sm text-gray-500 truncate">{{ selectedEvent?.category }}</span>
          </div>

          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            {{ selectedEvent?.title }}
          </h2>
          
          <div class="space-y-4 mb-6">
            <div class="flex items-center text-gray-600">
              <svg
                class="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {{ formatDate(selectedEvent?.date) }}
            </div>
            
            <div class="flex items-center text-gray-600">
              <svg
                class="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {{ selectedEvent?.location }}
            </div>
            
            <div class="flex items-center text-gray-600">
              <svg
                class="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ selectedEvent?.duration }}
            </div>
            
            <div class="flex items-center text-gray-600">
              <svg
                class="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              {{ selectedEvent?.attendees }}人已报名
            </div>
          </div>
          
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2">
              活动详情
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ selectedEvent?.description }}
            </p>
          </div>
          
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2">
              活动亮点
            </h3>
            <ul class="text-gray-600 space-y-1">
              <li
                v-for="highlight in selectedEvent?.highlights"
                :key="highlight"
                class="flex items-start"
              >
                <span class="text-blue-500 mr-2">•</span>
                {{ highlight }}
              </li>
            </ul>
          </div>
          
          <div class="flex gap-4">
            <button 
              v-if="selectedEvent?.status === 'upcoming'"
              class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              @click="registerForEvent(selectedEvent)"
            >
              立即报名
            </button>
            <button 
              class="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              @click="shareEvent"
            >
              分享活动
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 报名成功提示 -->
    <div 
      v-if="showRegistrationSuccess"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showRegistrationSuccess = false"
    >
      <div 
        class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
        @click.stop
      >
        <div class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          报名成功！
        </h3>
        <p class="text-gray-600 mb-6">
          您已成功报名该活动，我们将通过邮件发送详细信息。
        </p>
        <button 
          class="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          @click="showRegistrationSuccess = false"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

type EventCategory = 'conference' | 'seminar' | 'workshop' | 'summit'
type EventStatus = 'upcoming' | 'ongoing' | 'completed'

interface EventDetail {
  id: string
  title: string
  description: string
  date: string
  location: string
  category: EventCategory
  status: EventStatus
  duration: string
  attendees: number
  image: string
  highlights: string[]
}

// 页面元数据设置
onMounted(() => {
  document.title = '会议活动 - 大连理工大学区块链组'
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', '参与区块链领域的专业会议、学术研讨和行业峰会，与业界专家共同探讨技术革新')
  } else {
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = '参与区块链领域的专业会议、学术研讨和行业峰会，与业界专家共同探讨技术革新'
    document.head.appendChild(meta)
  }
})

// 响应式数据
const activeTab = ref('all')
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(9)
const isLoading = ref(false)
const showDetailModal = ref(false)
const showRegistrationSuccess = ref(false)
const selectedEvent = ref<EventDetail | null>(null)

// 导航标签
const tabs = [
  { id: 'all', name: '全部活动' },
  { id: 'upcoming', name: '即将开始' },
  { id: 'ongoing', name: '正在进行' },
  { id: 'completed', name: '已结束' }
]

// 活动数据
const events = ref<EventDetail[]>([
  {
    id: '1',
    title: '2025年全球区块链技术峰会',
    description: '汇聚全球顶级区块链专家，共同探讨分布式账本、DeFi、NFT等前沿技术的最新发展与应用。',
    date: '2025-03-15T09:00:00',
    location: '北京国际会议中心',
    category: 'summit',
    status: 'upcoming',
    duration: '全天',
    attendees: 1500,
    image: '/images/blockchain-summit.jpg',
    highlights: [
      '50+国际顶级专家演讲',
      '最新技术趋势发布',
      '商业合作机会对接',
      '行业权威奖项颁发'
    ]
  },
  {
    id: '2',
    title: '智能合约安全研讨会',
    description: '深入探讨智能合约的安全漏洞、审计方法和最佳实践，提升区块链应用的安全性。',
    date: '2025-02-20T14:00:00',
    location: '大连理工大学学术报告厅',
    category: 'workshop',
    status: 'upcoming',
    duration: '3小时',
    attendees: 200,
    image: '/images/smart-contract.jpg',
    highlights: [
      '实战案例分析',
      '安全审计工具演示',
      '专家答疑环节',
      '结业证书颁发'
    ]
  },
  {
    id: '3',
    title: 'DeFi生态系统创新论坛',
    description: '聚焦去中心化金融的创新发展，探讨流动性挖矿、跨链桥接、Layer2扩容等核心技术。',
    date: '2025-01-25T10:00:00',
    location: '上海陆家嘴金融中心',
    category: 'conference',
    status: 'completed',
    duration: '8小时',
    attendees: 800,
    image: '/images/defi-forum.jpg',
    highlights: [
      '头部DeFi项目展示',
      '技术架构深度解析',
      '投资机会分享',
      '行业白皮书发布'
    ]
  },
  {
    id: '4',
    title: 'NFT艺术创作工作坊',
    description: '学习NFT创作和发行全流程，包括艺术作品制作、智能合约部署、市场营销策略等。',
    date: '2025-02-10T13:00:00',
    location: '深圳南山区科技园',
    category: 'workshop',
    status: 'upcoming',
    duration: '4小时',
    attendees: 100,
    image: '/images/nft-workshop.jpg',
    highlights: [
      '艺术家现场指导',
      '创作工具实操训练',
      '作品展示与点评',
      '版权保护讲座'
    ]
  },
  {
    id: '5',
    title: '区块链学术年会',
    description: '学术界年度盛会，分享最新研究成果，探讨区块链理论创新和跨学科应用。',
    date: '2024-12-15T09:30:00',
    location: '清华大学学术交流中心',
    category: 'seminar',
    status: 'completed',
    duration: '2天',
    attendees: 500,
    image: '/images/academic-conference.jpg',
    highlights: [
      '顶级论文发表',
      '学术合作签约',
      '青年学者奖评选',
      '未来研究展望'
    ]
  },
  {
    id: '6',
    title: '跨链技术开发大会',
    description: '聚焦跨链技术的最新进展，包括多链互操作性、资产跨链转移、消息传递机制等。',
    date: '2025-04-10T09:00:00',
    location: '杭州西湖国际博览中心',
    category: 'conference',
    status: 'upcoming',
    duration: '2天',
    attendees: 600,
    image: '/images/cross-chain.jpg',
    highlights: [
      '主流跨链项目展示',
      '技术路线图发布',
      '开发者技能培训',
      '生态合作签约'
    ]
  }
])

// 计算属性
const filteredEvents = computed(() => {
  let filtered = events.value

  // 按标签筛选
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(event => event.status === activeTab.value)
  }

  // 按类别筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(event => event.category === selectedCategory.value)
  }

  // 按状态筛选
  if (selectedStatus.value) {
    filtered = filtered.filter(event => event.status === selectedStatus.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    )
  }

  return filtered
})

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredEvents.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / itemsPerPage.value)
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

const stats = computed(() => {
  const totalEvents = events.value.length
  const upcomingEvents = events.value.filter(e => e.status === 'upcoming').length
  const totalParticipants = events.value.reduce((sum, event) => sum + event.attendees, 0)
  
  return {
    totalEvents,
    upcomingEvents,
    totalParticipants: Math.round(totalParticipants / 1000) // 转换为K
  }
})

const eventTypeStats = computed(() => {
  const categories: Record<EventCategory, { label: string; count: number }> = {
    conference: { label: '区块链会议', count: 0 },
    seminar: { label: '学术研讨', count: 0 },
    workshop: { label: '技术工作坊', count: 0 },
    summit: { label: '行业峰会', count: 0 }
  }

  events.value.forEach(event => {
    if (categories[event.category]) {
      categories[event.category].count++
    }
  })

  return Object.entries(categories).map(([type, data]) => ({
    type,
    ...data
  }))
})

// 方法
const formatDate = (dateString?: string) => {
  if (!dateString) return '待定'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status?: EventStatus) => {
  const classes: Record<EventStatus, string> = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800'
  }
  if (!status) return 'bg-gray-100 text-gray-800'
  return classes[status]
}

const getStatusText = (status?: EventStatus) => {
  const texts: Record<EventStatus, string> = {
    upcoming: '即将开始',
    ongoing: '正在进行',
    completed: '已结束'
  }
  if (!status) return '未知'
  return texts[status]
}

const viewEventDetails = (event: EventDetail) => {
  selectedEvent.value = event
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedEvent.value = null
}

const registerForEvent = (event: EventDetail) => {
  // 模拟报名
  showDetailModal.value = false
  showRegistrationSuccess.value = true
  
  // 更新参会人数
  const eventIndex = events.value.findIndex(e => e.id === event.id)
  if (eventIndex !== -1) {
    events.value[eventIndex].attendees += 1
  }
}

const shareEvent = () => {
  if (navigator.share && selectedEvent.value) {
    navigator.share({
      title: selectedEvent.value.title,
      text: selectedEvent.value.description,
      url: window.location.href
    })
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}

// 生命周期
onMounted(() => {
  isLoading.value = true
  // 模拟加载
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style scoped>
.events-page {
  min-height: 100vh;
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>