<template>
  <transition name="fade">
    <div
      v-if="shouldShow"
      class="fallback-banner"
    >
      <slot>{{ bannerText }}</slot>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/app'

interface Props {
  show?: boolean
  message?: string
}

const props = defineProps<Props>()

const appStore = useAppStore()

const shouldShow = computed(() => {
  if (typeof props.show === 'boolean') {
    return props.show
  }
  return appStore.isUsingMockData
})

const bannerText = computed(() => {
  if (props.message) {
    return props.message
  }
  return appStore.mockDataMessage || '当前展示本地示例数据，后台服务启动后将自动同步。'
})
</script>

<style scoped lang="postcss">
.fallback-banner {
  @apply flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm font-medium shadow-sm;
}

.fallback-banner::before {
  content: '⚠️';
  @apply text-base;
}
</style>
