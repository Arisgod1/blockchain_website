<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="header-content">
        <div class="header-left">
          <button 
            class="menu-toggle"
            @click="sidebarCollapsed = !sidebarCollapsed"
          >
            ☰
          </button>
          <div class="logo-section">
            <h1 class="admin-title">
              管理员后台
            </h1>
          </div>
        </div>

        <div class="header-right">
          <div class="header-actions">
            <button 
              class="action-btn refresh-btn"
              title="刷新数据"
              @click="handleRefresh"
            >
              🔄
            </button>
            <button 
              class="action-btn close-admin-btn"
              title="退出管理员模式"
              @click="handleCloseAdmin"
            >
              🚪
            </button>
          </div>
          
          <div class="admin-user">
            <div class="user-info">
              <span class="user-name">{{ currentAdmin?.username || '管理员' }}</span>
              <span class="user-role">{{ currentAdmin?.role || 'Admin' }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="admin-body">
      <!-- 侧边栏 -->
      <aside 
        class="admin-sidebar"
        :class="{ collapsed: sidebarCollapsed }"
      >
        <nav class="sidebar-nav">
          <div class="nav-section">
            <h3
              v-if="!sidebarCollapsed"
              class="nav-section-title"
            >
              功能管理
            </h3>
            <ul class="nav-list">
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'meetings' }"
                  title="例会管理"
                  @click="switchTab('meetings')"
                >
                  <span class="nav-icon">📋</span>
                  <span
                    v-if="!sidebarCollapsed"
                    class="nav-text"
                  >例会管理</span>
                </button>
              </li>
              
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'members' }"
                  title="成员管理"
                  @click="switchTab('members')"
                >
                  <span class="nav-icon">👥</span>
                  <span
                    v-if="!sidebarCollapsed"
                    class="nav-text"
                  >成员管理</span>
                </button>
              </li>
              
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'projects' }"
                  title="项目管理"
                  @click="switchTab('projects')"
                >
                  <span class="nav-icon">📊</span>
                  <span
                    v-if="!sidebarCollapsed"
                    class="nav-text"
                  >项目管理</span>
                </button>
              </li>
              
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'articles' }"
                  title="内容管理"
                  @click="switchTab('articles')"
                >
                  <span class="nav-icon">📝</span>
                  <span
                    v-if="!sidebarCollapsed"
                    class="nav-text"
                  >内容管理</span>
                </button>
              </li>

              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'files' }"
                  title="文件管理"
                  @click="switchTab('files')"
                >
                  <span class="nav-icon">📁</span>
                  <span
                    v-if="!sidebarCollapsed"
                    class="nav-text"
                  >文件管理</span>
                </button>
              </li>
            </ul>
          </div>

          <div class="nav-section">
            <h3
              v-if="!sidebarCollapsed"
              class="nav-section-title"
            >
              系统设置
            </h3>
            <ul class="nav-list">
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'settings' }"
                  title="系统设置"
                  @click="switchTab('settings')"
                >
                  <span class="nav-icon">⚙️</span>
                  <span
                    v-if="!sidebarCollapsed"
                    class="nav-text"
                  >系统设置</span>
                </button>
              </li>
              
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'logs' }"
                  title="操作日志"
                  @click="switchTab('logs')"
                >
                  <span class="nav-icon">📄</span>
                  <span
                    v-if="!sidebarCollapsed"
                    class="nav-text"
                  >操作日志</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="admin-main">
        <div class="main-content">
          <!-- 例会管理 -->
          <RouterView />
        </div>
      </main>
    </div>

    <!-- 确认退出弹窗 -->
    <BaseModal 
      v-model:show="confirmExitModal"
      title="确认退出"
      size="sm"
    >
      <p>确定要退出管理员后台吗？</p>
      <p class="warning-text">
        退出后需要重新验证身份才能进入。
      </p>

      <template #footer>
        <BaseButton 
          variant="secondary" 
          @click="confirmExitModal = false"
        >
          取消
        </BaseButton>
        <BaseButton 
          variant="danger"
          :loading="exiting"
          @click="confirmExit"
        >
          确认退出
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
 import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { BaseButton, BaseModal } from '@/components/common'
import { dispatchAdminRefresh } from '@/utils/adminEvents'
import type { AdminUser } from '@/types/entities'

// 设置页面元数据
useHead({
  title: '管理员后台',
  meta: [
    { name: 'description', content: '区块链组官方网站管理员后台' }
  ]
})

// 响应式数据
const sidebarCollapsed = ref(false)
type TabKey = 'meetings' | 'members' | 'projects' | 'articles' | 'files' | 'settings' | 'logs'
const activeTab = ref<TabKey>('meetings')
const confirmExitModal = ref(false)
const exiting = ref(false)

// 当前管理员信息
const currentAdmin = ref<AdminUser | null>(null)

const router = useRouter()
const route = useRoute()

const tabRouteMap: Record<TabKey, string> = {
  meetings: 'AdminDashboard',
  members: 'AdminMembers',
  projects: 'AdminProjects',
  articles: 'AdminArticles',
  files: 'AdminFiles',
  settings: 'AdminSettings',
  logs: 'AdminLogs'
}

const resolveTabFromRoute = (name?: string | symbol): TabKey => {
  switch (name) {
    case 'AdminMembers':
      return 'members'
    case 'AdminProjects':
      return 'projects'
    case 'AdminArticles':
      return 'articles'
    case 'AdminFiles':
      return 'files'
    case 'AdminSettings':
      return 'settings'
    case 'AdminLogs':
      return 'logs'
    default:
      return 'meetings'
  }
}

const switchTab = (tab: TabKey) => {
  activeTab.value = tab
  const targetName = tabRouteMap[tab]
  if (route.name !== targetName) {
    router.push({ name: targetName }).catch(() => {})
  }
}

// 快捷键处理
const handleKeyboardShortcuts = (event: KeyboardEvent) => {
  // Ctrl/Cmd + M: 切换侧边栏
  if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
    event.preventDefault()
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  // Ctrl/Cmd + 1-6: 快速切换标签页
  if (event.ctrlKey || event.metaKey) {
    const keyMap: Record<string, string> = {
      '1': 'meetings',
      '2': 'members', 
      '3': 'projects',
      '4': 'articles',
      '5': 'settings',
      '6': 'logs'
    }
    
    const tab = keyMap[event.key]
    if (tab) {
      event.preventDefault()
      switchTab(tab as TabKey)
    }
  }
  
  // F5: 刷新数据
  if (event.key === 'F5') {
    event.preventDefault()
    handleRefresh()
  }
}

// 方法
const handleRefresh = () => {
  dispatchAdminRefresh({ entity: 'all', action: 'refresh' })
}

const handleCloseAdmin = () => {
  console.log('🚪 handleCloseAdmin 被调用')
  confirmExitModal.value = true
  console.log('📋 confirmExitModal 设置为:', confirmExitModal.value)
}

const confirmExit = async () => {
  console.log('✅ confirmExit 被调用')
  exiting.value = true
  
  try {
    console.log('⏳ 开始退出处理...')
    // 模拟退出处理
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('⏳ 退出处理完成')
    
    console.log('🧹 清除管理员状态...')
    // 清除管理员状态
    currentAdmin.value = null
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin-user')
    console.log('🧹 状态清除完成')
    
    console.log('📢 触发 admin-exit 事件')
    // 触发退出事件
    window.dispatchEvent(new CustomEvent('admin-exit'))
    console.log('📢 admin-exit 事件已发送')
  } catch (error) {
    console.error('退出失败:', error)
  } finally {
    exiting.value = false
    confirmExitModal.value = false
    console.log('🏁 confirmExit 完成，弹窗已关闭')
  }
}

// 组件挂载时初始化
onMounted(() => {
  // 加载当前管理员信息
  const adminStr = localStorage.getItem('admin-user')
  if (adminStr) {
    try {
      currentAdmin.value = JSON.parse(adminStr)
    } catch (error) {
      console.error('解析管理员信息失败:', error)
    }
  }
  
  // 根据当前路由同步 tab
  activeTab.value = resolveTabFromRoute(route.name)

  // 注册快捷键事件监听
  document.addEventListener('keydown', handleKeyboardShortcuts)
})

// 组件卸载时清理
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcuts)
})

watch(
  () => route.name,
  (name) => {
    const resolved = resolveTabFromRoute(name)
    if (activeTab.value !== resolved) {
      activeTab.value = resolved
    }
  }
)
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
}

.admin-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: 4rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-toggle {
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1.25rem;
  color: #6b7280;
  transition: all 0.2s;
}

.menu-toggle:hover {
  background: #f3f4f6;
  color: #374151;
}

.logo-section {
  display: flex;
  align-items: center;
}

.admin-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #dbeafe;
  color: #1d4ed8;
}

.close-admin-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.admin-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.admin-sidebar {
  background: white;
  border-right: 1px solid #e2e8f0;
  width: 16rem;
  transition: width 0.3s ease;
  overflow: hidden;
}

.admin-sidebar.collapsed {
  width: 4rem;
}

.sidebar-nav {
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem 0;
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem 1.5rem;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.nav-link:hover {
  background: #f8fafc;
  color: #374151;
}

.nav-link.active {
  background: #dbeafe;
  color: #1d4ed8;
  border-right: 3px solid #3b82f6;
}

.nav-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.admin-main {
  flex: 1;
  overflow: auto;
}

.main-content {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-section,
.coming-soon {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.coming-soon-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.welcome-section h2,
.coming-soon h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.welcome-section p,
.coming-soon p {
  color: #6b7280;
  font-size: 1.125rem;
}

.warning-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-layout {
    position: relative;
  }
  
  .admin-sidebar {
    position: fixed;
    left: 0;
    top: 4rem;
    bottom: 0;
    z-index: 40;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .admin-sidebar:not(.collapsed) {
    transform: translateX(0);
  }
  
  .admin-sidebar.collapsed {
    transform: translateX(-100%);
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .header-content {
    padding: 0 1rem;
  }
  
  .admin-title {
    font-size: 1.25rem;
  }
  
  .user-info {
    display: none;
  }
}

@media (max-width: 480px) {
  .header-actions {
    gap: 0.25rem;
  }
  
  .action-btn {
    padding: 0.375rem;
  }
}
</style>