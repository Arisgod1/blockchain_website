<template>
  <div
    class="toast"
    :class="[`toast-${type}`]"
    role="status"
    aria-live="polite"
  >
    <div class="toast-indicator" />
    <div class="toast-content">
      <p class="toast-message">
        {{ message }}
      </p>
      <button
        class="toast-close"
        aria-label="关闭提示"
        @click="dismiss"
      >
        ×
      </button>
    </div>
    <div
      class="toast-progress"
      :style="{ animationDuration: `${duration}ms` }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

type ToastType = 'info' | 'success' | 'warning' | 'error'

interface Props {
  id: number | string
  message: string
  type?: ToastType
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 4000
})

const emit = defineEmits<{ (e: 'dismiss', id: number | string): void }>()

let timer: number | undefined

const dismiss = () => {
  emit('dismiss', props.id)
}

onMounted(() => {
  timer = window.setTimeout(dismiss, props.duration)
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<style scoped lang="postcss">
.toast {
  @apply relative w-72 rounded-2xl border shadow-xl backdrop-blur-md px-4 py-3 text-sm text-white overflow-hidden pointer-events-auto;
}

.toast-info {
  @apply border-blue-400 bg-blue-500/90;
}

.toast-success {
  @apply border-emerald-400 bg-emerald-500/90;
}

.toast-warning {
  @apply border-amber-400 bg-amber-500/90;
}

.toast-error {
  @apply border-rose-400 bg-rose-500/90;
}

.toast-indicator {
  @apply absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-40 pointer-events-none;
}

.toast-content {
  @apply relative flex items-start gap-3;
}

.toast-message {
  @apply flex-1 leading-relaxed text-white;
}

.toast-close {
  @apply text-white/80 hover:text-white transition-colors text-lg leading-none;
}

.toast-progress {
  @apply absolute bottom-0 left-0 h-0.5 bg-white/70;
  animation-name: toast-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes toast-progress {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}
</style>
