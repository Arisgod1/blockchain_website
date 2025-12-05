<template>
  <article
    class="article-card"
    @click="navigateToArticle"
  >
    <div class="article-image">
      <img 
        :src="avatar||article.coverImage || avatar" 
        :alt="article.title"
        loading="lazy"
        @error="handleImageError"
      >
      <div
        class="article-category"
        :class="`category-${getCategoryClass(article.category)}`"
      >
        {{ article.category }}
      </div>
      <div
        v-if="article.isFeatured"
        class="featured-badge"
      >
        <StarIcon />
        精选
      </div>
    </div>
    
    <div class="article-content">
      <header class="article-header">
        <h2 class="article-title">
          {{ article.title }}
        </h2>
        <div class="article-meta">
          <div class="author-info">
            <img 
              :src="article.author?.avatar || defaultAvatar" 
              :alt="article.author?.name || '匿名作者'" 
              class="author-avatar"
              @error="handleAuthorAvatarError"
            >
            <span class="author-name">{{ article.author?.name || '匿名作者' }}</span>
          </div>
          <time class="article-date">{{ formatDate(article.publishedAt) }}</time>
          <span class="reading-time">{{ article.readTime || '5' }}分钟阅读</span>
        </div>
      </header>
      
      <p class="article-excerpt">
        {{ article.excerpt || article.description }}
      </p>
      
      <footer class="article-footer">
        <div class="article-tags">
          <span 
            v-for="tag in (article.tags || []).slice(0, 3)" 
            :key="tag"
            class="tag"
            @click.stop="tagClicked(tag)"
          >
            {{ tag }}
          </span>
          <span 
            v-if="(article.tags || []).length > 3" 
            class="tag tag-more"
            @click.stop
          >
            +{{ (article.tags || []).length - 3 }}
          </span>
        </div>
        
        <div class="article-stats">
          <span
            class="stat"
            :title="`${article.views || 0} 次浏览`"
          >
            <EyeIcon class="stat-icon" />
            {{ formatNumber(article.views || 0) }}
          </span>
          <span
            class="stat"
            :title="`${article.likes || 0} 个赞`"
          >
            <HeartIcon 
              class="stat-icon" 
              :class="{ liked: article.isLiked }"
            />
            {{ formatNumber(article.likes || 0) }}
          </span>
          <span
            class="stat"
            :title="`${article.comments || 0} 条评论`"
          >
            <MessageCircleIcon class="stat-icon" />
            {{ formatNumber(article.comments || 0) }}
          </span>
          <button 
            class="share-btn"
            title="分享文章"
            @click.stop="shareArticle"
          >
            <ShareIcon />
          </button>
        </div>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Article } from '@/types/entities'
import avatar from '@/assets/richang2.png'
import defaultAvatar from '@/assets/zhaoshuyang.png'
interface Props {
  article: Article
}

interface Emits {
  select: [article: Article]
  tagClick: [tag: string]
  share: [article: Article]
}

const props = defineProps<Props>()
const article = computed(() => props.article)
const emit = defineEmits<Emits>()

// 方法
const navigateToArticle = () => {
  emit('select', props.article)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '未知日期'
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks}周前`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months}个月前`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years}年前`
    }
  } catch {
    return dateString
  }
}

const formatNumber = (num: number) => {
  if (num < 1000) return num.toString()
  if (num < 1000000) return `${(num / 1000).toFixed(1)}k`
  return `${(num / 1000000).toFixed(1)}M`
}

const getCategoryClass = (category: string) => {
  const categoryMap: Record<string, string> = {
    '技术深度': 'tech',
    '开发实践': 'practice', 
    'DeFi协议': 'defi',
    '行业分析': 'analysis',
    '区块链基础': 'blockchain',
    '智能合约': 'contract',
    '共识算法': 'consensus',
    '项目分享': 'project',
    '学术研究': 'research'
  }
  return categoryMap[category] || 'default'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/default-article.jpg'
}

const handleAuthorAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/default-avatar.png'
}

const tagClicked = (tag: string) => {
  emit('tagClick', tag)
}

const shareArticle = () => {
  emit('share', props.article)
}
</script>

<style scoped>
.article-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1;
}

.article-image {
  @apply relative h-48 overflow-hidden;
}

.article-image img {
  @apply w-full h-full object-cover transition-transform duration-300;
}

.article-card:hover .article-image img {
  @apply scale-110;
}

.article-category {
  @apply absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white;
}

.category-tech {
  @apply bg-blue-500;
}

.category-practice {
  @apply bg-green-500;
}

.category-defi {
  @apply bg-purple-500;
}

.category-analysis {
  @apply bg-orange-500;
}

.category-blockchain {
  @apply bg-indigo-500;
}

.category-contract {
  @apply bg-red-500;
}

.category-consensus {
  @apply bg-cyan-500;
}

.category-project {
  @apply bg-pink-500;
}

.category-research {
  @apply bg-yellow-500;
}

.category-default {
  @apply bg-gray-500;
}

.featured-badge {
  @apply absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium;
}

.article-content {
  @apply p-6 space-y-4;
}

.article-header {
  @apply space-y-3;
}

.article-title {
  @apply text-xl font-bold text-gray-900 line-clamp-2 leading-tight;
}

.article-meta {
  @apply flex items-center gap-4 text-sm text-gray-600;
}

.author-info {
  @apply flex items-center gap-2;
}

.author-avatar {
  @apply w-6 h-6 rounded-full object-cover;
}

.author-name {
  @apply font-medium;
}

.article-date,
.reading-time {
  @apply text-gray-500;
}

.article-excerpt {
  @apply text-gray-600 line-clamp-3 leading-relaxed;
}

.article-footer {
  @apply flex items-start justify-between gap-4;
}

.article-tags {
  @apply flex flex-wrap gap-2 flex-1;
}

.tag {
  @apply px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded cursor-pointer hover:bg-gray-200 transition-colors;
}

.tag-more {
  @apply bg-gray-200 text-gray-600 cursor-default;
}

.article-stats {
  @apply flex items-center gap-3 text-sm text-gray-600;
}

.stat {
  @apply flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors;
}

.stat-icon {
  @apply w-4 h-4;
}

.stat-icon.liked {
  @apply text-red-500;
}

.share-btn {
  @apply w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors;
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .article-card {
    @apply mx-2;
  }
  
  .article-content {
    @apply p-4 space-y-3;
  }
  
  .article-title {
    @apply text-lg;
  }
  
  .article-meta {
    @apply flex-col items-start gap-2;
  }
  
  .article-footer {
    @apply flex-col items-stretch gap-3;
  }
  
  .article-tags {
    @apply order-2;
  }
  
  .article-stats {
    @apply justify-between order-1;
  }
}
</style>