<template>
  <section class="wheel-navigation relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <!-- 背景粒子效果 -->
    <div class="absolute inset-0 overflow-hidden">
      <div 
        v-for="(particle, index) in particles" 
        :key="index"
        class="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
        :style="{
          left: particle.left + '%',
          top: particle.top + '%',
          animationDelay: particle.delay + 's',
          animationDuration: particle.duration + 's'
        }"
      ></div>
    </div>

    <!-- 主要容器 -->
    <div class="absolute inset-0 flex items-center justify-center">
      <!-- 轮盘容器 -->
      <div class="relative w-96 h-96">
        <!-- 背景光晕 -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-orange-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        
        <!-- 中心区域 -->
        <div 
          class="absolute inset-0 flex items-center justify-center cursor-pointer group transition-all duration-500 hover:scale-105"
          @click="handleCenterClick"
          @mouseenter="isCenterActive = true"
          @mouseleave="isCenterActive = false"
        >
          <!-- 中心装饰环 -->
          <div class="absolute inset-0 rounded-full border-2 border-white/30 animate-spin-slow">
            <div class="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"></div>
            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full"></div>
          </div>
          
          <!-- 中心内容 -->
          <div class="relative z-10 text-center transition-all duration-300">
            <div class="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
              🔗
            </div>
            <h1 class="text-2xl font-bold text-white mb-1">区块链组</h1>
            <p class="text-sm text-blue-200 mb-2">Blockchain Research Group</p>
            <p class="text-xs text-gray-300 max-w-32">{{ centerData.description }}</p>
            
            <!-- 统计数据 -->
            <div v-show="isCenterActive" class="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div class="text-center">
                <div class="text-lg font-bold text-blue-300">{{ centerData.stats.members }}</div>
                <div class="text-gray-400">成员</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-orange-300">{{ centerData.stats.projects }}</div>
                <div class="text-gray-400">项目</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-green-300">{{ centerData.stats.articles }}</div>
                <div class="text-gray-400">文章</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-purple-300">{{ centerData.stats.meetings }}</div>
                <div class="text-gray-400">例会</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 轮盘导航项 -->
        <div 
          v-for="(item, index) in navigationItems" 
          :key="item.id"
          class="absolute inset-0 transform transition-all duration-700 ease-out"
          :style="getItemStyle(item, index)"
        >
          <!-- 导航项背景 -->
          <div 
            class="absolute w-20 h-20 rounded-full cursor-pointer transform -translate-x-10 -translate-y-10 transition-all duration-300 hover:scale-110 group"
            :class="[item.gradient, { 'ring-4 ring-white/50': activeSector === item.id }]"
            @click="navigateToSector(item.link, item)"
            @mouseenter="handleSectorHover(item.id, true, item)"
            @mouseleave="handleSectorHover(item.id, false, item)"
            style="z-index: 10;"
          >
            <!-- 背景光晕 -->
            <div class="absolute inset-0 bg-white/20 rounded-full blur-sm group-hover:bg-white/40 transition-all duration-300"></div>
            
            <!-- 图标 -->
            <div class="relative z-10 flex items-center justify-center h-full text-2xl">
              {{ item.icon }}
            </div>
            
            <!-- 悬浮信息卡片 -->
            <Transition name="sector-detail">
              <div 
                v-if="hoveredSector === item.id"
                class="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-4 py-3 bg-black/90 rounded-xl text-white text-xs backdrop-blur-md border border-white/20 shadow-2xl transition-all duration-300 min-w-[200px] z-[100]"
                @mouseenter="handleSectorHover(item.id, true, item)"
                @mouseleave="handleSectorHover(item.id, false, item)"
                style="pointer-events: auto;"
              >
                <div class="text-center">
                  <div class="font-bold text-lg mb-1">{{ item.title }}</div>
                  <div class="text-gray-300 text-sm mb-2">{{ item.subtitle }}</div>
                  <div class="text-gray-400 text-xs mb-3">{{ item.description }}</div>
                  
                  <!-- 扇形统计 -->
                  <div v-if="getSectorStats(item.id).length" class="flex justify-center gap-4 mb-3">
                    <div v-for="stat in getSectorStats(item.id)" :key="stat.label" class="text-center">
                      <div class="font-bold text-sm" :style="{ color: item.colorLight }">{{ stat.value }}</div>
                      <div class="text-gray-400 text-xs">{{ stat.label }}</div>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-center gap-2 text-xs">
                    <span :style="{ color: item.colorLight }">点击进入</span>
                    <div class="w-4 h-0.5" :style="{ backgroundColor: item.colorLight }"></div>
                    <div class="w-1 h-1 rounded-full animate-pulse" :style="{ backgroundColor: item.colorLight }"></div>
                  </div>
                </div>
                
                <!-- 装饰箭头 -->
                <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-t border-white/20"></div>
              </div>
            </Transition>
          </div>
          
          <!-- 扇形连接线 -->
          <div v-if="activeSector === item.id" class="absolute inset-0 pointer-events-none">
            <div 
              class="absolute w-0.5 bg-gradient-to-t from-white/60 to-transparent"
              :style="getConnectionLineStyle(item)"
            ></div>
          </div>
        </div>
        
        <!-- 自动播放控制按钮 -->
        <div class="absolute top-4 right-4 flex gap-2">
          <button 
            @click="navigatePrev"
            class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
            title="上一个"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button 
            @click="toggleAutoPlay"
            class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
            :class="{ 'bg-blue-500/30': isPlaying }"
            :title="isPlaying ? '暂停自动播放' : '开始自动播放'"
          >
            <svg v-if="!isPlaying" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          </button>
          
          <button 
            @click="navigateNext"
            class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
            title="下一个"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 底部提示信息 -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
      <p class="text-gray-400 text-sm mb-2">{{ footerMessage }}</p>
      <div class="flex items-center justify-center gap-4 text-xs text-gray-500">
        <span class="flex items-center gap-1">
          <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          点击导航
        </span>
        <span class="flex items-center gap-1">
          <div class="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          悬停查看
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

interface NavigationItem {
  id: string
  title: string
  subtitle: string
  icon: string
  color: string
  colorLight: string
  colorDark: string
  gradient: string
  bgGradient: string
  description: string
  link: string
  angle: number
  size: string
  priority: number
}

interface CenterData {
  title: string
  subtitle: string
  icon: string
  description: string
  bgGradient: string
  stats: {
    members: number
    projects: number
    articles: number
    meetings: number
  }
}

const router = useRouter()
const isCenterActive = ref(false)
const activeItem = ref<string | null>(null)
const hoveredSector = ref<string | null>(null)
const activeSector = ref<string | null>(null)
const isAutoPlay = ref(false)
const isPlaying = ref(false)
const currentRotation = ref(0)
const rotationSpeed = ref(0.5)

// 导航数据
const navigationItems = ref<NavigationItem[]>([
  {
    id: 'about',
    title: "关于我们",
    subtitle: "了解区块链组",
    icon: "👥",
    color: "#2563EB",
    colorLight: "#3B82F6",
    colorDark: "#1E40AF",
    gradient: "from-blue-600 to-blue-400",
    bgGradient: "bg-gradient-to-br from-blue-600/20 to-blue-400/20",
    description: "我们的使命、愿景和价值观",
    link: "/about",
    angle: 0,
    size: "large",
    priority: 1
  },
  {
    id: 'members',
    title: "成员介绍", 
    subtitle: "认识团队成员",
    icon: "👨‍💻",
    color: "#F59E0B",
    colorLight: "#FBB040",
    colorDark: "#D97706",
    gradient: "from-orange-600 to-orange-400",
    bgGradient: "bg-gradient-to-br from-orange-600/20 to-orange-400/20",
    description: "技术专家和区块链爱好者",
    link: "/members",
    angle: 60,
    size: "medium",
    priority: 2
  },
  {
    id: 'projects',
    title: "项目展示",
    subtitle: "探索我们的项目",
    icon: "📊",
    color: "#2563EB",
    colorLight: "#3B82F6",
    colorDark: "#1E40AF",
    gradient: "from-blue-600 to-blue-400",
    bgGradient: "bg-gradient-to-br from-blue-600/20 to-blue-400/20",
    description: "区块链应用和创新项目",
    link: "/projects",
    angle: 120,
    size: "large",
    priority: 1
  },
  {
    id: 'blog',
    title: "学术博客",
    subtitle: "技术文章分享",
    icon: "📚",
    color: "#10B981",
    colorLight: "#34D399",
    colorDark: "#059669",
    gradient: "from-green-600 to-green-400",
    bgGradient: "bg-gradient-to-br from-green-600/20 to-green-400/20",
    description: "最新技术洞察和研究",
    link: "/blog",
    angle: 180,
    size: "medium",
    priority: 2
  },
  {
    id: 'meetings',
    title: "例会记录",
    subtitle: "团队会议纪要",
    icon: "📝",
    color: "#F59E0B",
    colorLight: "#FBB040",
    colorDark: "#D97706",
    gradient: "from-orange-600 to-orange-400",
    bgGradient: "bg-gradient-to-br from-orange-600/20 to-orange-400/20",
    description: "团队讨论和学习记录",
    link: "/meetings",
    angle: 240,
    size: "small",
    priority: 3
  },
  {
    id: 'contact',
    title: "联系我们",
    subtitle: "加入或合作",
    icon: "📧",
    color: "#8B5CF6",
    colorLight: "#A78BFA",
    colorDark: "#7C3AED",
    gradient: "from-purple-600 to-purple-400",
    bgGradient: "bg-gradient-to-br from-purple-600/20 to-purple-400/20",
    description: "联系方式和合作机会",
    link: "/contact",
    angle: 300,
    size: "medium",
    priority: 2
  }
])

const centerData = ref<CenterData>({
  title: "区块链组",
  subtitle: "Blockchain Research Group",
  icon: "🔗",
  description: "探索区块链技术的无限可能",
  bgGradient: "linear-gradient(135deg, #2563EB 0%, #F59E0B 100%)",
  stats: {
    members: 28,
    projects: 15,
    articles: 42,
    meetings: 120
  }
})

const footerMessage = ref("欢迎来到大连理工大学区块链组官方网站")
const currentIndex = ref(0)

// 粒子效果数据
const particles = ref(
  Array.from({ length: 50 }, (_, i) => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2
  }))
)

// 计算导航项的样式
function getItemStyle(item: NavigationItem, index: number) {
  const radius = 140
  const angle = item.angle - 90 // 调整起始角度
  const x = Math.cos((angle * Math.PI) / 180) * radius
  const y = Math.sin((angle * Math.PI) / 180) * radius
  
  const isActive = activeItem.value === item.id
  
  return {
    transform: `translate(${x}px, ${y}px)`,
    zIndex: isActive ? 20 : item.priority,
  }
}

// 导航到指定页面
function navigateTo(path: string) {
  router.push(path)
}

// 处理中心区域点击
function handleCenterClick() {
  // 可以添加回到首页或显示更多信息的功能
  footerMessage.value = "正在探索区块链的奥秘..."
  setTimeout(() => {
    footerMessage.value = "欢迎来到大连理工大学区块链组官方网站"
  }, 3000)
}

// 键盘导航支持
function handleKeydown(event: KeyboardEvent) {
  const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' ']
  if (keys.includes(event.key)) {
    event.preventDefault()
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        navigatePrev()
        break
      case 'ArrowRight':
      case 'ArrowDown':
        navigateNext()
        break
      case 'Enter':
        activateCurrentSector()
        break
      case ' ':
        toggleAutoPlay()
        break
    }
  }
}

// 扇形悬浮处理
let hoverTimeout: NodeJS.Timeout | null = null

function handleSectorHover(id: string, isHovering: boolean, sector: NavigationItem) {
  // 清除之前的延迟隐藏定时器
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  
  if (isHovering) {
    hoveredSector.value = id
    activeSector.value = id
  } else {
    // 延迟隐藏，给用户时间移动到浮窗卡片
    hoverTimeout = setTimeout(() => {
      hoveredSector.value = null
      activeSector.value = null
    }, 150)
  }
}

// 导航到扇形
function navigateToSector(path: string, sector: NavigationItem) {
  activeSector.value = sector.id
  footerMessage.value = `正在进入${sector.title}...`
  
  setTimeout(() => {
    router.push(path)
    setTimeout(() => {
      footerMessage.value = "欢迎来到大连理工大学区块链组官方网站"
    }, 1000)
  }, 500)
}

// 自动播放功能
function toggleAutoPlay() {
  isAutoPlay.value = !isAutoPlay.value
  isPlaying.value = isAutoPlay.value
  
  if (isPlaying.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}

let autoPlayInterval: NodeJS.Timeout | null = null

function startAutoPlay() {
  stopAutoPlay()
  autoPlayInterval = setInterval(() => {
    currentRotation.value += rotationSpeed.value
    
    // 自动高亮下一个导航项
    const nextIndex = (currentIndex.value + 1) % navigationItems.value.length
    activeSector.value = navigationItems.value[nextIndex].id
    currentIndex.value = nextIndex
    
  }, 3000)
}

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

// 手动导航
function navigateNext() {
  const nextIndex = (currentIndex.value + 1) % navigationItems.value.length
  currentIndex.value = nextIndex
  activeSector.value = navigationItems.value[nextIndex].id
}

function navigatePrev() {
  const prevIndex = currentIndex.value === 0 ? navigationItems.value.length - 1 : currentIndex.value - 1
  currentIndex.value = prevIndex
  activeSector.value = navigationItems.value[prevIndex].id
}

function activateCurrentSector() {
  const currentSector = navigationItems.value[currentIndex.value]
  if (currentSector) {
    navigateToSector(currentSector.link, currentSector)
  }
}

// 获取统计标签
function getStatLabel(key: string): string {
  const labels: Record<string, string> = {
    members: '成员',
    projects: '项目',
    articles: '文章',
    meetings: '例会'
  }
  return labels[key] || key
}

// 获取扇形统计
function getSectorStats(id: string) {
  const stats: Record<string, Array<{ value: string; label: string }>> = {
    'about': [
      { value: '2019', label: '成立' },
      { value: '100+', label: '研究论文' }
    ],
    'members': [
      { value: '28', label: '成员' },
      { value: '5', label: '研究方向' }
    ],
    'projects': [
      { value: '15', label: '项目' },
      { value: '8', label: '开源' }
    ],
    'blog': [
      { value: '42', label: '文章' },
      { value: '10k+', label: '阅读' }
    ],
    'meetings': [
      { value: '120', label: '例会' },
      { value: '95%', label: '出席率' }
    ],
    'contact': [
      { value: '24/7', label: '在线' },
      { value: '∞', label: '合作可能' }
    ]
  }
  return stats[id] || []
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  stopAutoPlay()
})

// 获取连接线样式
function getConnectionLineStyle(item: NavigationItem) {
  const radius = 140
  const angle = item.angle - 90
  const x = Math.cos((angle * Math.PI) / 180) * radius
  const y = Math.sin((angle * Math.PI) / 180) * radius
  
  const length = Math.sqrt(x * x + y * y)
  
  return {
    height: `${length}px`,
    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
    transformOrigin: '0 0'
  }
}

// 获取粒子样式
function getParticleStyle(index: number) {
  const angle = (index * 360) / 50
  const radius = 200 + Math.random() * 100
  const x = Math.cos((angle * Math.PI) / 180) * radius
  const y = Math.sin((angle * Math.PI) / 180) * radius
  
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${2 + Math.random() * 3}s`
  }
}
</script>

<style scoped>
/* 自定义动画 */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

/* 粒子动画 */
.wheel-particle {
  animation: particleFloat 6s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    opacity: 0.2;
    transform: translateY(0px);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-20px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .wheel-container {
    @apply w-80 h-80;
  }
  
  .center-content h1 {
    @apply text-xl;
  }
  
  .center-content p {
    @apply text-xs;
  }
}

@media (max-width: 480px) {
  .wheel-container {
    @apply w-64 h-64;
  }
  
  .absolute.w-20 {
    @apply w-16 h-16 -translate-x-8 -translate-y-8;
  }
  
  .sector-detail {
    @apply text-xs;
    min-width: 150px;
  }
  
  .absolute.top-4.right-4 {
    @apply top-2 right-2;
  }
  
  .absolute.top-4.right-4 button {
    @apply w-8 h-8;
  }
}

/* 悬浮卡片动画 */
.sector-detail-enter-active,
.sector-detail-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sector-detail-enter-from,
.sector-detail-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px) scale(0.95);
}

.sector-detail-enter-to,
.sector-detail-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}

/* 连接线动画 */
.connection-line {
  animation: connectionPulse 2s infinite ease-in-out;
}

@keyframes connectionPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scaleY(1);
  }
  50% {
    opacity: 1;
    transform: scaleY(1.1);
  }
}

/* 自动播放按钮动画 */
.animate-pulse {
  animation: buttonPulse 2s infinite;
}

@keyframes buttonPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* 轮盘旋转效果 */
.wheel-container {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 悬浮状态增强 */
.group:hover .sector-icon {
  animation: iconBounce 0.6s ease-in-out;
}

@keyframes iconBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* 统计数据动画 */
.stat-item {
  animation: statFadeIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}

.stat-item:nth-child(1) { animation-delay: 0.1s; }
.stat-item:nth-child(2) { animation-delay: 0.2s; }
.stat-item:nth-child(3) { animation-delay: 0.3s; }
.stat-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes statFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>