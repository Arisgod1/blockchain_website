<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <div class="flex flex-col items-center space-y-4">
      <!-- 主加载动画 -->
      <div class="relative">
        <!-- 外圈旋转动画 -->
        <div class="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        
        <!-- 内圈反向旋转 -->
        <div class="absolute inset-2 w-8 h-8 border-4 border-secondary-200 border-b-secondary-600 rounded-full animate-spin animate-reverse" />
        
        <!-- 中心点 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-2 h-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full animate-pulse" />
        </div>
      </div>
      
      <!-- 加载文本 -->
      <div class="text-center">
        <p class="text-lg font-medium text-neutral-800 mb-1">
          {{ title }}
        </p>
        <p class="text-sm text-neutral-600">
          {{ message }}
        </p>
      </div>
      
      <!-- 进度条（可选） -->
      <div
        v-if="shouldShowProgress"
        class="w-64 bg-neutral-200 rounded-full h-2 overflow-hidden"
      >
        <div 
          class="h-full bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-300 ease-out rounded-full"
          :style="{ width: `${clampedProgress}%` }"
        />
      </div>
      
      <!-- 动画点 -->
      <div class="flex space-x-1">
        <div 
          v-for="i in 3" 
          :key="i"
          class="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
          :style="{ animationDelay: `${i * 0.1}s` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  message?: string
  showProgress?: boolean
  progress?: number // 0-100
}

const props = withDefaults(defineProps<Props>(), {
  title: '加载中',
  message: '请稍候，正在处理您的请求...',
  showProgress: false,
  progress: 0
})

const clampedProgress = computed(() => Math.max(0, Math.min(100, props.progress)))
const shouldShowProgress = computed(() => props.showProgress && props.progress >= 0)
</script>

<style scoped>
@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-reverse {
  animation: spin-reverse 1s linear infinite;
}

/* 自定义动画 */
.animate-bounce {
  animation: bounce 1.4s ease-in-out infinite both;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>