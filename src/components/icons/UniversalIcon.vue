<template>
  <!-- 通用图标占位符组件 -->
  <span class="icon-placeholder" :style="iconStyle">
    {{ getIconSymbol() }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name?: string
  size?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: 'EmptyIcon',
  size: 16,
  color: 'currentColor'
})

const iconStyle = computed(() => ({
  fontSize: `${props.size}px`,
  color: props.color,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const getIconSymbol = () => {
  // 为不同图标返回简单的Unicode符号
  const icons: Record<string, string> = {
    'GithubIcon': '📱',
    'ProjectIcon': '📁',
    'LinkedInIcon': '💼',
    'StarIcon': '★',
    'EyeIcon': '👁',
    'ClockIcon': '⏰',
    'HeartIcon': '♥',
    'BookmarkIcon': '🔖',
    'ShareIcon': '📤',
    'ChevronLeftIcon': '◀',
    'ChevronRightIcon': '▶',
    'HashIcon': '#',
    'WeiboIcon': '🐦',
    'MessageCircleIcon': '💬',
    'CopyIcon': '📋',
    'CodeIcon': '💻',
    'CoinsIcon': '🪙',
    'FileTextIcon': '📄',
    'ToolIcon': '🔧',
    'TrendingUpIcon': '📈',
    'LayersIcon': '🗂',
    'GitBranchIcon': '🌿',
    'FolderIcon': '📁',
    'FilterIcon': '🔍',
    'FolderXIcon': '📁❌',
    'CalendarCheckIcon': '📅✓',
    'TagIcon': '🏷',
    'ExternalLinkIcon': '🔗',
    'ArrowUpIcon': '⬆',
    'ArrowDownIcon': '⬇',
    'RotateCcwIcon': '↻',
    'SettingsIcon': '⚙',
    'ChevronUpIcon': '⬆',
    'ChevronDownIcon': '⬇',
    'EmptyIcon': '∅',
    'DownloadIcon': '⬇'
  }
  
  return icons[props.name || 'EmptyIcon'] || '●'
}
</script>

<style scoped>
.icon-placeholder {
  width: 1em;
  height: 1em;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
  font-weight: normal;
}
</style>