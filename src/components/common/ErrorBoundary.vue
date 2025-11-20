<template>
  <div class="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
      <!-- 错误图标 -->
      <div class="mb-6">
        <div class="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <svg 
            class="w-10 h-10 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      </div>

      <!-- 错误标题 -->
      <h1 class="text-2xl font-bold text-neutral-800 mb-3">
        {{ errorTitle }}
      </h1>

      <!-- 错误描述 -->
      <p class="text-neutral-600 mb-6 leading-relaxed">
        {{ errorMessage }}
      </p>

      <!-- 技术详情（开发模式） -->
      <div
        v-if="isDevelopment && error"
        class="mb-6 text-left"
      >
        <details class="bg-neutral-50 rounded-lg p-4 text-sm">
          <summary class="cursor-pointer text-neutral-700 font-medium mb-2">
            技术详情 (点击展开)
          </summary>
          <div class="text-neutral-600 space-y-2">
            <div><strong>错误类型:</strong> {{ error.code || 'Unknown' }}</div>
            <div><strong>错误消息:</strong> {{ error.message }}</div>
            <div v-if="error.details">
              <strong>详细信息:</strong> {{ error.details }}
            </div>
          </div>
        </details>
      </div>

      <!-- 操作按钮 -->
      <div class="space-y-3">
        <button 
          class="w-full btn-primary py-3 text-base font-semibold"
          @click="handleRetry"
        >
          <svg
            class="w-5 h-5 mr-2 inline-block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          重新尝试
        </button>

        <button 
          class="w-full btn-outline py-3 text-base"
          @click="handleGoHome"
        >
          <svg
            class="w-5 h-5 mr-2 inline-block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          返回首页
        </button>

        <button 
          class="w-full btn-ghost py-2 text-sm text-neutral-500"
          @click="handleReportBug"
        >
          <svg
            class="w-4 h-4 mr-1 inline-block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          报告问题
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { AppError } from '@/store/app'

interface Props {
  error?: AppError | null
  title?: string
  message?: string
  showRetry?: boolean
  onRetry?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  error: null,
  title: '页面出现错误',
  message: '抱歉，页面遇到了意外错误。请尝试刷新页面或联系我们的技术支持团队。',
  showRetry: true,
  onRetry: undefined
})

const router = useRouter()

// 检测是否为开发环境
const isDevelopment = computed(() => {
  return import.meta.env.MODE === 'development'
})

// 错误标题
const errorTitle = computed(() => {
  if (props.title !== '页面出现错误') return props.title
  
  if (!props.error) return '页面出现错误'
  
  switch (props.error.code) {
    case 'NETWORK_ERROR':
      return '网络连接失败'
    case 'UNAUTHORIZED':
      return '访问被拒绝'
    case 'FORBIDDEN':
      return '没有权限'
    case 'NOT_FOUND':
      return '页面未找到'
    case 'SERVER_ERROR':
      return '服务器错误'
    default:
      return '页面出现错误'
  }
})

// 错误消息
const errorMessage = computed(() => {
  if (props.message !== '抱歉，页面遇到了意外错误。请尝试刷新页面或联系我们的技术支持团队。') {
    return props.message
  }
  
  if (!props.error) return props.message
  
  return props.error.message || '抱歉，页面遇到了意外错误。'
})

// 处理重试
function handleRetry() {
  if (props.onRetry) {
    props.onRetry()
  } else {
    // 默认行为：刷新页面
    window.location.reload()
  }
}

// 处理返回首页
function handleGoHome() {
  router.push('/')
}

// 处理报告问题
function handleReportBug() {
  const errorInfo = {
    title: errorTitle.value,
    message: errorMessage.value,
    error: props.error,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  }
  
  // 在实际项目中，这里可以发送错误报告到服务器
  // 或者打开一个报告表单
  
  console.log('错误报告:', errorInfo)
  
  // 临时显示感谢消息
  alert('感谢您的反馈！我们已记录此错误并会尽快修复。')
}
</script>

<style scoped>
/* 确保错误边界组件在所有内容之上 */
:deep(*) {
  z-index: 9999;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .max-w-md {
    max-width: 100%;
  }
}
</style>