<template>
  <div class="events-page">
    <!-- 页面头部 -->
    <PublicGraphHero
      eyebrow="EVENTS · 外部连接"
      title="把团队带到"
      accent="更大的技术现场"
      subtitle="会议、研讨和工作坊是团队网络向外延展的连接点，记录我们如何参与学术交流与行业实践。"
      tone="rose"
      :stats="eventHeroStats"
    />

    <!-- 导航标签 -->
    <nav class="bg-white shadow-sm border-b sticky top-0 z-30">
      <div class="container mx-auto px-3 sm:px-4">
        <div class="flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="my-2 rounded-full px-3 py-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0"
            :class="[
              activeTab === tab.id
                ? 'bg-slate-950 text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
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
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-cyan-700" />
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
                @error="handleEventImageError"
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
                  {{ event.duration }}
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
            @error="handleEventImageError"
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
              {{ selectedEvent?.duration }}
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
              class="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              @click="shareEvent"
            >
              分享活动
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PublicGraphHero from '@/components/common/PublicGraphHero.vue'
import { getPublicEvents } from '@/api/public'
import type { PublicEvent } from '@/types/entities'
import defaultEventImage from '@/assets/BLOCKCHAINNexus.png'

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
const selectedEvent = ref<EventDetail | null>(null)

// 导航标签
const tabs = [
  { id: 'all', name: '全部活动' },
  { id: 'upcoming', name: '即将开始' },
  { id: 'ongoing', name: '正在进行' },
  { id: 'completed', name: '已结束' }
]

const events = ref<EventDetail[]>([])

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
  
  return {
    totalEvents,
    upcomingEvents,
    completedEvents: events.value.filter(e => e.status === 'completed').length
  }
})

const eventHeroStats = computed(() => [
  { label: '年度活动', value: stats.value.totalEvents },
  { label: '已结束', value: stats.value.completedEvents },
  { label: '即将举行', value: stats.value.upcomingEvents }
])

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

const mapPublicEventStatus = (status: PublicEvent['status']): EventStatus => {
  return status === 'finished' ? 'completed' : status
}

const mapPublicEventCategory = (type: string): EventCategory => {
  if (type === 'seminar' || type === 'workshop' || type === 'summit') return type
  return 'conference'
}

const formatDurationRange = (startTime: string, endTime: string) => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '时间待定'
  const minutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000))
  if (minutes === 0) return '时间待定'
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}小时${rest}分钟` : `${hours}小时`
}

const normalizePublicEvent = (event: PublicEvent): EventDetail => ({
  id: event.id,
  title: event.title,
  description: event.description,
  date: event.startTime,
  location: event.location,
  category: mapPublicEventCategory(event.type),
  status: mapPublicEventStatus(event.status),
  duration: formatDurationRange(event.startTime, event.endTime),
  image: event.banner || defaultEventImage,
  highlights: event.tags?.length ? event.tags : ['团队活动', '技术交流']
})

const handleEventImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.onerror = null
  img.src = defaultEventImage
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

const shareEvent = () => {
  if (navigator.share && selectedEvent.value) {
    void navigator.share({
      title: selectedEvent.value.title,
      text: selectedEvent.value.description,
      url: window.location.href
    })
  } else if (navigator.clipboard) {
    void navigator.clipboard.writeText(window.location.href)
  }
}

// 生命周期
onMounted(() => {
  isLoading.value = true
  getPublicEvents()
    .then((items) => {
      events.value = items.map(normalizePublicEvent)
    })
    .catch(() => {
      events.value = []
    })
    .finally(() => {
    isLoading.value = false
    })
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
