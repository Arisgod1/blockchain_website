<template>
  <div class="blog-page">
    <!-- 页面头部 -->
    <PublicGraphHero
      eyebrow="BLOG · 知识星图"
      title="把学习过程"
      accent="沉淀成可连接的知识"
      subtitle="文章记录团队的研究理解、工程实践和复盘经验。新成员可以沿着这些知识节点进入真实问题。"
      tone="cyan"
      :stats="blogHeroStats"
    />

    <div class="hero-quick-actions">
      <button
        class="hero-action-btn"
        :class="{ active: showFilter }"
        @click="toggleFilter"
      >
        <FilterIcon />
        筛选
      </button>
      <button
        class="hero-action-btn"
        :class="{ active: viewMode === 'list' }"
        @click="toggleView"
      >
        <ListIcon />
        列表
      </button>
      <button
        class="hero-action-btn"
        :class="{ active: viewMode === 'grid' }"
        @click="toggleView"
      >
        <GridIcon />
        网格
      </button>
    </div>

    <!-- 筛选抽屉遮罩 -->
    <div
      v-if="showFilter"
      class="filter-overlay md:hidden"
      @click="closeFilter"
    />

    <!-- 筛选侧边栏 -->
    <div
      v-if="showFilter"
      class="filter-sidebar"
    >
      <div class="filter-header">
        <h3 class="filter-title">
          筛选条件
        </h3>
        <button
          class="close-filter"
          @click="closeFilter"
        >
          <XIcon />
        </button>
      </div>
      <BlogFilter 
        ref="blogFilterRef" 
        @filter-change="handleFilterChange"
      />
    </div>

    <!-- 主内容区域 -->
    <div
      class="main-content"
      :class="{ 'with-sidebar': showFilter }"
    >
      <!-- 分类标签云 -->
   

      <!-- 文章列表 -->
      <div class="article-container">
        <!-- 加载状态 -->
        <div
          v-if="loading"
          class="loading-state"
        >
          <div class="loading-spinner" />
          <p>加载中...</p>
        </div>

        <!-- 空状态 -->
        <div
          v-else-if="filteredArticles.length === 0"
          class="empty-state"
        >
          <EmptyIcon class="empty-icon" />
          <h3 class="empty-title">
            暂无相关文章
          </h3>
          <p class="empty-text">
            请尝试调整筛选条件或搜索关键词
          </p>
          <button
            class="reset-all-btn"
            @click="resetAllFilters"
          >
            <RotateCcwIcon />
            重置所有筛选
          </button>
        </div>

        <!-- 文章网格/列表 -->
        <div
          v-else
          :class="['article-grid', `view-${viewMode}`]"
        >
          <ArticleCard
            v-for="article in paginatedArticles"
            :key="article.id"
            :article="article"
            :view-mode="viewMode"
            @article-click="openArticle"
            @bookmark="handleBookmark"
            @share="handleShare"
          />
        </div>

        <!-- 分页导航 -->
        <div
          v-if="filteredArticles.length > 0"
          class="pagination"
        >
          <button
            :disabled="currentPage === 1"
            class="pagination-btn"
            @click="changePage(currentPage - 1)"
          >
            <ChevronLeftIcon />
            上一页
          </button>
          
          <div class="pagination-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="['pagination-number', { active: page === currentPage }]"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            :disabled="currentPage === totalPages"
            class="pagination-btn"
            @click="changePage(currentPage + 1)"
          >
            下一页
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>

    <!-- 文章详情模态框 -->
    <ArticleDetailModal
      v-if="selectedArticle"
      :article="selectedArticle"
      :show="showArticleModal"
      @close="closeArticle"
      @bookmark="handleBookmark"
      @share="handleShare"
    />

    <!-- 固定按钮 -->
    <div class="fixed-actions">
      <button
        v-if="showScrollTop"
        class="fixed-btn scroll-top"
        @click="scrollToTop"
      >
        <ArrowUpIcon />
      </button>
      <button
        v-if="!showFilter"
        class="fixed-btn filter-toggle"
        @click="toggleFilter"
      >
        <FilterIcon />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import ArticleCard from '@/components/blog/ArticleCard.vue'
import BlogFilter from '@/components/blog/BlogFilter.vue'
import ArticleDetailModal from '@/components/blog/ArticleDetailModal.vue'
import PublicGraphHero from '@/components/common/PublicGraphHero.vue'
import { getArticles } from '@/api/article'
import type { Article, EnrichedArticle } from '@/types/entities'
import {
  FilterIcon,
  ListIcon,
  GridIcon,
  XIcon,
  RotateCcwIcon,
  EmptyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon
} from '@/components/icons'

// 页面元数据设置
onMounted(() => {
  document.title = '学术博客 - 大连理工大学区块链组'
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', '深入探讨区块链技术，分享开发经验与研究心得')
  } else {
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = '深入探讨区块链技术，分享开发经验与研究心得'
    document.head.appendChild(meta)
  }
})

interface BlogFilterOptions {
  searchQuery: string
  category: string
  author: string
  dateRange: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  minReadTime: number
  featuredOnly: boolean
}

const categoryValueMap: Record<string, string> = {
  tech: '技术深度',
  practice: '开发实践',
  defi: 'DeFi协议',
  analysis: '行业分析',
  blockchain: '区块链基础',
  contract: '智能合约',
  consensus: '共识算法',
  project: '项目分享',
  research: '学术研究',
  all: ''
}

const buildArticleQueryParams = () => {
  const params: Record<string, unknown> = {
    page: currentPage.value - 1,
    size: pageSize.value
  }

  const filters = activeFilters.value

  if (filters?.searchQuery) {
    params.keyword = filters.searchQuery
  }

  const mappedFilterCategory = filters?.category && filters.category !== 'all' ? filters.category : ''
  const categoryParam = mappedFilterCategory
  if (categoryParam) {
    params.category = categoryParam
  }

  if (filters?.sortBy) {
    params.sortBy = filters.sortBy
  }

  if (filters?.sortOrder) {
    params.sortOrder = filters.sortOrder
  }

  if (filters?.author) {
    params.author = filters.author
  }

  if (filters?.dateRange) {
    params.dateRange = filters.dateRange
  }

  if (filters?.featuredOnly) {
    params.featured = true
  }

  if (typeof filters?.minReadTime === 'number' && filters.minReadTime > 0) {
    params.minReadTime = filters.minReadTime
  }

  return params
}

type ShareableArticle = EnrichedArticle

const activeFilters = ref<BlogFilterOptions | null>(null)

// 响应式数据
const showFilter = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const showScrollTop = ref(false)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const selectedArticle = ref<ShareableArticle | null>(null)
const showArticleModal = ref(false)

// 文章数据
const articles = ref<Article[]>([])
const filteredArticles = ref<Article[]>([])
const totalElements = ref(0)

// 计算属性
const totalArticles = computed(() => totalElements.value || articles.value.length)
const totalAuthors = computed(() => {
  const authorIds = articles.value
    .map(article => article.author?.id)
    .filter((id): id is string | number => typeof id === 'string' || typeof id === 'number')
  return new Set(authorIds).size
})
const totalViews = computed(() => articles.value.reduce((sum, a) => sum + a.views, 0))
const totalLikes = computed(() => articles.value.reduce((sum, a) => sum + a.likes, 0))
const blogHeroStats = computed(() => [
  { label: '技术文章', value: totalArticles.value },
  { label: '专业作者', value: totalAuthors.value },
  { label: '总浏览量', value: totalViews.value },
  { label: '总点赞数', value: totalLikes.value }
])

const totalPages = computed(() => Math.max(1, Math.ceil((totalElements.value || filteredArticles.value.length || 1) / pageSize.value)))

const paginatedArticles = computed(() => filteredArticles.value)

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = 7

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  return pages
})

// 事件处理
const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

const closeFilter = () => {
  showFilter.value = false
}

const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}


const handleFilterChange = (filters: BlogFilterOptions) => {
  activeFilters.value = filters
  currentPage.value = 1
  void loadArticles()
}

const handleBookmark = (articleId: string) => {
  const article = articles.value.find(a => a.id === articleId)
  if (article) {
    article.bookmarked = !article.bookmarked
  }
  applyFilters()
}

const handleShare = (article: ShareableArticle, platform = 'general') => {
  const shareUrl = window.location.href
  if (platform === 'copy') {
    void navigator.clipboard?.writeText(shareUrl)
    return
  }
  if (navigator.share) {
    void navigator.share({
      title: article.title,
      text: article.summary || article.description || '',
      url: shareUrl
    })
  }
}

const openArticle = (article: Article) => {
  selectedArticle.value = {
    ...article,
    publishedAt: article.publishedAt || article.publishDate || new Date().toISOString(),
    thumbnail: article.image || article.coverImage || '/images/default-article.jpg',
    difficulty: (article as ShareableArticle).difficulty || 'intermediate'
  }
  showArticleModal.value = true
  // 更新浏览量
  article.views += 1
}

const closeArticle = () => {
  showArticleModal.value = false
  selectedArticle.value = null
}

const changePage = (page: number | string) => {
  if (typeof page !== 'number') return
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const resetAllFilters = () => {
  currentPage.value = 1
  activeFilters.value = null
  // 重置筛选器
  if (blogFilterRef.value?.resetFilters) {
    blogFilterRef.value.resetFilters()
  }
  void loadArticles()
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500
}

// 数据获取
const loadArticles = async () => {
  loading.value = true
  try {
    const res = await getArticles(buildArticleQueryParams())
    if (Array.isArray(res)) {
      articles.value = res
      totalElements.value = res.length
    } else {
      articles.value = res.content || []
      totalElements.value = res.totalElements || articles.value.length
    }
    applyFilters()
  } catch (error) {
    console.error('获取文章失败:', error)
    if (articles.value.length === 0) {
      applyFilters()
    }
  } finally {
    loading.value = false
  }
}

watch(currentPage, (newPage, oldPage) => {
  if (newPage !== oldPage) {
    void loadArticles()
  }
})

watch(pageSize, (newSize, oldSize) => {
  if (newSize !== oldSize) {
    currentPage.value = 1
    void loadArticles()
  }
})

const applyFilters = (filtersOverride?: BlogFilterOptions | null) => {
  const filters = filtersOverride ?? activeFilters.value
  let filtered = [...articles.value]

  // 默认只展示已发布文章
  filtered = filtered.filter(article => article.isPublished !== false)

  const mappedFilterCategory = filters?.category && filters.category !== 'all'
    ? (categoryValueMap[filters.category] || filters.category)
    : ''
  const effectiveCategory = mappedFilterCategory

  if (effectiveCategory) {
    filtered = filtered.filter(article => article.category === effectiveCategory)
  }

  if (filters?.searchQuery) {
    const keyword = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(keyword) ||
      article.summary.toLowerCase().includes(keyword) ||
      article.content.toLowerCase().includes(keyword)
    )
  }

  if (filters?.featuredOnly) {
    filtered = filtered.filter(article => article.isFeatured)
  }

  if (typeof filters?.minReadTime === 'number') {
    filtered = filtered.filter(article => article.readTime >= filters.minReadTime)
  }

  if (filters?.author) {
    filtered = filtered.filter(article => article.author?.name === filters.author)
  }

  filteredArticles.value = filtered
}

// 生命周期
onMounted(() => {
  loadArticles()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 组件引用
const blogFilterRef = ref()
</script>

<style scoped lang="postcss">
.blog-page {
  @apply min-h-screen bg-gray-50;
}

.hero-quick-actions {
  @apply mx-auto -mt-8 mb-8 flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm;
  width: min(calc(100% - 2rem), 72rem);
  position: relative;
  z-index: 2;
}

.hero-action-btn {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200;
  color: #334155;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.hero-action-btn:hover {
  background: #ecfeff;
  border-color: #67e8f9;
  color: #155e75;
}

.hero-action-btn.active {
  background: #0f172a;
  border-color: #0f172a;
  color: #fff;
  box-shadow: none;
}

.hero-action-btn :deep(svg) {
  width: 1rem;
  height: 1rem;
}

.filter-sidebar {
  @apply fixed top-0 right-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto;
  -webkit-overflow-scrolling: touch;
}

.filter-overlay {
  @apply fixed inset-0 bg-black/50 z-40;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.filter-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.filter-title {
  @apply text-lg font-semibold text-gray-900;
}

.close-filter {
  @apply w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600;
}

.main-content {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8;
}

@media (min-width: 1024px) {
  .main-content.with-sidebar {
    margin-right: 24rem;
  }
}

.category-cloud {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8;
}

.cloud-header {
  @apply flex items-center justify-between mb-4;
}

.cloud-title {
  @apply text-lg font-semibold text-gray-900;
}

.toggle-cloud {
  @apply w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100;
}

.cloud-tags {
  @apply flex flex-wrap gap-3;
}

.cloud-tag {
  @apply inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-full cursor-pointer transition-all hover:border-blue-500 hover:text-blue-600;
}

.cloud-tag.active {
  @apply bg-blue-500 text-white border-blue-500;
}

.tag-icon {
  @apply w-4 h-4;
}

.tag-count {
  @apply text-xs opacity-75 bg-white/20 px-1.5 py-0.5 rounded;
}

.article-container {
  @apply space-y-8;
}

.loading-state {
  @apply flex flex-col items-center justify-center py-12 space-y-4;
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-12 space-y-4;
}

.empty-icon {
  @apply w-16 h-16 text-gray-400;
}

.empty-title {
  @apply text-xl font-semibold text-gray-900;
}

.empty-text {
  @apply text-gray-600;
}

.reset-all-btn {
  @apply flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors;
}

.article-grid {
  @apply grid gap-4 md:gap-6;
}

.article-grid.view-grid {
  @apply sm:grid-cols-2 lg:grid-cols-3;
}

.article-grid.view-list {
  @apply md:grid-cols-1;
}

.pagination {
  @apply flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-8;
}

.pagination-btn {
  @apply flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.pagination-numbers {
  @apply flex gap-1;
}

.pagination-number {
  @apply w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors;
}

.pagination-number.active {
  @apply bg-blue-500 text-white border-blue-500;
}

.fixed-actions {
  @apply fixed bottom-6 right-6 flex flex-col gap-3 z-30;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.fixed-btn {
  @apply w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all;
}

.scroll-top {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.filter-toggle {
  @apply bg-gray-800 text-white hover:bg-gray-900;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .filter-sidebar {
    width: min(88vw, 360px);
  }

  .filter-header {
    @apply p-4;
  }

  .article-grid.view-grid {
    @apply grid-cols-1;
  }

  .pagination {
    @apply gap-2;
  }

  .pagination-numbers {
    @apply gap-1 flex-wrap justify-center;
  }

  .pagination-number {
    @apply w-9 h-9 text-sm;
  }

  .pagination-btn {
    @apply px-3 py-2 text-sm;
  }

  .fixed-actions {
    @apply bottom-4 right-4;
  }

  .fixed-btn {
    @apply w-11 h-11;
  }

  .hero-quick-actions {
    @apply mt-6 gap-2;
  }

  .hero-action-btn {
    @apply px-3 py-2 text-xs;
  }
}
</style>
