<template>
  <div class="not-found-page">
    <div class="not-found-panel">
      <!-- 404 图形 -->
      <div class="mb-8">
        <div class="not-found-code">
          404
        </div>
        <div class="not-found-line" />
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
          class="w-full bg-slate-950 hover:bg-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          @click="goHome"
        >
          返回首页
        </button>
        <button
          class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          @click="goBack"
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
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background:
    radial-gradient(circle at 20% 20%, rgba(103, 232, 249, 0.18), transparent 34%),
    linear-gradient(135deg, #f8fafc, #e2e8f0);
}

.not-found-panel {
  max-width: 28rem;
  text-align: center;
}

.not-found-code {
  margin-bottom: 1rem;
  color: #0f172a;
  font-size: 6rem;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.not-found-line {
  width: 6rem;
  height: 0.25rem;
  margin: 0 auto;
  border-radius: 999px;
  background: #0891b2;
}
</style>
