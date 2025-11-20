<template>
  <div class="home-page flowing-gradient-cosmic text-white">
    <!-- 轮盘导航组件 -->
    <WheelNavigation />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import WheelNavigation from '@/components/navigation/WheelNavigation.vue'

// 页面元数据设置
onMounted(() => {
  document.title = '首页 - 大连理工大学区块链组'
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', '大连理工大学区块链组官方网站首页 - 探索区块链技术的无限可能')
  } else {
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = '大连理工大学区块链组官方网站首页 - 探索区块链技术的无限可能'
    document.head.appendChild(meta)
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.home-page::before,
.home-page::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.home-page::before {
  background:
    radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.35), transparent 55%),
    radial-gradient(circle at 80% 10%, rgba(244, 114, 182, 0.35), transparent 60%),
    radial-gradient(circle at 50% 80%, rgba(14, 165, 233, 0.25), transparent 65%);
  opacity: 0.8;
}

.home-page::after {
  background-image: radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 120px 120px;
  animation: starDrift 40s linear infinite;
  opacity: 0.35;
}

@keyframes starDrift {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-120px);
  }
}
</style>