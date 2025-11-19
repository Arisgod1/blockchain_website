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
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-orange-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
        
        <!-- 中心区域 -->
        <div 
          class="absolute inset-0 flex items-center justify-center cursor-pointer group transition-all duration-500 hover:scale-105"
          @click="handleCenterClick"
          @mouseenter="isCenterActive = true"
          @mouseleave="isCenterActive = false"
        >
          <!-- 中心装饰环 -->
          <div class="absolute inset-0 rounded-full border-2 border-white/30 animate-spin-slow pointer-events-none">
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
            <p class="text-xs text-gray-300 max-w-[12rem] mx-auto">{{ centerData.description }}</p>
            
            <!-- 统计数据 -->
           
          </div>
        </div>

        <!-- 轮盘导航项 -->
        <div 
          v-for="item in navigationItems" 
            :key="item.id"
            class="absolute inset-0 transform transition-all duration-700 ease-out"
            :style="getItemStyle(item)"
        >
          <!-- 导航项背景 -->
          <div 
            class="absolute w-20 h-20 rounded-full cursor-pointer transform -translate-x-10 -translate-y-10 transition-all duration-300 hover:scale-110 group"
            :class="[item.gradient, { 'ring-4 ring-white/50': activeSector === item.id }]"
            @click="navigateToSector(item.link, item)"
            @mouseenter="handleSectorHover(item.id, true, item, $event)"
            @mouseleave="handleSectorHover(item.id, false, item, $event)"
            style="z-index: 10;"
          >
            <!-- 背景光晕 -->
            <div class="absolute inset-0 bg-white/20 rounded-full blur-sm group-hover:bg-white/40 transition-all duration-300"></div>
            
            <!-- 图标 -->
            <div class="relative z-10 flex items-center justify-center h-full text-2xl">
              {{ item.icon }}
            </div>
            
            <!-- 悬浮信息卡片：改为页面级 Teleport 实现（见文档底部） -->
          </div>
          
          <!-- 扇形连接线 -->
          <div v-if="activeSector === item.id" class="absolute inset-0 pointer-events-none">
            <div 
              class="absolute w-0.5 bg-gradient-to-t from-white/60 to-transparent"
              :style="getConnectionLineStyle(item)"
            ></div>
          </div>
        </div>
        
        <!-- 自动播放控制按钮（已移动到父容器外层以避免被轮盘 transform 影响） -->
        <!-- 按钮已移至父容器外层插入（见下方） -->
      </div>
    </div>

    <!-- 页面级悬浮弹窗（Teleport） -->
    <Teleport to="body">
      <Transition name="sector-detail">
        <div
          v-if="hoverPopup.visible && hoverPopup.item"
          class="fixed z-50 px-4 py-3 bg-black/90 rounded-xl text-white text-xs backdrop-blur-md border border-white/20 shadow-2xl min-w-[200px]"
          :style="{ left: hoverPopup.x + 'px', top: (hoverPopup.y + 18) + 'px', transform: 'translateX(-50%)' }"
          @mouseenter="handleSectorHover(hoverPopup.item.id, true, hoverPopup.item, $event)"
          @mouseleave="handleSectorHover(hoverPopup.item.id, false, hoverPopup.item, $event)"
        >
          <div class="text-center">
            <div class="font-bold text-lg mb-1">{{ hoverPopup.item.title }}</div>
            <div class="text-gray-300 text-sm mb-2">{{ hoverPopup.item.subtitle }}</div>
            <div class="text-gray-400 text-xs mb-3">{{ hoverPopup.item.description }}</div>

            <div v-if="getSectorStats(hoverPopup.item.id).length" class="flex justify-center gap-4 mb-3">
              <div v-for="stat in getSectorStats(hoverPopup.item.id)" :key="stat.label" class="text-center">
                <div class="font-bold text-sm" :style="{ color: hoverPopup.item.colorLight }">{{ stat.value }}</div>
                <div class="text-gray-400 text-xs">{{ stat.label }}</div>
              </div>
            </div>

            <div class="flex items-center justify-center gap-2 text-xs">
              <span :style="{ color: hoverPopup.item.colorLight }">点击进入</span>
              <div class="w-4 h-0.5" :style="{ backgroundColor: hoverPopup.item.colorLight }"></div>
              <div class="w-1 h-1 rounded-full animate-pulse" :style="{ backgroundColor: hoverPopup.item.colorLight }"></div>
            </div>
          </div>

          <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-t border-white/20"></div>
        </div>
      </Transition>
    </Teleport>

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
import { ref, onMounted, onUnmounted } from 'vue'
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
  description: "探索无限可能",
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
  Array.from({ length: 50 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2
  }))
)

// 计算导航项的样式
function getItemStyle(item: NavigationItem) {
  const radius = 140
  const angle = item.angle - 90 // 调整起始角度
  const x = Math.cos((angle * Math.PI) / 180) * radius+190
  const y = Math.sin((angle * Math.PI) / 180) * radius+190
  
  const isActive = activeItem.value === item.id
  
  return {
    transform: `translate(${x}px, ${y}px)`,
    // 提高默认 z-index，避免被中心装饰层遮挡
    zIndex: isActive ? 999 : 50 + (item.priority || 0),
  }
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
let hoverTimeout: number | null = null

// 悬浮弹窗（Teleport 定位）
const hoverPopup = ref<{ visible: boolean; x: number; y: number; item: NavigationItem | null }>({ visible: false, x: 0, y: 0, item: null })

function handleSectorHover(id: string, isHovering: boolean, sector: NavigationItem, ev?: MouseEvent) {
  // 清除之前的延迟隐藏定时器
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }

  if (isHovering) {
    hoveredSector.value = id
    activeSector.value = id
    hoverPopup.value.visible = true
    hoverPopup.value.item = sector
    hoverPopup.value.x = ev ? ev.clientX : 0
    hoverPopup.value.y = ev ? ev.clientY : 0
  } else {
    // 延迟隐藏，给用户时间移动到浮窗卡片
    hoverTimeout = window.setTimeout(() => {
      hoveredSector.value = null
      activeSector.value = null
      if (hoverPopup.value) {
        hoverPopup.value.visible = false
        hoverPopup.value.item = null
      }
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

let autoPlayInterval: number | null = null

function startAutoPlay() {
  stopAutoPlay()
  autoPlayInterval = window.setInterval(() => {
    currentRotation.value += rotationSpeed.value
    
    // 自动高亮下一个导航项
    const nextIndex = (currentIndex.value + 1) % navigationItems.value.length
    activeSector.value = navigationItems.value[nextIndex].id
    currentIndex.value = nextIndex
    
  }, 3000)
}

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval as number)
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

/* 粒子样式采用在数据创建时直接计算，不再使用单独函数 */
</script>

<style scoped>
/* 自定义动画 */
.linbo{
  animation: lunbo 5s linear infinite;
}
@keyframes spin-slow {
  0% {
    transform: rotate(0deg) translateY(0px);
    opacity: 0.2;
  }
  50% {
    transform: rotate(180deg) translateY(-10px);
    opacity: 0.8;
  }
  100% {
    transform: rotate(360deg) translateY(0px);
    opacity: 0.2;
  }
}

/* 自定义慢速旋转动画工具类（用于 template 中的 animate-spin-slow） */
.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
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
    @apply w-16 h-16 -translate-x-8 translate-y-8;
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