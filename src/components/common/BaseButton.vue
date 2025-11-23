<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' ? href : undefined"
    :to="tag === 'router-link' ? to : undefined"
    :disabled="disabled || loading"
    :class="buttonClasses"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- 加载图标 -->
    <svg 
      v-if="loading" 
      class="animate-spin -ml-1 mr-2 h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        class="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        stroke-width="4"
      />
      <path 
        class="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- 前置图标 -->
    <slot name="icon-left">
      <component 
        :is="iconLeft" 
        v-if="iconLeft && !loading" 
        :class="iconLeftClasses"
      />
    </slot>

    <!-- 按钮文字 -->
    <span
      v-if="$slots.default || text"
      :class="textClasses"
    >
      <slot>{{ text }}</slot>
    </span>

    <!-- 后置图标 -->
    <slot name="icon-right">
      <component 
        :is="iconRight" 
        v-if="iconRight" 
        :class="iconRightClasses"
      />
    </slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

type IconProp = string | Component

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  tag?: 'button' | 'a' | 'router-link'
  type?: 'button' | 'submit' | 'reset'
  href?: string
  to?: string
  iconLeft?: IconProp
  iconRight?: IconProp
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  text: '',
  loading: false,
  disabled: false,
  fullWidth: false,
  rounded: 'md',
  tag: 'button',
  type: 'button',
  href: undefined,
  to: undefined,
  iconLeft: undefined,
  iconRight: undefined
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// 基础样式类
const baseClasses = [
  'inline-flex',
  'items-center',
  'justify-center',
  'font-medium',
  'transition-all',
  'duration-200',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-offset-2',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
  'disabled:transform-none',
  'select-none'
]

// 尺寸样式
const sizeClasses = {
  xs: ['text-xs', 'px-2.5', 'py-1.5', 'gap-1'],
  sm: ['text-sm', 'px-3', 'py-2', 'gap-1.5'],
  md: ['text-sm', 'px-4', 'py-2', 'gap-2'],
  lg: ['text-base', 'px-6', 'py-3', 'gap-2.5'],
  xl: ['text-lg', 'px-8', 'py-4', 'gap-3']
}

// 圆角样式
const roundedClasses = {
  none: ['rounded-none'],
  sm: ['rounded-sm'],
  md: ['rounded-lg'],
  lg: ['rounded-xl'],
  full: ['rounded-full']
}

// 颜色变体样式
const variantClasses = {
  primary: [
    'bg-primary-600',
    'text-white',
    'hover:bg-primary-700',
    'active:bg-primary-800',
    'focus:ring-primary-500',
    'shadow-sm',
    'hover:shadow-md'
  ],
  secondary: [
    'bg-secondary-600',
    'text-white',
    'hover:bg-secondary-700',
    'active:bg-secondary-800',
    'focus:ring-secondary-500',
    'shadow-sm',
    'hover:shadow-md'
  ],
  outline: [
    'bg-transparent',
    'border-2',
    'border-primary-600',
    'text-primary-600',
    'hover:bg-primary-50',
    'active:bg-primary-100',
    'focus:ring-primary-500'
  ],
  ghost: [
    'bg-transparent',
    'text-primary-600',
    'hover:bg-primary-50',
    'active:bg-primary-100',
    'focus:ring-primary-500'
  ],
  danger: [
    'bg-red-600',
    'text-white',
    'hover:bg-red-700',
    'active:bg-red-800',
    'focus:ring-red-500',
    'shadow-sm',
    'hover:shadow-md'
  ]
}

// 宽度样式
const widthClasses = computed(() => {
  return props.fullWidth ? ['w-full'] : []
})

// 完整样式类
const buttonClasses = computed(() => {
  const classes = [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...roundedClasses[props.rounded],
    ...variantClasses[props.variant],
    ...widthClasses.value
  ]

  // 如果加载中，添加加载状态样式
  if (props.loading) {
    classes.push('cursor-wait')
  }

  return classes
})

// 图标样式
const iconLeftClasses = computed(() => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  }
  return sizes[props.size]
})

const iconRightClasses = computed(() => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  }
  return sizes[props.size]
})

// 文字样式
const textClasses = computed(() => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }
  return sizes[props.size]
})

// 处理点击事件
function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<style scoped>
/* 确保聚焦时不会有outline */
button:focus:not(:focus-visible),
a:focus:not(:focus-visible) {
  outline: none;
}

/* 确保路由链接样式正确 */
:deep(.router-link-active) {
  opacity: 0.95;
}
</style>