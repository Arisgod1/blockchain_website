<template>
  <div class="home-page">
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
}
</style>