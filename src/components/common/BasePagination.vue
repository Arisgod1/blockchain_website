<template>
  <nav
    :class="navClasses"
    role="navigation"
    aria-label="分页导航"
  >
    <!-- 每页显示数量选择器 -->
    <div
      v-if="showPageSize"
      :class="pageSizeContainerClasses"
    >
      <label
        :for="pageSizeId"
        :class="pageSizeLabelClasses"
      >
        每页显示
      </label>
      <select
        :id="pageSizeId"
        :value="pageSize"
        :class="pageSizeSelectClasses"
        @change="handlePageSizeChange"
      >
        <option 
          v-for="size in pageSizeOptions" 
          :key="size"
          :value="size"
        >
          {{ size }}
        </option>
      </select>
      <span :class="pageSizeSuffixClasses">条</span>
    </div>

    <!-- 分页按钮组 -->
    <div :class="paginationClasses">
      <!-- 上一页 -->
      <button
        :disabled="displayedCurrent <= 1"
        :class="getPageButtonClasses(false, true)"
        @click="goToPage(displayedCurrent - 1)"
      >
        <svg
          class="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        上一页
      </button>

      <!-- 页码按钮 -->
      <div :class="pageNumbersClasses">
        <template
          v-for="page in visiblePages"
          :key="page.key"
        >
          <!-- 省略号 -->
          <span 
            v-if="page.value === '...'" 
            :class="ellipsisClasses"
          >
            ...
          </span>
          <!-- 页码按钮 -->
          <button
            v-else
            :class="getPageButtonClasses(page.value === displayedCurrent)"
            :disabled="page.value === displayedCurrent"
            @click="goToPage(page.value as number)"
          >
            {{ page.value }}
          </button>
        </template>
      </div>

      <!-- 下一页 -->
      <button
        :disabled="displayedCurrent >= totalPages"
        :class="getPageButtonClasses(false, true)"
        @click="goToPage(displayedCurrent + 1)"
      >
        下一页
        <svg
          class="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>

    <!-- 分页信息 -->
    <div
      v-if="showInfo"
      :class="infoClasses"
    >
      显示第 <span :class="infoHighlightClasses">{{ startItem }}</span> - <span :class="infoHighlightClasses">{{ endItem }}</span> 条，
      共 <span :class="infoHighlightClasses">{{ total }}</span> 条记录
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage?: number
  current?: number
  pageSize: number
  total: number
  pageSizeOptions?: number[]
  showPageSize?: boolean
  showInfo?: boolean
  maxVisiblePages?: number
}

const props = withDefaults(defineProps<Props>(), {
  pageSizeOptions: () => [10, 20, 50, 100],
  showPageSize: true,
  showInfo: true,
  maxVisiblePages: 7
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:current': [page: number]
  'update:pageSize': [size: number]
  'pageChange': [page: number]
  'pageSizeChange': [size: number]
}>()

// Support both `currentPage` and `current` (v-model:current) for backward compatibility
const displayedCurrent = computed(() => props.currentPage ?? props.current ?? 1)

const pageSizeId = `page-size-${Math.random().toString(36).substr(2, 9)}`

// 计算属性
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const startItem = computed(() => {
  return props.total === 0 ? 0 : (displayedCurrent.value - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  return Math.min(displayedCurrent.value * props.pageSize, props.total)
})

// 计算可见的页码
interface PageDescriptor {
  key: string
  value: number | string
}

const visiblePages = computed<PageDescriptor[]>(() => {
  const makeKey = (value: number | string, indexHint: number) => {
    return typeof value === 'number'
      ? `page-${value}`
      : `ellipsis-${indexHint}`
  }

  if (totalPages.value <= props.maxVisiblePages) {
    return Array.from({ length: totalPages.value }, (_, i) => ({
      value: i + 1,
      key: `page-${i + 1}`
    }))
  }

  const pages: PageDescriptor[] = []
  const half = Math.floor(props.maxVisiblePages / 2)
  
  let start = Math.max(1, displayedCurrent.value - half)
  const end = Math.min(totalPages.value, start + props.maxVisiblePages - 1)
  
  if (end - start + 1 < props.maxVisiblePages) {
    start = Math.max(1, end - props.maxVisiblePages + 1)
  }
  
  if (start > 1) {
    pages.push({ value: 1, key: makeKey(1, pages.length) })
    if (start > 2) {
      pages.push({ value: '...', key: makeKey('...', pages.length) })
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push({ value: i, key: makeKey(i, pages.length) })
  }
  
  if (end < totalPages.value) {
    if (end < totalPages.value - 1) {
      pages.push({ value: '...', key: makeKey('...', pages.length) })
    }
    pages.push({ value: totalPages.value, key: makeKey(totalPages.value, pages.length) })
  }
  
  return pages
})

// 样式类
const navClasses = [
  'flex',
  'items-center',
  'justify-between',
  'flex-wrap',
  'gap-4',
  'py-4'
]

const pageSizeContainerClasses = [
  'flex',
  'items-center',
  'gap-2',
  'text-sm'
]

const pageSizeLabelClasses = [
  'text-neutral-600',
  'whitespace-nowrap'
]

const pageSizeSelectClasses = [
  'px-3',
  'py-1',
  'border',
  'border-neutral-300',
  'rounded-lg',
  'bg-white',
  'text-sm',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-primary-500',
  'focus:border-transparent'
]

const pageSizeSuffixClasses = [
  'text-neutral-600',
  'whitespace-nowrap'
]

const paginationClasses = [
  'flex',
  'items-center',
  'gap-2'
]

const pageNumbersClasses = [
  'flex',
  'items-center',
  'gap-1'
]

const ellipsisClasses = [
  'px-2',
  'py-1',
  'text-neutral-400',
  'select-none'
]

const infoClasses = [
  'text-sm',
  'text-neutral-600',
  'whitespace-nowrap'
]

const infoHighlightClasses = [
  'font-medium',
  'text-neutral-800'
]

// 获取页码按钮样式
function getPageButtonClasses(active = false, isNavButton = false) {
  const baseClasses = [
    'px-3',
    'py-2',
    'text-sm',
    'font-medium',
    'transition-colors',
    'rounded-lg',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-1'
  ]
  
  if (isNavButton) {
    baseClasses.push(
      'inline-flex',
      'items-center',
      'gap-1'
    )
  }
  
  if (active) {
    baseClasses.push(
      'bg-primary-600',
      'text-white',
      'cursor-default'
    )
  } else {
    baseClasses.push(
      'text-neutral-600',
      'hover:text-neutral-800',
      'hover:bg-neutral-50',
      'focus:ring-primary-500'
    )
  }
  
  if (displayedCurrent.value <= 1 && !isNavButton) {
    baseClasses.push('cursor-not-allowed', 'opacity-50')
  } else if (displayedCurrent.value >= totalPages.value && !isNavButton) {
    baseClasses.push('cursor-not-allowed', 'opacity-50')
  }
  
  return baseClasses
}

// 事件处理函数
function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === displayedCurrent.value) {
    return
  }

  // emit both update events to support callers using either v-model argument
  emit('update:currentPage', page)
  emit('update:current', page)
  emit('pageChange', page)
}

function handlePageSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const newSize = parseInt(target.value)
  
  emit('update:pageSize', newSize)
  emit('pageSizeChange', newSize)
  
  // 如果当前页码超出范围，调整到最后一页
  if (displayedCurrent.value > Math.ceil(props.total / newSize)) {
    const lastPage = Math.ceil(props.total / newSize)
    if (lastPage > 0) {
      goToPage(lastPage)
    }
  }
}
</script>

<style scoped lang="postcss">
/* 移动端适配 */
@media (max-width: 640px) {
  nav {
    @apply flex-col items-stretch gap-3;
  }
  
  .flex.items-center.justify-between {
    @apply flex-col gap-3;
  }
  
  .page-numbers {
    @apply order-2;
  }
  
  .pagination {
    @apply justify-center;
  }
}
</style>