import apiService from '@/api/client'
import type { Article, ArticlePage } from '@/types/entities'

const DEFAULT_ARTICLE_PAGE_SIZE = 12

const createEmptyArticlePage = (): ArticlePage => ({
  content: [],
  items: [],
  totalElements: 0,
  totalPages: 0,
  size: DEFAULT_ARTICLE_PAGE_SIZE,
  number: 0,
  first: true,
  last: true,
  numberOfElements: 0,
  empty: true,
  total: 0,
  page: 1,
  pageSize: DEFAULT_ARTICLE_PAGE_SIZE,
  pages: 0
})

const normalizeArticlePage = (data?: ArticlePage | Article[]): ArticlePage => {
  if (!data) return createEmptyArticlePage()

  if (Array.isArray(data)) {
    const length = data.length
    return {
      ...createEmptyArticlePage(),
      content: data,
      items: data,
      totalElements: length,
      totalPages: length ? 1 : 0,
      size: length || DEFAULT_ARTICLE_PAGE_SIZE,
      number: 0,
      last: true,
      numberOfElements: length,
      empty: length === 0,
      total: length,
      page: 1,
      pageSize: length || DEFAULT_ARTICLE_PAGE_SIZE,
      pages: length ? 1 : 0,
      fromFallback: true
    }
  }

  const items = data.content ?? data.items ?? []
  const size = data.size ?? data.pageSize ?? DEFAULT_ARTICLE_PAGE_SIZE
  const number = typeof data.number === 'number' ? data.number : Math.max(0, (data.page ?? 1) - 1)
  const page = data.page ?? number + 1
  const totalElements = data.totalElements ?? data.total ?? items.length
  const totalPages = data.totalPages ?? (totalElements ? Math.ceil(totalElements / size) : 0)

  return {
    ...data,
    content: items,
    items,
    totalElements,
    totalPages,
    size,
    number,
    first: data.first ?? number === 0,
    last: data.last ?? page >= totalPages,
    numberOfElements: data.numberOfElements ?? items.length,
    empty: data.empty ?? items.length === 0,
    total: data.total ?? totalElements,
    page,
    pageSize: size,
    pages: data.pages ?? totalPages,
    fromFallback: data.fromFallback ?? false
  }
}

// 获取分页文章列表
export const getArticles = async (params?: Record<string, unknown>): Promise<ArticlePage> => {
  const res = await apiService.get<ArticlePage | Article[]>('/api/posts', { params })
  if (!res.success) throw new Error(res.message || '获取文章列表失败')
  return normalizeArticlePage(res.data)
}

// 根据 ID 获取单个文章
export const getArticle = async (id: string | number): Promise<Article | null> => {
  const res = await apiService.get<Article>(`/api/posts/${id}`)
  if (!res.success) throw new Error(res.message || '获取文章失败')
  return res.data ?? null
}

// 创建新文章
export const createArticle = async (payload: Partial<Article>): Promise<Article> => {
  const res = await apiService.post<Article>('/api/posts', payload)
  if (!res.success) throw new Error(res.message || '创建文章失败')
  if (!res.data) throw new Error('创建文章未返回数据')
  return res.data
}

// 更新文章
export const updateArticle = async (id: string | number, payload: Partial<Article>): Promise<Article> => {
  const res = await apiService.put<Article>(`/api/posts/${id}`, payload)
  if (!res.success) throw new Error(res.message || '更新文章失败')
  if (!res.data) throw new Error('更新文章未返回数据')
  return res.data
}

// 删除文章
export const deleteArticle = async (id: string | number): Promise<void> => {
  const res = await apiService.delete(`/api/posts/${id}`)
  if (!res.success) throw new Error(res.message || '删除文章失败')
}

// 点赞文章
export const likeArticle = async (id: string | number): Promise<void> => {
  const res = await apiService.patch(`/api/posts/${id}/like`)
  if (!res.success) throw new Error(res.message || '点赞失败')
}

// 取消点赞
export const unlikeArticle = async (id: string | number): Promise<void> => {
  const res = await apiService.patch(`/api/posts/${id}/unlike`)
  if (!res.success) throw new Error(res.message || '取消点赞失败')
}
