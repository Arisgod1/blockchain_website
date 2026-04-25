<template>
  <div class="mobile-nav-root">
    <!-- 浮动汉堡按钮（仅移动端显示） -->
    <button
      class="mobile-nav-toggle"
      :class="{ 'is-open': isOpen, 'is-home': isHome }"
      :aria-label="isOpen ? '关闭菜单' : '打开菜单'"
      :aria-expanded="isOpen"
      type="button"
      @click="toggle"
    >
      <span class="toggle-bar" />
      <span class="toggle-bar" />
      <span class="toggle-bar" />
    </button>

    <!-- 遮罩层 -->
    <transition name="overlay-fade">
      <div
        v-if="isOpen"
        class="mobile-nav-overlay"
        aria-hidden="true"
        @click="close"
      />
    </transition>

    <!-- 侧边抽屉 -->
    <transition name="drawer-slide">
      <aside
        v-if="isOpen"
        class="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="站点导航"
      >
        <div class="drawer-header">
          <div class="drawer-brand">
            <span class="brand-mark">DUT</span>
            <div class="brand-text">
              <strong>区块链组</strong>
              <small>Blockchain Team</small>
            </div>
          </div>
          <button
            class="drawer-close"
            type="button"
            aria-label="关闭菜单"
            @click="close"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
              />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
              />
            </svg>
          </button>
        </div>

        <nav class="drawer-nav">
          <router-link
            v-for="item in navItems"
            :key="item.route"
            :to="item.route"
            class="nav-item"
            :class="{ 'is-active': isActive(item.route) }"
            @click="close"
          >
            <span
              class="nav-item__icon"
              :style="{ color: item.color }"
            >
              {{ item.icon }}
            </span>
            <span class="nav-item__body">
              <span class="nav-item__title">{{ item.title }}</span>
              <span class="nav-item__desc">{{ item.description }}</span>
            </span>
            <span class="nav-item__arrow">›</span>
          </router-link>
        </nav>

        <div class="drawer-footer">
          <p>大连理工大学 · 区块链组</p>
          <p class="footer-sub">
            DUT Blockchain · Since 2015
          </p>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

interface NavItem {
  title: string
  description: string
  route: string
  icon: string
  color: string
}

const route = useRoute()
const isOpen = ref(false)

const navItems: NavItem[] = [
  { title: '首页', description: 'HOME · 回到主界面', route: '/', icon: '🏠', color: '#60a5fa' },
  { title: '关于我们', description: 'ABOUT · 团队使命', route: '/about', icon: '👥', color: '#38bdf8' },
  { title: '成员档案', description: 'MEMBERS · 团队成员', route: '/members', icon: '👨‍💻', color: '#f59e0b' },
  { title: '项目矩阵', description: 'PROJECTS · 科研成果', route: '/projects', icon: '🚀', color: '#818cf8' },
  { title: '知识星图', description: 'BLOG · 研究分享', route: '/blog', icon: '📚', color: '#34d399' },
  { title: '例会纪要', description: 'MEETINGS · 团队例会', route: '/meetings', icon: '📝', color: '#f97316' },
  { title: '会议活动', description: 'EVENTS · 学术峰会', route: '/events', icon: '🗓️', color: '#fbbf24' },
  { title: '联系我们', description: 'CONTACT · 合作咨询', route: '/contact', icon: '📧', color: '#c084fc' }
]

const isHome = computed(() => route.path === '/')

const isActive = (target: string) => {
  if (target === '/') return route.path === '/'
  return route.path.startsWith(target)
}

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    close()
  }
}

watch(isOpen, (opened) => {
  if (typeof document === 'undefined') return
  const body = document.body
  if (opened) {
    body.classList.add('mobile-nav-lock')
  } else {
    body.classList.remove('mobile-nav-lock')
  }
})

watch(() => route.fullPath, () => {
  if (isOpen.value) close()
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.classList.remove('mobile-nav-lock')
  }
})

defineExpose({ open, close, toggle })
</script>

<style scoped>
.mobile-nav-root {
  position: relative;
  z-index: 10000;
}

/* 默认在桌面隐藏 */
.mobile-nav-toggle {
  display: none;
}

/* 汉堡按钮 */
@media (max-width: 1024px) {
  .mobile-nav-toggle {
    position: fixed;
    top: calc(env(safe-area-inset-top, 0px) + 0.75rem);
    right: calc(env(safe-area-inset-right, 0px) + 0.75rem);
    width: 44px;
    height: 44px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0;
    border-radius: 12px;
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 24px -12px rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #f8fafc;
    z-index: 10001;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.25s ease;
  }

  .mobile-nav-toggle:active {
    transform: scale(0.95);
  }

  .mobile-nav-toggle .toggle-bar {
    width: 20px;
    height: 2px;
    border-radius: 2px;
    background: currentColor;
    transition: transform 0.25s ease, opacity 0.2s ease;
  }

  .mobile-nav-toggle.is-open .toggle-bar:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .mobile-nav-toggle.is-open .toggle-bar:nth-child(2) {
    opacity: 0;
  }

  .mobile-nav-toggle.is-open .toggle-bar:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
}

/* 遮罩 */
.mobile-nav-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.6);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 9998;
}

/* 抽屉 */
.mobile-nav-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(86vw, 340px);
  padding: calc(env(safe-area-inset-top, 0px) + 1rem) 1rem calc(env(safe-area-inset-bottom, 0px) + 1rem);
  background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
  color: #e2e8f0;
  box-shadow: -16px 0 48px -20px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 9999;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.25rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.drawer-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #3b82f6, #f97316);
  color: #fff;
  box-shadow: 0 10px 30px -16px rgba(59, 130, 246, 0.9);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-text strong {
  font-size: 1rem;
  color: #f8fafc;
}

.brand-text small {
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.85);
}

.drawer-close {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  cursor: pointer;
  transition: background 0.2s ease;
}

.drawer-close:active {
  background: rgba(255, 255, 255, 0.12);
}

.drawer-nav {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.25rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.85rem;
  border-radius: 12px;
  color: #e2e8f0;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.nav-item:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.08);
}

.nav-item.is-active {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(96, 165, 250, 0.35);
}

.nav-item__icon {
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-item__body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.nav-item__title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #f8fafc;
}

.nav-item__desc {
  margin-top: 2px;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: rgba(148, 163, 184, 0.85);
}

.nav-item__arrow {
  font-size: 1.25rem;
  color: rgba(148, 163, 184, 0.55);
}

.nav-item.is-active .nav-item__arrow {
  color: #60a5fa;
}

.drawer-footer {
  border-top: 1px solid rgba(148, 163, 184, 0.18);
  padding-top: 0.85rem;
  text-align: center;
  color: rgba(148, 163, 184, 0.85);
  font-size: 0.78rem;
}

.drawer-footer .footer-sub {
  margin-top: 0.15rem;
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(100, 116, 139, 0.75);
}

/* 过渡效果 */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.2s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .overlay-fade-enter-active,
  .overlay-fade-leave-active,
  .drawer-slide-enter-active,
  .drawer-slide-leave-active {
    transition: none;
  }
}
</style>
