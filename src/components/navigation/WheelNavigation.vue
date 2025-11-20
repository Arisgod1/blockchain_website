<template>
  <section class="wheel-navigation relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
      />
    </div>

    <div class="absolute inset-0 flex items-center justify-center">
      <div
        class="relative wheel-container"
        :style="{ width: wheelDiameter + 'px', height: wheelDiameter + 'px' }"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-orange-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div class="absolute inset-0 wheel-gradient-overlay pointer-events-none" />

        <div
          v-for="(ringScale, index) in decorativeRings"
          :key="`ring-${index}`"
          class="decorative-ring pointer-events-none"
          :style="{
            transform: `scale(${ringScale})`,
            animationDelay: `${index * 0.8}s`,
            opacity: 0.25 + index * 0.15
          }"
        />

        <div
          v-for="angle in radialMarkers"
          :key="`radial-${angle}`"
          class="radial-marker pointer-events-none"
          :style="{ transform: `rotate(${angle}deg)` }"
        />

        <div
          v-for="(orbit, index) in orbitDots"
          :key="`orbit-${index}`"
          class="orbit-scale-wrapper"
          :style="{ transform: `scale(${orbit.scale})` }"
        >
          <div
            class="orbit-path"
            :style="{
              animationDuration: orbit.duration + 's',
              animationDelay: orbit.delay + 's'
            }"
          >
            <span
              class="orbiting-dot"
              :style="{
                width: orbit.size + 'px',
                height: orbit.size + 'px',
                background: orbit.gradient,
                boxShadow: orbit.glow
              }"
            />
          </div>
        </div>

        <div
          class="absolute inset-0 flex items-center justify-center cursor-pointer group transition-all duration-500 hover:scale-105"
          @click="handleCenterClick"
        >
          <div class="absolute inset-0 rounded-full border-4 border-white/30 animate-spin-slow pointer-events-none">
            <div class="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full" />
            <div class="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full" />
          </div>

          <div class="relative z-10 text-center transition-all duration-300 center-content px-6">
            <img
              v-if="!logoLoadFailed"
              :src="logoCircle"
              alt="区块链组 LOGO"
              class="mx-auto w-40 h-40 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
              @error="logoLoadFailed = true"
            >
            <div
              v-else
              class="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300"
            >
              🔗
            </div>
            <h1 class="text-3xl font-bold text-white mb-1">
              区块链组
            </h1>
            <p class="text-base text-blue-200 mb-2">
              Blockchain Club
            </p>
            <p class="text-sm text-gray-300 max-w-[14rem] mx-auto">
              {{ centerData.description }}
            </p>
          </div>
        </div>

        <div
          v-for="item in navigationItems"
          :key="item.id"
          class="absolute pointer-events-none"
          :style="getItemStyle(item)"
        >
          <div
            class="absolute w-20 h-20 rounded-full cursor-pointer transform -translate-x-10 -translate-y-10 transition-all duration-300 hover:scale-110 group pointer-events-auto"
            :class="[item.gradient, { 'ring-4 ring-white/50': activeSector === item.id }]"
            @click="navigateToSector(item.link, item)"
            @mouseenter="handleSectorHover(item.id, true, item, $event)"
            @mouseleave="handleSectorHover(item.id, false, item, $event)"
          >
            <div class="absolute inset-0 bg-white/20 rounded-full blur-sm group-hover:bg-white/40 transition-all duration-300" />
            <div class="relative z-10 flex items-center justify-center h-full text-2xl">
              {{ item.icon }}
            </div>
          </div>

          <div
            v-if="activeSector === item.id"
            class="absolute inset-0 pointer-events-none"
          >
            <div
              class="absolute w-0.5 bg-gradient-to-t from-white/60 to-transparent"
              :style="getConnectionLineStyle(item)"
            />
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="sector-detail">
        <div
          v-if="hoverPopup.visible && hoverPopup.item"
          class="fixed z-50 px-4 py-3 bg-black/90 rounded-xl text-white text-xs backdrop-blur-md border border-white/20 shadow-2xl min-w-[200px]"
          :style="{ left: hoverPopup.x + 'px', top: hoverPopup.y + 18 + 'px', transform: 'translateX(-50%)' }"
          @mouseenter="handleSectorHover(hoverPopup.item.id, true, hoverPopup.item, $event)"
          @mouseleave="handleSectorHover(hoverPopup.item.id, false, hoverPopup.item, $event)"
        >
          <div class="text-center">
            <div class="font-bold text-lg mb-1">
              {{ hoverPopup.item.title }}
            </div>
            <div class="text-gray-300 text-sm mb-2">
              {{ hoverPopup.item.subtitle }}
            </div>
            <div class="text-gray-400 text-xs mb-3">
              {{ hoverPopup.item.description }}
            </div>

            <div
              v-if="getSectorStats(hoverPopup.item.id).length"
              class="flex justify-center gap-4 mb-3"
            >
              <div
                v-for="stat in getSectorStats(hoverPopup.item.id)"
                :key="stat.label"
                class="text-center"
              >
                <div
                  class="font-bold text-sm"
                  :style="{ color: hoverPopup.item.colorLight }"
                >
                  {{ stat.value }}
                </div>
                <div class="text-gray-400 text-xs">
                  {{ stat.label }}
                </div>
              </div>
            </div>

            <div class="flex items-center justify-center gap-2 text-xs">
              <span :style="{ color: hoverPopup.item.colorLight }">点击进入</span>
              <div class="w-4 h-0.5" :style="{ backgroundColor: hoverPopup.item.colorLight }" />
              <div class="w-1 h-1 rounded-full animate-pulse" :style="{ backgroundColor: hoverPopup.item.colorLight }" />
            </div>
          </div>

          <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-t border-white/20" />
        </div>
      </Transition>
    </Teleport>

    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
      <p class="text-gray-400 text-sm mb-2">
        {{ footerMessage }}
      </p>
      <div class="flex items-center justify-center gap-4 text-xs text-gray-500">
        <span class="flex items-center gap-1">
          <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          点击导航
        </span>
        <span class="flex items-center gap-1">
          <div class="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
          悬停查看
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import logoCircle from '@/assets/logo-circle.png'

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
const hoveredSector = ref<string | null>(null)
const activeSector = ref<string | null>(null)
const logoLoadFailed = ref(false)
const isAutoPlay = ref(false)
const isPlaying = ref(false)
const currentRotation = ref(0)
const rotationSpeed = ref(0.5)
const wheelRadius = ref(260)
const wheelDiameter = computed(() => wheelRadius.value * 2)
const orbitRadius = computed(() => Math.max(wheelRadius.value - 60, wheelRadius.value * 0.68, 120))

interface OrbitDot {
  scale: number
  size: number
  duration: number
  delay: number
  gradient: string
  glow: string
}

const decorativeRings = [0.38, 0.58, 0.78, 0.98]
const radialMarkers = Array.from({ length: 12 }, (_, idx) => idx * 30)
const orbitDots: OrbitDot[] = [
  {
    scale: 1.12,
    size: 12,
    duration: 18,
    delay: 0,
    gradient: 'linear-gradient(120deg, #60a5fa, #a855f7)',
    glow: '0 0 18px rgba(96, 165, 250, 0.8)'
  },
  {
    scale: 0.86,
    size: 9,
    duration: 13,
    delay: 1.2,
    gradient: 'linear-gradient(120deg, #f97316, #f472b6)',
    glow: '0 0 16px rgba(249, 115, 22, 0.6)'
  },
  {
    scale: 1.28,
    size: 7,
    duration: 22,
    delay: 2.6,
    gradient: 'linear-gradient(120deg, #34d399, #22d3ee)',
    glow: '0 0 14px rgba(34, 211, 238, 0.6)'
  }
]

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
  subtitle: "Blockchain Club",
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

function updateWheelRadius() {
  const width = window.innerWidth
  if (width < 640) {
    wheelRadius.value = 170
  } else if (width < 1024) {
    wheelRadius.value = 220
  } else {
    wheelRadius.value = 280
  }
}

// 计算导航项的样式
function getItemStyle(item: NavigationItem) {
  const radius = orbitRadius.value
  const angleRad = ((item.angle - 90) * Math.PI) / 180
  const x = Math.cos(angleRad) * radius
  const y = Math.sin(angleRad) * radius

  const isActive = activeSector.value === item.id

  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    zIndex: isActive ? 999 : 50 + (item.priority || 0)
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
  updateWheelRadius()
  window.addEventListener('resize', updateWheelRadius)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWheelRadius)
  document.removeEventListener('keydown', handleKeydown)
  stopAutoPlay()
})

// 获取连接线样式
function getConnectionLineStyle(item: NavigationItem) {
  const radius = orbitRadius.value
  const angle = item.angle - 90

  return {
    left: '50%',
    top: '50%',
    height: `${radius}px`,
    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
    transformOrigin: '50% 0%'
  }
}

/* 粒子样式采用在数据创建时直接计算，不再使用单独函数 */
</script>

<style scoped lang="postcss">
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

.wheel-gradient-overlay {
  background:
    radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.25), transparent 45%),
    radial-gradient(circle at 70% 70%, rgba(14, 165, 233, 0.25), transparent 55%),
    radial-gradient(circle at 25% 80%, rgba(244, 114, 182, 0.2), transparent 50%);
  filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.25));
}

.decorative-ring {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 25px rgba(14, 165, 233, 0.25);
  animation: ringPulse 6s ease-in-out infinite;
}

.radial-marker {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.radial-marker::after {
  content: '';
  position: absolute;
  top: 4%;
  left: 50%;
  width: 2px;
  height: 10%;
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0));
  border-radius: 9999px;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.25));
}

.orbit-scale-wrapper {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orbit-path {
  position: absolute;
  inset: 0;
  animation-name: orbitSpin;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.orbiting-dot {
  position: absolute;
  top: 2%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
}

@keyframes ringPulse {
  0% {
    opacity: 0.35;
    box-shadow: 0 0 25px rgba(14, 165, 233, 0.3);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 45px rgba(99, 102, 241, 0.35);
  }
  100% {
    opacity: 0.35;
    box-shadow: 0 0 25px rgba(14, 165, 233, 0.3);
  }
}

@keyframes orbitSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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