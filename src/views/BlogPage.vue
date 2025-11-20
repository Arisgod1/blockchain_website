<template>
  <div class="blog-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">
            学术博客
          </h1>
          <p class="page-subtitle">
            深入探讨区块链技术，分享开发经验与研究心得
          </p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalArticles }}</span>
            <span class="stat-label">技术文章</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalAuthors }}</span>
            <span class="stat-label">专业作者</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalViews }}</span>
            <span class="stat-label">总浏览量</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalLikes }}</span>
            <span class="stat-label">总点赞数</span>
          </div>
        </div>
      </div>
      
      <!-- 快速操作栏 -->
      <div class="quick-actions">
        <button
          class="action-btn"
          :class="{ active: showFilter }"
          @click="toggleFilter"
        >
          <FilterIcon />
          筛选
        </button>
        <button
          class="action-btn"
          :class="{ active: viewMode === 'list' }"
          @click="toggleView"
        >
          <ListIcon />
          列表
        </button>
        <button
          class="action-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="toggleView"
        >
          <GridIcon />
          网格
        </button>
        <button
          class="action-btn"
          :class="{ active: showBookmarkedOnly }"
          @click="toggleBookmark"
        >
          <BookmarkIcon />
          收藏
        </button>
      </div>
    </div>

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
      <div
        v-if="usingFallback"
        class="fallback-banner"
      >
        当前展示的是离线缓存数据，后台服务恢复后会自动刷新。
      </div>

      <!-- 分类标签云 -->
      <div
        v-if="showCategoryCloud"
        class="category-cloud"
      >
        <div class="cloud-header">
          <h3 class="cloud-title">
            热门分类
          </h3>
          <button
            class="toggle-cloud"
            @click="toggleCategoryCloud"
          >
            <ChevronUpIcon v-if="showCategoryCloud" />
            <ChevronDownIcon v-else />
          </button>
        </div>
        <div
          v-show="showCategoryCloud"
          class="cloud-tags"
        >
          <button
            v-for="category in popularCategories"
            :key="category.name"
            :class="['cloud-tag', { active: selectedCategory === category.name }]"
            :style="{ fontSize: `${Math.max(0.9, Math.min(1.6, category.weight))}rem` }"
            @click="selectCategory(category.name)"
          >
            <component
              :is="category.icon"
              v-if="category.icon"
              class="tag-icon"
            />
            {{ category.name }}
            <span class="tag-count">{{ category.count }}</span>
          </button>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="article-container">
        <!-- 加载状态 -->
        <div
          v-if="isLoading && !hasLoadedOnce"
          class="loading-state"
        >
          <div class="loading-spinner" />
          <p>加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div
          v-else-if="errorMessage && !hasArticles"
          class="error-state"
        >
          <p class="error-text">
            {{ errorMessage }}
          </p>
          <button
            class="reset-all-btn"
            @click="loadArticles({ force: true })"
          >
            <RotateCcwIcon />
            重试
          </button>
        </div>

        <!-- 空状态 -->
        <div
          v-else-if="!hasArticles"
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
        <div v-else>
          <transition
            name="fade"
            appear
          >
            <div
              v-if="isLoading && hasLoadedOnce"
              class="grid-overlay"
            >
              <div class="loading-spinner" />
              <p>正在刷新文章列表...</p>
            </div>
          </transition>

          <div :class="['article-grid', `view-${viewMode}`]">
            <ArticleCard
              v-for="article in paginatedArticles"
              :key="article.id"
              :article="article"
              :view-mode="viewMode"
              @select="openArticle"
              @like="handleCardLike"
              @share="handleCardShare"
            />
          </div>
        </div>

        <!-- 分页导航 -->
        <div
          v-if="hasArticles && totalPages > 1"
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
              v-for="(page, index) in visiblePages"
              :key="`${page}-${index}`"
              class="pagination-number"
              :class="{ active: typeof page === 'number' && page === currentPage }"
              :disabled="page === '...'"
              @click="handlePageIndicatorClick(page)"
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
      :article="selectedArticle!"
      :show="showArticleModal"
      @close="closeArticle"
      @like="handleModalLike"
      @bookmark="handleBookmark"
      @share="handleModalShare"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ArticleCard from '@/components/blog/ArticleCard.vue'
import BlogFilter from '@/components/blog/BlogFilter.vue'
import ArticleDetailModal from '@/components/blog/ArticleDetailModal.vue'
import { getArticles } from '@/api/article'
import type { Article, ArticlePage } from '@/types/entities'

// 图标组件
const FilterIcon = () => import('@/components/icons').then(m => m.FilterIcon)
const ListIcon = () => import('@/components/icons').then(m => m.ListIcon)
const GridIcon = () => import('@/components/icons').then(m => m.GridIcon)
const BookmarkIcon = () => import('@/components/icons').then(m => m.BookmarkIcon)
const XIcon = () => import('@/components/icons').then(m => m.XIcon)
const ChevronUpIcon = () => import('@/components/icons').then(m => m.ChevronUpIcon)
const ChevronDownIcon = () => import('@/components/icons').then(m => m.ChevronDownIcon)
const RotateCcwIcon = () => import('@/components/icons').then(m => m.RotateCcwIcon)
const EmptyIcon = () => import('@/components/icons').then(m => m.EmptyIcon)
const ChevronLeftIcon = () => import('@/components/icons').then(m => m.ChevronLeftIcon)
const ChevronRightIcon = () => import('@/components/icons').then(m => m.ChevronRightIcon)
const ArrowUpIcon = () => import('@/components/icons').then(m => m.ArrowUpIcon)

// Categories icons
const CodeIcon = () => import('@/components/icons').then(m => m.CodeIcon)
const CoinsIcon = () => import('@/components/icons').then(m => m.CoinsIcon)
const FileTextIcon = () => import('@/components/icons').then(m => m.FileTextIcon)
const ToolIcon = () => import('@/components/icons').then(m => m.ToolIcon)
const TrendingUpIcon = () => import('@/components/icons').then(m => m.TrendingUpIcon)
const LayersIcon = () => import('@/components/icons').then(m => m.LayersIcon)
const GitBranchIcon = () => import('@/components/icons').then(m => m.GitBranchIcon)
const FolderIcon = () => import('@/components/icons').then(m => m.FolderIcon)

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

const router = useRouter()

const ARTICLES_CACHE_KEY = 'articles:list-cache'

interface BlogFilterPayload {
  searchQuery: string
  category: string
  tags: string[]
  author: string
  dateRange: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  difficulties: string[]
  minReadTime: number
  featuredOnly: boolean
}

const defaultFilters: BlogFilterPayload = {
  searchQuery: '',
  category: 'all',
  tags: [],
  author: '',
  dateRange: '',
  sortBy: 'publishedAt',
  sortOrder: 'desc',
  difficulties: [],
  minReadTime: 1,
  featuredOnly: false
}

// 响应式数据
const showFilter = ref(false)
const showCategoryCloud = ref(true)
const viewMode = ref<'grid' | 'list'>('grid')
const showBookmarkedOnly = ref(false)
const showScrollTop = ref(false)
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const selectedArticle = ref<Article | null>(null)
const showArticleModal = ref(false)
const errorMessage = ref('')
const hasLoadedOnce = ref(false)
const usingFallback = ref(false)

// 文章数据
const articles = ref<Article[]>([])
const filteredArticles = ref<Article[]>([])
const totalElements = ref(0)
const serverTotalPages = ref(0)
const activeFilters = ref<BlogFilterPayload>({ ...defaultFilters })

// 计算属性
const totalArticles = computed(() => totalElements.value || articles.value.length)
const totalAuthors = computed(() => new Set(articles.value.map(a => a.author.id)).size)
const totalViews = computed(() => articles.value.reduce((sum, a) => sum + a.views, 0))
const totalLikes = computed(() => articles.value.reduce((sum, a) => sum + a.likes, 0))

const hasArticles = computed(() => filteredArticles.value.length > 0)

const totalPages = computed(() => {
  if (usingFallback.value) {
    return Math.max(1, Math.ceil(filteredArticles.value.length / pageSize.value))
  }
  return Math.max(1, serverTotalPages.value || 1)
})

const paginatedArticles = computed(() => {
  if (usingFallback.value) {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredArticles.value.slice(start, start + pageSize.value)
  }
  return filteredArticles.value
})

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

const handlePageIndicatorClick = (indicator: number | string) => {
  if (typeof indicator === 'number') {
    changePage(indicator)
  }
}

// 模拟数据
const popularCategories = ref([
  { name: '技术深度', count: 35, weight: 1.4, icon: CodeIcon },
  { name: 'DeFi协议', count: 28, weight: 1.3, icon: CoinsIcon },
  { name: '智能合约', count: 32, weight: 1.35, icon: FileTextIcon },
  { name: '开发实践', count: 25, weight: 1.2, icon: ToolIcon },
  { name: '行业分析', count: 20, weight: 1.1, icon: TrendingUpIcon },
  { name: '区块链基础', count: 18, weight: 1.0, icon: LayersIcon },
  { name: '共识算法', count: 15, weight: 0.9, icon: GitBranchIcon },
  { name: '项目分享', count: 22, weight: 1.15, icon: FolderIcon }
])

const selectedCategory = ref('')

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

const toggleBookmark = () => {
  showBookmarkedOnly.value = !showBookmarkedOnly.value
  applyFilters({ resetPage: true })
}

const toggleCategoryCloud = () => {
  showCategoryCloud.value = !showCategoryCloud.value
}

const selectCategory = (category: string) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category
  applyFilters({ resetPage: true })
}

const handleFilterChange = (filters: BlogFilterPayload) => {
  activeFilters.value = { ...filters }
  currentPage.value = 1
  loadArticles({ resetPage: true })
}

const findArticleById = (articleId: string | number) => {
  return articles.value.find(article => String(article.id) === String(articleId))
}

const syncSelectedArticle = (articleId: string | number, source: Article) => {
  if (selectedArticle.value && String(selectedArticle.value.id) === String(articleId) && selectedArticle.value !== source) {
    Object.assign(selectedArticle.value, source)
  }
}

const toggleArticleLike = (article: Article) => {
  article.isLiked = !article.isLiked
  const delta = article.isLiked ? 1 : -1
  article.likes = Math.max(0, (article.likes || 0) + delta)
}

const handleCardLike = (article: Article) => {
  toggleArticleLike(article)
  syncSelectedArticle(article.id, article)
}

const handleModalLike = (articleId: string) => {
  const target = findArticleById(articleId)
  if (target) {
    toggleArticleLike(target)
    syncSelectedArticle(articleId, target)
  } else if (selectedArticle.value && String(selectedArticle.value.id) === String(articleId)) {
    toggleArticleLike(selectedArticle.value)
  }
}

const handleBookmark = (articleId: string) => {
  const target = findArticleById(articleId)
  if (target) {
    target.bookmarked = !target.bookmarked
    syncSelectedArticle(articleId, target)
  } else if (selectedArticle.value && String(selectedArticle.value.id) === String(articleId)) {
    selectedArticle.value.bookmarked = !selectedArticle.value.bookmarked
  }
}

const handleShareCommon = (article: Article, platform: string) => {
  console.log('分享文章:', article.title, '渠道:', platform)
}

const handleCardShare = (article: Article) => {
  handleShareCommon(article, 'card')
}

const handleModalShare = (article: Article, platform: string) => {
  handleShareCommon(article, platform)
}

const openArticle = (article: Article) => {
  selectedArticle.value = article
  showArticleModal.value = true
  // 更新浏览量
  article.views += 1
  router.push(`/blog/${article.id}`)
}

const closeArticle = () => {
  showArticleModal.value = false
  selectedArticle.value = null
}

const changePage = (page: number) => {
  if (page === currentPage.value || page < 1 || page > totalPages.value) return
  currentPage.value = page
  if (!usingFallback.value) {
    loadArticles()
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetAllFilters = () => {
  selectedCategory.value = ''
  showBookmarkedOnly.value = false
  currentPage.value = 1
  activeFilters.value = { ...defaultFilters }
  // 重置筛选器
  const instance = blogFilterRef.value
  if (instance?.resetFilters) {
    instance.resetFilters()
  }
  loadArticles({ resetPage: true })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500
}

const cacheArticlesSnapshot = (payload: ArticlePage) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ARTICLES_CACHE_KEY, JSON.stringify(payload))
  } catch (error) {
    console.warn('缓存文章列表失败', error)
  }
}

const hydrateArticlesFromCache = (silent = false) => {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(ARTICLES_CACHE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as ArticlePage
    if (!parsed?.content?.length) return false
    applyArticleResponse({ ...parsed, fromFallback: true }, { resetPage: true })
    if (!silent) {
      errorMessage.value = ''
    }
    return true
  } catch (error) {
    console.warn('读取文章缓存失败', error)
    return false
  }
}

const buildArticleQuery = () => {
  const filters = activeFilters.value
  const params: Record<string, unknown> = {
    page: Math.max(currentPage.value - 1, 0),
    size: pageSize.value,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder
  }

  if (filters.searchQuery) params.keyword = filters.searchQuery
  if (filters.category && filters.category !== 'all') params.category = filters.category
  if (filters.tags?.length) params.tags = filters.tags.join(',')
  if (filters.author) params.author = filters.author
  if (filters.dateRange) params.dateRange = filters.dateRange
  if (filters.difficulties?.length) params.difficulty = filters.difficulties.join(',')
  if (filters.minReadTime > 1) params.minReadTime = filters.minReadTime
  if (filters.featuredOnly) params.featured = true

  return params
}

const applyArticleResponse = (response: ArticlePage, options: { resetPage?: boolean } = {}) => {
  articles.value = response.content ?? []
  totalElements.value = response.totalElements ?? articles.value.length
  serverTotalPages.value = response.totalPages ?? 0
  usingFallback.value = Boolean(response.fromFallback)

  if (!usingFallback.value) {
    const resolvedPage = response.page ?? (response.number ?? 0) + 1
    currentPage.value = options.resetPage ? 1 : resolvedPage
  } else if (options.resetPage) {
    currentPage.value = 1
  }

  applyFilters({ resetPage: usingFallback.value })
}

const loadArticles = async (options: { resetPage?: boolean; force?: boolean } = {}) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    if (usingFallback.value && !options.force) {
      // 当处于离线模式时不重复请求，除非显式强制刷新
      applyFilters()
      return
    }

    const params = buildArticleQuery()
    const response = await getArticles(params)
    applyArticleResponse(response, options)
    cacheArticlesSnapshot(response)
  } catch (error) {
    console.error('获取文章失败:', error)
    const message = error instanceof Error ? error.message : '获取文章失败'
    errorMessage.value = message

    if (!articles.value.length) {
      const restored = hydrateArticlesFromCache(true)
      if (restored) {
        usingFallback.value = true
        errorMessage.value = '当前展示离线缓存数据'
      }
    }
  } finally {
    isLoading.value = false
    hasLoadedOnce.value = true
  }
}

const applyFilters = (options: { resetPage?: boolean } = {}) => {
  let filtered = [...articles.value]

  // 分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(article => 
      article.category === selectedCategory.value
    )
  }

  // 收藏筛选
  if (showBookmarkedOnly.value) {
    filtered = filtered.filter(article => article.bookmarked)
  }

  filteredArticles.value = filtered
  if (options.resetPage) {
    currentPage.value = 1
  }
}

// 生命周期
onMounted(() => {
  if (hydrateArticlesFromCache(true)) {
    hasLoadedOnce.value = true
  }
  loadArticles({ resetPage: true })
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 组件引用
type BlogFilterPublicInstance = {
  resetFilters?: () => void
}

const blogFilterRef = ref<BlogFilterPublicInstance | null>(null)
</script>

<style scoped>
.blog-page {
  @apply min-h-screen bg-gray-50;
}

.page-header {
  @apply bg-white shadow-sm border-b border-gray-200;
}

.header-content {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8;
}

.header-text {
  @apply text-center mb-6;
}

.page-title {
  @apply text-4xl font-bold text-gray-900 mb-2;
}

.page-subtitle {
  @apply text-lg text-gray-600;
}

.header-stats {
  @apply grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto;
}

.stat-item {
  @apply text-center;
}

.stat-number {
  @apply block text-3xl font-bold text-blue-600;
}

.stat-label {
  @apply text-sm text-gray-600;
}

.quick-actions {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6;
  @apply flex justify-center gap-2;
}

.action-btn {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors;
}

.action-btn.active {
  @apply bg-blue-50 border-blue-500 text-blue-600;
}

.filter-sidebar {
  @apply fixed top-0 right-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto;
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
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8;
}

.main-content.with-sidebar {
  @apply mr-96;
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
  @apply grid gap-6;
}

.article-grid.view-grid {
  @apply md:grid-cols-2 lg:grid-cols-3;
}

.article-grid.view-list {
  @apply md:grid-cols-1;
}

.pagination {
  @apply flex items-center justify-center gap-4 pt-8;
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
  @apply fixed bottom-6 right-6 flex flex-col gap-3 z-40;
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
  .header-stats {
    @apply grid-cols-2 gap-4;
  }
  
  .stat-number {
    @apply text-2xl;
  }
  
  .quick-actions {
    @apply flex-wrap gap-2;
  }
  
  .action-btn {
    @apply px-3 py-2 text-sm;
  }
  
  .filter-sidebar {
    @apply w-full;
  }
  
  .main-content.with-sidebar {
    @apply mr-0;
  }
  
  .article-grid.view-grid {
    @apply grid-cols-1;
  }
  
  .pagination {
    @apply gap-2;
  }
  
  .pagination-numbers {
    @apply gap-1;
  }
  
  .pagination-number {
    @apply w-8 h-8 text-sm;
  }
  
  .fixed-actions {
    @apply bottom-4 right-4;
  }
  
  .fixed-btn {
    @apply w-10 h-10;
  }
}
</style>