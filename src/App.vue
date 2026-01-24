<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 relative"
  >
    <!-- 全局加载动画 -->
    <LoadingSpinner
      v-if="isPageLoading"
      title="页面跳转中"
      message="正在加载新页面内容..."
      class="fixed inset-0 z-[9999]"
    />

    <!-- 应用主内容 -->
    <router-view v-slot="{ Component, route }">
      <transition
        name="page-transition"
        mode="out-in"
        @enter="onPageEnter"
        @leave="onPageLeave"
        @after-enter="onPageAfterEnter"
      >
        <component
          :is="Component"
          :key="route.path"
        />
      </transition>
    </router-view>

    <!-- 全局管理员登录弹窗 -->
    <AdminLogin
      :show="showAdminLogin"
      @update:show="showAdminLogin = $event"
      @login="handleAdminLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminHotkeyService } from './utils/adminHotkey'
import { AdminLogin } from './components/admin'
import LoadingSpinner from './components/common/LoadingSpinner.vue'
import type { AdminUser } from '@/types/entities'

interface ShowAdminLoginEventDetail {
  redirectTo?: string
}

type RouterHookHandles = {
  removeBeforeEach?: () => void
  removeAfterEach?: () => void
}

const globalWindow = window as Window & { __routerHooks?: RouterHookHandles }

const router = useRouter()

// 管理员登录状态
const showAdminLogin = ref(false)
const pendingRedirect = ref<string>('')

// 页面加载动画状态
const isPageLoading = ref(false)
const pageTransitionTimeout = ref<number | null>(null)
const pageLoadingFailSafe = ref<number | null>(null)
let removeBeforeEach: (() => void) | null = null
let removeAfterEach: (() => void) | null = null

// 关闭管理员登录弹窗
const closeAdminLogin = () => {
  showAdminLogin.value = false
  pendingRedirect.value = ''
}

// 页面过渡动画处理函数
const onPageEnter = () => {
  pageTransitionTimeout.value = window.setTimeout(() => {
    isPageLoading.value = true
  }, 100)
}

const onPageLeave = () => {
  isPageLoading.value = false
  if (pageTransitionTimeout.value) {
    clearTimeout(pageTransitionTimeout.value)
    pageTransitionTimeout.value = null
  }
  if (pageLoadingFailSafe.value) {
    clearTimeout(pageLoadingFailSafe.value)
    pageLoadingFailSafe.value = null
  }
}

const onPageAfterEnter = () => {
  isPageLoading.value = false
  if (pageTransitionTimeout.value) {
    clearTimeout(pageTransitionTimeout.value)
    pageTransitionTimeout.value = null
  }
  if (pageLoadingFailSafe.value) {
    clearTimeout(pageLoadingFailSafe.value)
    pageLoadingFailSafe.value = null
  }
}

// 监听路由变化，启动页面加载动画
const startPageLoading = () => {
  isPageLoading.value = true
  if (pageLoadingFailSafe.value) {
    clearTimeout(pageLoadingFailSafe.value)
  }
  pageLoadingFailSafe.value = window.setTimeout(() => {
    isPageLoading.value = false
  }, 8000)
}

// 停止页面加载动画
const stopPageLoading = () => {
  isPageLoading.value = false
  if (pageLoadingFailSafe.value) {
    clearTimeout(pageLoadingFailSafe.value)
    pageLoadingFailSafe.value = null
  }
}

// 处理管理员登录成功
const handleAdminLoginSuccess = async (adminUser: AdminUser) => {
  localStorage.setItem('adminToken', 'admin_logged_in')
  localStorage.setItem('admin-user', JSON.stringify(adminUser))

  const redirectTo = pendingRedirect.value || '/admin'
  pendingRedirect.value = ''

  closeAdminLogin()
  alert('✅ 登录成功！即将跳转到管理员后台...')
  await router.push(redirectTo)
}

// 监听管理员快捷键事件
const handleAdminHotkey = (event: CustomEvent<ShowAdminLoginEventDetail>) => {
  showAdminLogin.value = true
  pendingRedirect.value = event.detail?.redirectTo || ''
}

// 监听全局showAdminLogin事件
const handleShowAdminLoginEvent = (event: CustomEvent<ShowAdminLoginEventDetail>) => {
  showAdminLogin.value = true
  pendingRedirect.value = event.detail?.redirectTo || ''
}

// 监听管理员退出事件
const handleAdminExitEvent = async () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('admin-user')
  alert('✅ 已成功退出管理员模式')
  try {
    await router.push('/')
  } catch (error) {
    console.error('跳转首页失败:', error)
  }
}

// 启动管理员快捷键监听
const startAdminHotkeyListening = () => {
  adminHotkeyService.startListening((event) => {
    if (event.type === 'trigger') {
      showAdminLogin.value = true
    }
  })
}

onMounted(() => {
  window.addEventListener('admin-hotkey-trigger', handleAdminHotkey as EventListener)
  window.addEventListener('showAdminLogin', handleShowAdminLoginEvent as EventListener)
  window.addEventListener('admin-exit', handleAdminExitEvent)

  removeBeforeEach = router.beforeEach((to, from) => {
    console.log(`🔄 路由变化: ${from.path} -> ${to.path}`)
    startPageLoading()
  })

  removeAfterEach = router.afterEach(() => {
    stopPageLoading()
  })

  router.onError(() => {
    stopPageLoading()
  })

  globalWindow.__routerHooks = {
    removeBeforeEach,
    removeAfterEach
  }

  startAdminHotkeyListening()
})

onUnmounted(() => {
  window.removeEventListener('admin-hotkey-trigger', handleAdminHotkey as EventListener)
  window.removeEventListener('showAdminLogin', handleShowAdminLoginEvent as EventListener)
  window.removeEventListener('admin-exit', handleAdminExitEvent)

  removeBeforeEach?.()
  removeAfterEach?.()
  globalWindow.__routerHooks = undefined

  adminHotkeyService.stopListening()

  if (pageTransitionTimeout.value) {
    clearTimeout(pageTransitionTimeout.value)
    pageTransitionTimeout.value = null
  }
  if (pageLoadingFailSafe.value) {
    clearTimeout(pageLoadingFailSafe.value)
    pageLoadingFailSafe.value = null
  }
})
</script>

<style scoped>
#app {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 页面过渡动画 */
.page-transition-enter-active {
  animation: pageIn 0.3s ease-out forwards;
}

.page-transition-leave-active {
  animation: pageOut 0.3s ease-out forwards;
}

@keyframes pageIn {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pageOut {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-20px);
  }
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  .page-transition-enter-active,
  .page-transition-leave-active {
    animation: none !important;
    transition: none !important;
  }
}
</style>