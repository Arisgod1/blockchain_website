<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
    <!-- 应用主内容 -->
    <router-view />
    
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

const router = useRouter()

// 管理员登录状态
const showAdminLogin = ref(false)
const pendingRedirect = ref<string>('')

// 关闭管理员登录弹窗
const closeAdminLogin = () => {
  showAdminLogin.value = false
  pendingRedirect.value = ''
}

// 处理管理员登录成功
const handleAdminLoginSuccess = async (adminUser: any) => {
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
const handleAdminHotkey = (event: CustomEvent) => {
  console.log('🚀 管理员快捷键触发')
  showAdminLogin.value = true
  pendingRedirect.value = event.detail?.redirectTo || ''
}

// 监听全局showAdminLogin事件
const handleShowAdminLoginEvent = (event: any) => {
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
  window.addEventListener('showAdminLogin', handleShowAdminLoginEvent)
  window.addEventListener('admin-exit', handleAdminExitEvent)
  
  // 启动管理员快捷键监听
  startAdminHotkeyListening()
  
  console.log('✅ App 组件已初始化，管理员快捷键监听已启动')
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('admin-hotkey-trigger', handleAdminHotkey as EventListener)
  window.removeEventListener('showAdminLogin', handleShowAdminLoginEvent)
  window.removeEventListener('admin-exit', handleAdminExitEvent)
  
  // 停止快捷键监听
  adminHotkeyService.stopListening()
})
</script>

<style scoped>
#app {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>