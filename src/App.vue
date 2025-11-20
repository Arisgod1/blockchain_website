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

interface AdminHotkeyDetail {
  redirectTo?: string
  timestamp?: number
  type?: string
}

interface ShowAdminLoginDetail {
  redirectTo?: string
}

const router = useRouter()

// 管理员登录状态
const showAdminLogin = ref(false)
const pendingRedirect = ref<string>('')

// 页面加载动画状态
const isPageLoading = ref(false)
const pageTransitionTimeout = ref<number | null>(null)

// 关闭管理员登录弹窗
const closeAdminLogin = () => {
  showAdminLogin.value = false
  pendingRedirect.value = ''
}

// 页面过渡动画处理函数
const onPageEnter = () => {
  console.log('🎬 页面进入动画开始')
  // 延迟显示加载动画，给路由过渡留出时间
  pageTransitionTimeout.value = window.setTimeout(() => {
    isPageLoading.value = true
    console.log('⏳ 显示页面加载动画')
  }, 100)
}

const onPageLeave = () => {
  console.log('🎬 页面离开动画开始')
  isPageLoading.value = false
  if (pageTransitionTimeout.value) {
    clearTimeout(pageTransitionTimeout.value)
    pageTransitionTimeout.value = null
  }
}

const onPageAfterEnter = () => {
  console.log('✅ 页面进入动画完成')
  isPageLoading.value = false
  if (pageTransitionTimeout.value) {
    clearTimeout(pageTransitionTimeout.value)
    pageTransitionTimeout.value = null
  }
}

// 监听路由变化，启动页面加载动画
const startPageLoading = () => {
  console.log('🚀 启动页面加载动画')
  isPageLoading.value = true
}

// 停止页面加载动画
const stopPageLoading = () => {
  console.log('🛑 停止页面加载动画')
  isPageLoading.value = false
}

// 处理管理员登录成功
const handleAdminLoginSuccess = async (adminUser: AdminUser) => {
  console.log('✅ 管理员登录成功', adminUser)
  
  // 统一使用 'adminToken' 作为存储键名
  localStorage.setItem('adminToken', 'admin_logged_in')
  localStorage.setItem('admin-user', JSON.stringify(adminUser))
  
  const redirectTo = pendingRedirect.value || '/admin'
  pendingRedirect.value = ''
  
  // 关闭登录弹窗
  closeAdminLogin()
  
  // 显示登录成功提示
  alert('✅ 登录成功！即将跳转到管理员后台...')
  
  // 跳转到目标页面或默认的管理员后台
  await router.push(redirectTo)
}

// 监听管理员快捷键事件
const handleAdminHotkey = (event: CustomEvent<AdminHotkeyDetail>) => {
  console.log('🚀 管理员快捷键触发')
  showAdminLogin.value = true
  pendingRedirect.value = event.detail?.redirectTo || ''
}

// 监听全局showAdminLogin事件
const handleShowAdminLoginEvent = (event: CustomEvent<ShowAdminLoginDetail>) => {
  console.log('📢 收到showAdminLogin事件:', event.detail)
  showAdminLogin.value = true
  pendingRedirect.value = event.detail?.redirectTo || ''
}

// 监听管理员退出事件
const handleAdminExitEvent = async () => {
  console.log('🚪 handleAdminExitEvent 被调用 - 管理员退出事件处理开始')
  
  // 清除管理员状态
  console.log('🧹 清除管理员状态...')
  localStorage.removeItem('adminToken')
  localStorage.removeItem('admin-user')
  console.log('🧹 管理员状态已清除')
  
  // 显示退出提示
  console.log('💬 显示退出提示...')
  alert('✅ 已成功退出管理员模式')
  
  // 跳转到首页
  console.log('🏠 开始跳转到首页...')
  try {
    await router.push('/')
    console.log('✅ 成功跳转到首页')
  } catch (error) {
    console.error('❌ 跳转到首页失败:', error)
  }
}

// 启动管理员快捷键监听
const startAdminHotkeyListening = () => {
  adminHotkeyService.startListening((event) => {
    if (event.type === 'trigger') {
      console.log('🎯 快捷键触发管理员模式')
      showAdminLogin.value = true
    }
  })
}

onMounted(() => {
  // 添加事件监听器
  window.addEventListener('admin-hotkey-trigger', handleAdminHotkey as EventListener)
  window.addEventListener('showAdminLogin', handleShowAdminLoginEvent as EventListener)
  window.addEventListener('admin-exit', handleAdminExitEvent)
  
  // 监听路由变化
  const routerHook = router.beforeEach((to, from) => {
    console.log(`🔄 路由变化: ${from.path} -> ${to.path}`)
    startPageLoading()
  })
  
  const afterRouterHook = router.afterEach(() => {
    console.log('✅ 路由跳转完成')
    stopPageLoading()
  })
  
  // 保存钩子函数引用以便清理
  window.__routerHooks = { routerHook, afterRouterHook }
  
  // 启动管理员快捷键监听
  startAdminHotkeyListening()
  
  console.log('✅ App 组件已初始化，管理员快捷键监听和路由监听已启动')
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('admin-hotkey-trigger', handleAdminHotkey as EventListener)
  window.removeEventListener('showAdminLogin', handleShowAdminLoginEvent as EventListener)
  window.removeEventListener('admin-exit', handleAdminExitEvent)
  
  // 清理路由监听
  const hooks = window.__routerHooks
  if (hooks) {
    hooks.routerHook?.()
    hooks.afterRouterHook?.()
    window.__routerHooks = undefined
  }
  
  // 停止快捷键监听
  adminHotkeyService.stopListening()
  
  // 清理定时器
  if (pageTransitionTimeout.value) {
    clearTimeout(pageTransitionTimeout.value)
    pageTransitionTimeout.value = null
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