<template>
  <div
    v-if="show"
    class="article-modal-overlay"
    @click="handleOverlayClick"
  >
    <div
      class="article-modal"
      @click.stop
    >
      <!-- 模态框头部 -->
      <div class="modal-header">
        <div class="header-info">
          <div class="category-badge">
            <component
              :is="getCategoryIcon(article.category)"
              class="category-icon"
            />
            {{ article.category }}
          </div>
          <div
            v-if="article.featured"
            class="featured-badge"
          >
            <StarIcon class="featured-icon" />
            精选
          </div>
        </div>
        <button
          class="close-btn"
          @click="$emit('close')"
        >
          <XIcon />
        </button>
      </div>

      <!-- 文章头部 -->
      <div class="article-header">
        <h1 class="article-title">
          {{ article.title }}
        </h1>
        <div class="article-meta">
          <div class="author-info">
            <img
              :src="article.author?.avatar || defaultAvatar"
              :alt="article.author?.name || '匿名作者'"
              class="author-avatar"
              @error="handleAuthorAvatarError"
            >
            <div class="author-details">
              <span class="author-name">{{ article.author?.name || '匿名作者' }}</span>
              <span class="publish-date">{{ formatDate(article.publishedAt) }}</span>
            </div>
          </div>
          <div class="article-stats">
            <span class="stat-item">
              <EyeIcon class="stat-icon" />
              {{ formatNumber(article.views) }}
            </span>
            <span class="stat-item">
              <ClockIcon class="stat-icon" />
              {{ article.readTime }} 分钟阅读
            </span>
          </div>
        </div>
      </div>

      <!-- 文章图片 -->
      <div class="article-image">
        <img 
          :src="article.thumbnail" 
          :alt="article.title"
          @error="handleImageError"
        >
        <div class="image-overlay">
          <div class="overlay-content">
            <span
              class="difficulty-badge"
              :class="`difficulty-${article.difficulty || 'intermediate'}`"
            >
              {{ getDifficultyLabel(article.difficulty) }}
            </span>
            <span class="read-time-overlay">{{ article.readTime }} 分钟</span>
          </div>
        </div>
      </div>

      <!-- 标签 -->
      <div class="article-tags">
        <button
          v-for="tag in article.tags"
          :key="tag"
          class="tag-button"
          @click="filterByTag(tag)"
        >
          <HashIcon class="tag-icon" />
          {{ tag }}
        </button>
      </div>

      <!-- 文章摘要 -->
      <div class="article-summary">
        <h3 class="summary-title">
          文章摘要
        </h3>
        <p class="summary-content">
          {{ article.summary }}
        </p>
      </div>

      <!-- 文章内容 -->
      <div class="article-content">
        <div class="content-text">
          <p
            v-for="(paragraph, index) in contentParagraphs"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>

      <!-- 交互统计 -->
      <div class="interaction-stats">
        <div class="stat-card">
          <div class="stat-value">
            {{ formatNumber(article.views) }}
          </div>
          <div class="stat-label">
            浏览量
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-value">
            {{ formatNumber(article.likes) }}
          </div>
          <div class="stat-label">
            点赞数
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-value">
            {{ formatNumber(article.comments) }}
          </div>
          <div class="stat-label">
            评论数
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-value">
            {{ article.readTime }}
          </div>
          <div class="stat-label">
            阅读时间(分钟)
          </div>
        </div>
      </div>

      <!-- 模态框底部 -->
      <div class="modal-footer">
        <div class="footer-actions">
          <button 
            class="action-button" 
            :class="{ bookmarked: article.bookmarked }"
            @click="handleBookmark"
          >
            <BookmarkIcon class="action-icon" />
            {{ article.bookmarked ? '已收藏' : '收藏' }}
          </button>

          <div class="share-dropdown">
            <button
              class="action-button"
              @click="toggleShare"
            >
              <ShareIcon class="action-icon" />
              分享
            </button>
            <span
              v-if="shareNotice"
              class="share-notice"
            >
              {{ shareNotice }}
            </span>
            <div
              v-if="showShareMenu"
              class="share-menu"
            >
              <button
                class="share-option"
                @click="handleShare('weibo')"
              >
                <WeiboIcon class="share-icon" />
                微博
              </button>
              <button
                class="share-option"
                @click="handleShare('wechat')"
              >
                <MessageCircleIcon class="share-icon" />
                微信
              </button>
              <button
                class="share-option"
                @click="handleShare('copy')"
              >
                <CopyIcon class="share-icon" />
                复制链接
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Component } from 'vue'
import type { EnrichedArticle } from '@/types/entities'
import defaultAvatar from '@/assets/BLOCKCHAINNexus.png'
import defaultArticleImage from '@/assets/richang1.png'
import {
  XIcon,
  StarIcon,
  EyeIcon,
  ClockIcon,
  BookmarkIcon,
  ShareIcon,
  HashIcon,
  WeiboIcon,
  MessageCircleIcon,
  CopyIcon,
  CodeIcon,
  CoinsIcon,
  FileTextIcon,
  ToolIcon,
  TrendingUpIcon,
  LayersIcon,
  GitBranchIcon,
  FolderIcon
} from '@/components/icons'

type DetailedArticle = EnrichedArticle & {
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

// Props
interface Props {
  article: DetailedArticle
  show: boolean
}

const props = defineProps<Props>()

// Emits
interface Emits {
  'close': []
  'bookmark': [articleId: string]
  'share': [article: DetailedArticle, platform: string]
}

const emit = defineEmits<Emits>()

// 响应式数据
const showShareMenu = ref(false)
const shareNotice = ref('')

// 计算属性
const article = computed(() => props.article)
const contentParagraphs = computed(() => {
  const source = article.value.content || article.value.summary || article.value.excerpt || ''
  return source
    .split(/\n{2,}|\r?\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
})

// 事件处理
const handleOverlayClick = () => {
  emit('close')
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.onerror = null
  target.src = defaultArticleImage
}

const handleAuthorAvatarError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.onerror = null
  target.src = defaultAvatar
}

const handleBookmark = () => {
  emit('bookmark', props.article.id)
}

const toggleShare = () => {
  showShareMenu.value = !showShareMenu.value
}

const handleShare = (platform: string) => {
  if (platform === 'copy') {
    void navigator.clipboard?.writeText(window.location.href)
    shareNotice.value = '链接已复制'
    window.setTimeout(() => {
      shareNotice.value = ''
    }, 1800)
  }
  emit('share', props.article, platform)
  showShareMenu.value = false
}

const filterByTag = (_tag: string) => {}

const formatDate = (date?: string | Date) => {
  if (!date) return '未知'
  const value = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - value.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays} 天前`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} 周前`
  } else {
    return value.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

const formatNumber = (num?: number) => {
  if (typeof num !== 'number') {
    return '0'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, Component> = {
    '技术深度': CodeIcon,
    'DeFi协议': CoinsIcon,
    '智能合约': FileTextIcon,
    '开发实践': ToolIcon,
    '行业分析': TrendingUpIcon,
    '区块链基础': LayersIcon,
    '共识算法': GitBranchIcon,
    '项目分享': FolderIcon
  }
  return iconMap[category] || FileTextIcon
}

const getDifficultyLabel = (difficulty?: string) => {
  const labelMap: Record<string, string> = {
    'beginner': '入门',
    'intermediate': '中级',
    'advanced': '高级',
    'expert': '专家'
  }
  return labelMap[difficulty || 'intermediate'] || '中级'
}

// 点击外部关闭分享菜单
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  if (!target.closest('.share-dropdown')) {
    showShareMenu.value = false
  }
})

</script>

<style scoped>
.article-modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50;
}

.article-modal {
  @apply bg-white rounded-xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.header-info {
  @apply flex items-center gap-3;
}

.category-badge {
  @apply inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium;
}

.category-icon {
  @apply w-4 h-4;
}

.featured-badge {
  @apply inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium;
}

.featured-icon {
  @apply w-4 h-4;
}

.close-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600;
}

.article-header {
  @apply p-6 border-b border-gray-200;
}

.article-title {
  @apply text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight;
}

.article-meta {
  @apply flex flex-col md:flex-row md:items-center md:justify-between gap-4;
}

.author-info {
  @apply flex items-center gap-3;
}

.author-avatar {
  @apply w-12 h-12 rounded-full object-cover;
}

.author-details {
  @apply flex flex-col;
}

.author-name {
  @apply font-medium text-gray-900;
}

.publish-date {
  @apply text-sm text-gray-600;
}

.article-stats {
  @apply flex items-center gap-4;
}

.stat-item {
  @apply flex items-center gap-1 text-sm text-gray-600;
}

.stat-icon {
  @apply w-4 h-4;
}

.article-image {
  @apply relative h-64 md:h-80 overflow-hidden rounded-t-xl;
}

.article-image img {
  @apply w-full h-full object-cover;
}

.image-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6;
}

.overlay-content {
  @apply flex items-center gap-4 text-white;
}

.difficulty-badge {
  @apply px-2 py-1 rounded text-xs font-medium;
}

.difficulty-beginner {
  @apply bg-green-500/80;
}

.difficulty-intermediate {
  @apply bg-yellow-500/80;
}

.difficulty-advanced {
  @apply bg-orange-500/80;
}

.difficulty-expert {
  @apply bg-red-500/80;
}

.read-time-overlay {
  @apply text-sm text-white/90;
}

.article-tags {
  @apply flex flex-wrap gap-2 p-6 border-b border-gray-200;
}

.tag-button {
  @apply inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors;
}

.tag-icon {
  @apply w-3 h-3;
}

.article-summary {
  @apply p-6 border-b border-gray-200;
}

.summary-title {
  @apply text-lg font-semibold text-gray-900 mb-3;
}

.summary-content {
  @apply text-gray-700 leading-relaxed;
}

.article-content {
  @apply p-6;
}

.content-text {
  @apply text-gray-700 leading-relaxed space-y-4;
}

.interaction-stats {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50;
}

.stat-card {
  @apply text-center;
}

.stat-value {
  @apply text-2xl font-bold text-blue-600;
}

.stat-label {
  @apply text-sm text-gray-600 mt-1;
}

.modal-footer {
  @apply p-6 border-t border-gray-200 space-y-6;
}

.footer-actions {
  @apply flex flex-wrap gap-3;
}

.action-button {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors;
}

.action-button.bookmarked {
  @apply bg-yellow-50 border-yellow-300 text-yellow-600;
}

.action-icon {
  @apply w-4 h-4;
}

.action-count {
  @apply text-sm opacity-75;
}

.share-dropdown {
  @apply relative;
}

.share-notice {
  @apply inline-flex items-center px-3 py-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg;
}

.share-menu {
  @apply absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-32;
}

.share-option {
  @apply flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left;
}

.share-icon {
  @apply w-4 h-4;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .article-modal {
    @apply max-w-full max-h-[95vh];
  }
  
  .modal-header,
  .article-header,
  .article-summary,
  .article-content,
  .modal-footer {
    @apply p-4;
  }
  
  .article-title {
    @apply text-xl;
  }
  
  .article-meta {
    @apply flex-col items-start;
  }
  
  .article-stats {
    @apply self-stretch justify-between;
  }
  
  .interaction-stats {
    @apply grid-cols-2 gap-3 p-4;
  }
  
  .footer-actions {
    @apply gap-2;
  }
  
  .action-button {
    @apply px-3 py-2 text-sm;
  }
  
}
</style>
