<template>
  <Teleport to="body">
    <Transition
      name="modal"
      appear
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- 背景遮罩 -->
        <div 
          class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          :class="{ 'opacity-0': !visible }"
        />

        <!-- 模态框内容 -->
        <div
          ref="modalContent"
          :class="modalClasses"
          @click.stop
        >
          <!-- 头部 -->
          <div
            v-if="$slots.header || title || closable"
            :class="headerClasses"
          >
            <div class="flex-1">
              <slot name="header">
                <h2
                  v-if="title"
                  :class="titleClasses"
                >
                  {{ title }}
                </h2>
                <p
                  v-if="$slots.description"
                  class="mt-1"
                >
                  <slot name="description" />
                </p>
              </slot>
            </div>
            <button
              v-if="closable"
              :class="closeButtonClasses"
              @click="handleClose"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- 内容区域 -->
          <div :class="contentClasses">
            <slot />
          </div>

          <!-- 底部操作 -->
          <div
            v-if="$slots.footer"
            :class="footerClasses"
          >
            <slot name="footer" />
          </div>

          <!-- 加载叠加层 -->
          <div 
            v-if="loading" 
            :class="loadingOverlayClasses"
          >
            <div class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'

interface Props {
  modelValue?: boolean
  // 兼容早期代码使用的 `show` 属性
  show?: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnBackdrop?: boolean
  loading?: boolean
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  show: undefined,
  size: 'md',
  closable: true,
  closeOnBackdrop: true,
  loading: false,
  persistent: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:show': [value: boolean]
  'close': []
}>()

const modalContent = ref<HTMLElement | null>(null)

// 兼容：某些使用处仍然传递 `show` 而非 `modelValue`，以 `modelValue` 优先，否则使用 `show`
const visible = computed(() => {
  if (typeof props.modelValue === 'boolean') return props.modelValue
  if (typeof props.show === 'boolean') return props.show
  return false
})

// 模态框大小样式
const sizeClasses = {
  sm: ['w-full', 'max-w-md'],
  md: ['w-full', 'max-w-lg'],
  lg: ['w-full', 'max-w-2xl'],
  xl: ['w-full', 'max-w-4xl'],
  full: ['w-full', 'max-w-7xl', 'h-full', 'max-h-[90vh]']
}

// 模态框基础样式
const modalBaseClasses = [
  'relative',
  'bg-white',
  'rounded-xl',
  'shadow-2xl',
  'transform',
  'transition-all',
  'duration-200',
  'max-h-[90vh]',
  'overflow-hidden',
  'flex',
  'flex-col'
]

// 完整样式类
const modalClasses = computed(() => {
  const sizeClass = sizeClasses[props.size as keyof typeof sizeClasses] || sizeClasses.md
  return [
    ...modalBaseClasses,
    ...sizeClass
  ]
})

// 头部样式
const headerClasses = [
  'flex',
  'items-start',
  'justify-between',
  'p-6',
  'border-b',
  'border-neutral-200',
  'flex-shrink-0'
]

// 标题样式
const titleClasses = [
  'text-xl',
  'font-semibold',
  'text-neutral-800'
]

// 关闭按钮样式
const closeButtonClasses = [
  'p-1',
  'text-neutral-400',
  'hover:text-neutral-600',
  'transition-colors',
  'rounded-lg',
  'hover:bg-neutral-100',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-primary-500',
  'focus:ring-offset-2'
]

// 内容样式
const contentClasses = [
  'flex-1',
  'overflow-y-auto',
  'p-6'
]

// 底部样式
const footerClasses = [
  'flex',
  'items-center',
  'justify-end',
  'gap-3',
  'p-6',
  'border-t',
  'border-neutral-200',
  'flex-shrink-0'
]

// 加载叠加层样式
const loadingOverlayClasses = [
  'absolute',
  'inset-0',
  'bg-white/80',
  'backdrop-blur-sm',
  'flex',
  'items-center',
  'justify-center',
  'z-10'
]

// 处理背景点击
function handleBackdropClick() {
  if (props.closeOnBackdrop && !props.persistent) {
    handleClose()
  }
}

// 处理关闭
function handleClose() {
  // 同时触发两种更新事件以兼容使用 `modelValue` 或 `show` 的父组件
  emit('update:modelValue', false)
  emit('update:show', false)
  emit('close')
}

// 监听ESC键
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && visible.value && !props.persistent) {
    handleClose()
  }
}

// 锁定滚动
function lockScroll() {
  document.body.style.overflow = 'hidden'
}

// 解锁滚动
function unlockScroll() {
  document.body.style.overflow = ''
}

// 监听模态框状态变化（使用合并后的 visible）
watch(() => visible.value, (newValue) => {
  if (newValue) {
    lockScroll()
    // 聚焦到模态框内容
    nextTick(() => {
      modalContent.value?.focus()
    })
  } else {
    unlockScroll()
  }
})

// 添加键盘监听，监听合并后的 visible
watch(() => visible.value, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
}, { immediate: true })

// 组件卸载时清理
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  unlockScroll()
})
</script>

<style scoped>
/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

/* 确保模态框可聚焦 */
.modal-content:focus {
  outline: none;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .fixed {
    padding: 0.5rem;
  }
  
  .w-full.max-w-lg {
    width: 100%;
  }
  
  .w-full.max-w-2xl {
    width: 100%;
  }
  
  .w-full.max-w-4xl {
    width: 100%;
  }
  
  .w-full.max-w-7xl {
    width: 100%;
    height: 100%;
    max-height: 100vh;
  }
}
</style>