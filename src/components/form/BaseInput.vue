<template>
  <div :class="containerClasses">
    <!-- 标签 -->
    <label 
      v-if="label" 
      :for="inputId" 
      :class="labelClasses"
    >
      {{ label }}
      <span
        v-if="required"
        :class="requiredClasses"
      >*</span>
    </label>

    <!-- 输入框容器 -->
    <div :class="inputContainerClasses">
      <!-- 前置图标 -->
      <div
        v-if="$slots.prefix || prefix"
        :class="prefixClasses"
      >
        <slot name="prefix">
          <component
            :is="prefix"
            v-if="prefix"
          />
        </slot>
      </div>

      <!-- 输入框 -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :minlength="minlength"
        :pattern="pattern"
        :autocomplete="autocomplete"
        :class="inputClasses"
        v-bind="$attrs"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      >

      <!-- 后置图标和操作 -->
      <div :class="suffixClasses">
        <!-- 清空按钮 -->
        <button
          v-if="clearable && modelValue"
          type="button"
          :class="clearButtonClasses"
          @click="handleClear"
        >
          <svg
            class="w-4 h-4"
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
        
        <!-- 后缀图标 -->
        <slot name="suffix">
          <component
            :is="suffix"
            v-if="suffix"
          />
        </slot>

        <!-- 密码显示/隐藏按钮 -->
        <button
          v-if="type === 'password' && !disabled"
          type="button"
          :class="toggleButtonClasses"
          @click="togglePasswordVisibility"
        >
          <svg
            v-if="passwordVisible"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <svg
            v-else
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 错误信息 -->
    <div
      v-if="error || $slots.error"
      :class="errorClasses"
    >
      <svg
        v-if="error"
        class="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <slot name="error">
        {{ error }}
      </slot>
    </div>

    <!-- 提示信息 -->
    <div
      v-if="hint && !$slots.error && !error"
      :class="hintClasses"
    >
      <slot name="hint">
        {{ hint }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time'
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  hint?: string
  clearable?: boolean
  prefix?: any
  suffix?: any
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
  maxlength?: number
  minlength?: number
  pattern?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  size: 'md',
  variant: 'default',
  autocomplete: 'off'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
  'keydown': [event: KeyboardEvent]
  'clear': []
}>()

const inputId = `input-${Math.random().toString(36).substr(2, 9)}`
const passwordVisible = ref(false)

// 容器样式
const containerClasses = [
  'w-full'
]

// 标签样式
const labelClasses = [
  'block',
  'text-sm',
  'font-medium',
  'text-neutral-700',
  'mb-2'
]

// 必填标记样式
const requiredClasses = [
  'text-red-500',
  'ml-1'
]

// 输入框容器样式
const inputContainerClasses = [
  'relative',
  'flex',
  'items-center'
]

// 前缀样式
const prefixClasses = [
  'absolute',
  'left-3',
  'flex',
  'items-center',
  'pointer-events-none',
  'text-neutral-400'
]

// 后缀样式
const suffixClasses = [
  'absolute',
  'right-3',
  'flex',
  'items-center',
  'gap-1'
]

// 输入框基础样式
const baseInputClasses = [
  'w-full',
  'border',
  'transition-colors',
  'duration-200',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-offset-1',
  'disabled:bg-neutral-50',
  'disabled:cursor-not-allowed',
  'disabled:text-neutral-500'
]

// 尺寸样式
const sizeClasses = {
  sm: ['text-sm', 'px-3', 'py-2', 'h-9'],
  md: ['text-sm', 'px-3', 'py-2.5', 'h-10'],
  lg: ['text-base', 'px-4', 'py-3', 'h-12']
}

// 前缀内边距调整
const prefixPaddingClasses = {
  sm: ['pl-9'],
  md: ['pl-10'],
  lg: ['pl-12']
}

// 后缀内边距调整
const suffixPaddingClasses = {
  sm: ['pr-9'],
  md: ['pr-10'],
  lg: ['pr-12']
}

// 变体样式
const variantClasses = {
  default: [
    'bg-white',
    'border-neutral-300',
    'text-neutral-900',
    'placeholder-neutral-400',
    'hover:border-neutral-400',
    'focus:border-primary-500',
    'focus:ring-primary-500'
  ],
  filled: [
    'bg-neutral-100',
    'border-transparent',
    'text-neutral-900',
    'placeholder-neutral-500',
    'hover:bg-neutral-200',
    'focus:bg-white',
    'focus:border-primary-500',
    'focus:ring-primary-500'
  ],
  outlined: [
    'bg-transparent',
    'border-2',
    'border-neutral-300',
    'text-neutral-900',
    'placeholder-neutral-400',
    'hover:border-neutral-400',
    'focus:border-primary-500',
    'focus:ring-primary-500'
  ]
}

// 错误状态样式
const errorClasses = [
  'mt-1',
  'text-sm',
  'text-red-600',
  'flex',
  'items-start'
]

// 提示样式
const hintClasses = [
  'mt-1',
  'text-sm',
  'text-neutral-500',
  'flex',
  'items-start'
]

// 清空按钮样式
const clearButtonClasses = [
  'p-1',
  'text-neutral-400',
  'hover:text-neutral-600',
  'transition-colors',
  'rounded',
  'hover:bg-neutral-100',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-primary-500'
]

// 密码切换按钮样式
const toggleButtonClasses = [
  'p-1',
  'text-neutral-400',
  'hover:text-neutral-600',
  'transition-colors',
  'rounded',
  'hover:bg-neutral-100',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-primary-500'
]

// 完整输入框样式
const inputClasses = computed(() => {
  const classes = [
    ...baseInputClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant]
  ]

  // 添加前后缀内边距
  if (props.prefix) {
    classes.push(...prefixPaddingClasses[props.size])
  }
  if (props.suffix || props.clearable || props.type === 'password') {
    classes.push(...suffixPaddingClasses[props.size])
  }

  // 错误状态样式
  if (props.error) {
    classes.push(
      'border-red-500',
      'text-red-900',
      'focus:border-red-500',
      'focus:ring-red-500'
    )
  }

  return classes
})

// 切换密码可见性
function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value
}

// 事件处理
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
/* 清除默认样式 */
input::-ms-clear {
  display: none;
}

/* 数字输入框样式 */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* 搜索输入框样式 */
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}
</style>