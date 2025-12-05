import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: {
      title: '首页',
      description: '大连理工大学区块链组官方网站首页'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutPage.vue'),
    meta: {
      title: '关于我们',
      description: '了解区块链组的发展历程和团队介绍'
    }
  },
  {
    path: '/members',
    name: 'Members',
    component: () => import('@/views/MembersPage.vue'),
    meta: {
      title: '团队成员',
      description: '区块链组团队成员介绍'
    }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/ProjectsPage.vue'),
    meta: {
      title: '项目展示',
      description: '区块链组项目作品展示'
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/views/BlogPage.vue'),
    meta: {
      title: '学术博客',
      description: '技术文章和开发心得分享'
    }
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('@/views/EventsPage.vue'),
    meta: {
      title: '会议活动',
      description: '区块链会议、学术活动、行业峰会'
    }
  },
  {
    path: '/meetings',
    name: 'Meetings',
    component: () => import('@/views/MeetingsPage.vue'),
    meta: {
      title: '例会记录',
      description: '团队例会会议记录'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/ContactPage.vue'),
    meta: {
      title: '联系我们',
      description: '联系方式和地址信息'
    }
  },
  // 管理员后台页面
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/components/admin/AdminLayout.vue'),
    meta: {
      title: '管理员后台',
      description: '管理员功能后台',
      requiresAdmin: true
    },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/components/admin/AdminMeetingManager.vue'),
        meta: { title: '例会管理' }
      },
      {
        path: 'members',
        name: 'AdminMembers',
        component: () => import('@/components/admin/AdminMemberManager.vue'),
        meta: { title: '成员管理' }
      },
      {
        path: 'projects',
        name: 'AdminProjects',
        component: () => import('@/components/admin/AdminProjectManager.vue'),
        meta: { title: '项目管理' }
      },
      {
        path: 'articles',
        name: 'AdminArticles',
        component: () => import('@/components/admin/AdminArticleManager.vue'),
        meta: { title: '内容管理' }
      },
      {
        path: 'files',
        name: 'AdminFiles',
        component: () => import('@/components/admin/AdminFileManager.vue'),
        meta: { title: '文件管理' }
      },
      {
        path: 'logs',
        name: 'AdminLogs',
        component: () => import('@/components/admin/AdminLogViewer.vue'),
        meta: { title: '操作日志' }
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        // 占位组件，待后续完善系统设置页
        component: { template: '<div />' },
        meta: { title: '系统设置' }
      }
    ]
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

// 创建路由器
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - DUT区块链组`
  }
  
  // 检查管理员权限
  if (to.meta?.requiresAdmin) {
    // 检查用户是否已登录管理员账户
    const isAdmin = localStorage.getItem('adminToken')
    if (!isAdmin) {
      console.log('🔒 需要管理员权限，正在触发登录弹窗...')
      
      // 触发管理员登录事件
      window.dispatchEvent(new CustomEvent('showAdminLogin', {
        detail: { redirectTo: to.fullPath }
      }))
      
      // 不进行路由跳转，让登录模态框处理
      return
    }
  }
  
  next()
})

// 路由后置守卫
router.afterEach((to, _from) => {
  // 记录页面访问日志（暂时禁用，from参数未使用）
  console.log(`导航到: ${to.path}`)
})

export default router