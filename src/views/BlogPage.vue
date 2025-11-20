<template>
  <div class="blog-page">
    <!-- 页面头部 -->
    <header class="gradient-hero flowing-gradient-aurora overflow-hidden page-header">
      <div class="hero-stars">
        <span style="top:18%;left:5%;animation-duration:17s" />
        <span style="top:25%;left:82%;animation-duration:21s;animation-delay:1.5s" />
        <span style="top:64%;left:28%;animation-duration:15s;animation-delay:2.2s" />
        <span style="top:78%;left:70%;animation-duration:23s;animation-delay:3s" />
      </div>
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
    </header>

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
            @like="handleLike"
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
      @like="handleLike"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ArticleCard from '@/components/blog/ArticleCard.vue'
import BlogFilter from '@/components/blog/BlogFilter.vue'
import ArticleDetailModal from '@/components/blog/ArticleDetailModal.vue'
import { getArticles } from '@/api/article'
import type { Article } from '@/types/entities'
import {
  FilterIcon,
  ListIcon,
  GridIcon,
  BookmarkIcon,
  XIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  RotateCcwIcon,
  EmptyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  CodeIcon,
  CoinsIcon,
  FileTextIcon,
  ToolIcon,
  TrendingUpIcon,
  LayersIcon,
  GitBranchIcon,
  FolderIcon
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
  tags: string[]
  author: string
  dateRange: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  difficulties: string[]
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

type ShareableArticle = Article & {
  difficulty?: string
  thumbnail?: string
  featured?: boolean
  liked?: boolean
}

const router = useRouter()
const activeFilters = ref<BlogFilterOptions | null>(null)

// 响应式数据
const showFilter = ref(false)
const showCategoryCloud = ref(true)
const viewMode = ref<'grid' | 'list'>('grid')
const showBookmarkedOnly = ref(false)
const showScrollTop = ref(false)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const selectedArticle = ref<ShareableArticle | null>(null)
const showArticleModal = ref(false)

// 文章数据
const articles = ref<Article[]>([])
const filteredArticles = ref<Article[]>([])

// 计算属性
const totalArticles = computed(() => articles.value.length)
const totalAuthors = computed(() => new Set(articles.value.map(a => a.author.id)).size)
const totalViews = computed(() => articles.value.reduce((sum, a) => sum + a.views, 0))
const totalLikes = computed(() => articles.value.reduce((sum, a) => sum + a.likes, 0))

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / pageSize.value))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredArticles.value.slice(start, end)
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
  applyFilters()
}

const toggleCategoryCloud = () => {
  showCategoryCloud.value = !showCategoryCloud.value
}

const selectCategory = (category: string) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category
  applyFilters()
}

const handleFilterChange = (filters: BlogFilterOptions) => {
  activeFilters.value = filters
  fetchFilteredArticles(filters)
}

const handleLike = (articleId: string) => {
  const article = articles.value.find(a => a.id === articleId)
  if (article) {
    article.likes = article.isLiked ? article.likes - 1 : article.likes + 1
    article.isLiked = !article.isLiked
  }
}

const handleBookmark = (articleId: string) => {
  const article = articles.value.find(a => a.id === articleId)
  if (article) {
    article.bookmarked = !article.bookmarked
  }
}

const handleShare = (article: ShareableArticle, platform = 'general') => {
  // 分享逻辑
  console.log('分享文章:', article.title, '到:', platform)
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
  router.push(`/blog/${article.id}`)
}

const closeArticle = () => {
  showArticleModal.value = false
  selectedArticle.value = null
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const resetAllFilters = () => {
  selectedCategory.value = ''
  showBookmarkedOnly.value = false
  currentPage.value = 1
  activeFilters.value = null
  // 重置筛选器
  if (blogFilterRef.value?.resetFilters) {
    blogFilterRef.value.resetFilters()
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500
}

// 数据获取
const fetchArticles = async () => {
  loading.value = true
  try {
    const res = await getArticles({ page: currentPage.value - 1, size: pageSize.value })
    if (Array.isArray(res)) {
      articles.value = res
    } else {
      articles.value = res.content || []
    }
    filteredArticles.value = [...articles.value]
  } catch (error) {
    console.error('获取文章失败:', error)
    // 如果 API 失败，client.ts 已经处理了 Mock 数据降级
    // 这里可以保留 generateMockArticles 作为最后的兜底，或者直接依赖 client.ts
    if (articles.value.length === 0) {
       articles.value = generateMockArticles()
       filteredArticles.value = [...articles.value]
    }
  } finally {
    loading.value = false
  }
}

const fetchFilteredArticles = async (filters: BlogFilterOptions) => {
  // 根据筛选条件过滤文章
  // 实际项目中应该调用 API
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    applyFilters(filters)
  } catch (error) {
    console.error('筛选文章失败:', error)
  } finally {
    loading.value = false
  }
}

const applyFilters = (filtersOverride?: BlogFilterOptions | null) => {
  const filters = filtersOverride ?? activeFilters.value
  let filtered = [...articles.value]

  const mappedFilterCategory = filters?.category && filters.category !== 'all'
    ? (categoryValueMap[filters.category] || filters.category)
    : ''
  const effectiveCategory = selectedCategory.value || mappedFilterCategory

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

  if (filters?.tags?.length) {
    filtered = filtered.filter(article =>
      filters.tags.every(tag => article.tags.includes(tag))
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

  if (showBookmarkedOnly.value) {
    filtered = filtered.filter(article => article.bookmarked)
  }

  filteredArticles.value = filtered
  currentPage.value = 1
}

// 生成模拟文章数据
const generateMockArticles = (): Article[] => {
  const authors = [
    { id: 1, name: '张三', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face' },
    { id: 2, name: '李四', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face' },
    { id: 3, name: '王五', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face' }
  ]

  const categories = ['技术深度', 'DeFi协议', '智能合约', '开发实践', '行业分析', '区块链基础', '共识算法', '项目分享']
  const tags = ['Solidity', 'DeFi', 'NFT', '智能合约', 'Web3', '共识算法', '加密货币', '区块链', '安全', '钱包']

  return Array.from({ length: 48 }, (_, i) => {
    const author = authors[Math.floor(Math.random() * authors.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const articleTags = tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2)
    
    return {
      id: (i + 1).toString(),
      title: `深度解析：${category}技术应用与实践案例 ${i + 1}`,
      summary: `本文详细探讨了${category}在区块链领域的重要应用，包括技术原理、实施方案和最佳实践...`,
      content: '文章详细内容...',
      author,
      category,
      tags: articleTags,
      publishDate: new Date().toISOString().split('T')[0],
      updateDate: new Date().toISOString().split('T')[0],
      isPublished: true,
      publishedAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 90).toISOString(),
      readTime: Math.floor(Math.random() * 25) + 5,
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 200) + 20,
      comments: Math.floor(Math.random() * 50) + 5,
      isFeatured: Math.random() > 0.8,
      coverImage: `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop`,
      bookmarked: Math.random() > 0.7,
      isLiked: Math.random() > 0.6
    }
  })
}

// 生命周期
onMounted(() => {
  fetchArticles()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 组件引用
const blogFilterRef = ref()
</script>

<style scoped>
.blog-page {
  @apply min-h-screen bg-gray-50;
}

.page-header {
  @apply relative pb-6;
  border-bottom: none;
}

.header-content {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white;
}

.header-text {
  @apply text-center mb-6;
}

.page-title {
  @apply text-4xl font-bold text-white mb-2;
}

.page-subtitle {
  @apply text-lg text-blue-100;
}

.header-stats {
  @apply grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto;
}

.stat-item {
  @apply text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20;
}

.stat-number {
  @apply block text-3xl font-bold text-white;
}

.stat-label {
  @apply text-sm text-blue-100;
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