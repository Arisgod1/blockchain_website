<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="text-center max-w-md">
      <!-- 404 图形 -->
      <div class="mb-8">
        <div class="text-8xl font-bold text-indigo-600 mb-4">404</div>
        <div class="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
      </div>
      
      <!-- 错误信息 -->
      <h1 class="text-3xl font-bold text-gray-800 mb-4">
        页面未找到
      </h1>
      <p class="text-gray-600 mb-8">
        抱歉，您访问的页面不存在或已被移动。
      </p>
      
      <!-- 导航按钮 -->
      <div class="space-y-4">
        <button
          @click="goHome"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          返回首页
        </button>
        <button
          @click="goBack"
          class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          返回上页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
/* 404页面专用样式 */
</style>