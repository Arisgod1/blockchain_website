<template>
  <div 
    :class="cardClasses"
    v-bind="$attrs"
  >
    <!-- 卡片头部 -->
    <div
      v-if="$slots.header || title || $slots.actions"
      :class="headerClasses"
    >
      <div class="flex-1">
        <slot name="header">
          <h3
            v-if="title"
            :class="titleClasses"
          >
            {{ title }}
          </h3>
          <p
            v-if="subtitle"
            :class="subtitleClasses"
          >
            {{ subtitle }}
          </p>
        </slot>
      </div>
      <div
        v-if="$slots.actions"
        :class="actionsClasses"
      >
        <slot name="actions" />
      </div>
    </div>

    <!-- 卡片内容 -->
    <div :class="contentClasses">
      <slot />
    </div>

    <!-- 卡片底部 -->
    <div
      v-if="$slots.footer"
      :class="footerClasses"
    >
      <slot name="footer" />
    </div>

    <!-- 叠加层（用于加载状态） -->
    <div 
      v-if="loading" 
      :class="overlayClasses"
    >
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  variant?: 'default' | 'outlined' | 'elevated' | 'filled'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  loading?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  variant: 'default',
  padding: 'md',
  hover: false,
  loading: false,
  rounded: 'lg'
})

// 基础样式类
const baseCardClasses = [
  'relative',
  'bg-white',
  'transition-all',
  'duration-200',
  'select-none'
]

// 变体样式
const variantClasses = {
  default: [
    'border',
    'border-neutral-200',
    'shadow-sm'
  ],
  outlined: [
    'border-2',
    'border-neutral-300',
    'shadow-none'
  ],
  elevated: [
    'shadow-lg',
    'border',
    'border-neutral-200'
  ],
  filled: [
    'bg-neutral-50',
    'border',
    'border-neutral-200',
    'shadow-none'
  ]
}

// 圆角样式
const roundedClasses = {
  none: ['rounded-none'],
  sm: ['rounded-sm'],
  md: ['rounded-md'],
  lg: ['rounded-lg'],
  xl: ['rounded-xl']
}

// 悬停效果
const hoverClasses = computed(() => {
  return props.hover ? [
    'hover:shadow-lg',
    'hover:-translate-y-1',
    'cursor-pointer'
  ] : []
})

// 内边距样式
const paddingClasses = {
  none: [],
  sm: ['p-3'],
  md: ['p-4'],
  lg: ['p-6'],
  xl: ['p-8']
}

// 完整样式类
const cardClasses = computed(() => {
  return [
    ...baseCardClasses,
    ...variantClasses[props.variant],
    ...roundedClasses[props.rounded],
    ...paddingClasses[props.padding],
    ...hoverClasses.value
  ]
})

// 头部样式
const headerClasses = computed(() => {
  return [
    'flex',
    'items-start',
    'justify-between',
    'mb-4',
    'pb-3',
    'border-b',
    'border-neutral-100'
  ]
})

// 标题样式
const titleClasses = [
  'text-lg',
  'font-semibold',
  'text-neutral-800'
]

// 副标题样式
const subtitleClasses = [
  'text-sm',
  'text-neutral-600',
  'mt-1'
]

// 操作按钮样式
const actionsClasses = [
  'flex',
  'items-center',
  'gap-2',
  'ml-4'
]

// 内容样式
const contentClasses = [
  'flex-1'
]

// 底部样式
const footerClasses = computed(() => {
  return [
    'mt-4',
    'pt-3',
    'border-t',
    'border-neutral-100'
  ]
})

// 叠加层样式
const overlayClasses = [
  'absolute',
  'inset-0',
  'bg-white/80',
  'backdrop-blur-sm',
  'flex',
  'items-center',
  'justify-center',
  'rounded-inherit',
  'z-10'
]
</script>

<style scoped lang="postcss">
/* 确保卡片在所有内容之上 */
:deep(*) {
  position: relative;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .p-6 {
    @apply p-4;
  }
  
  .p-8 {
    @apply p-6;
  }
}
</style>