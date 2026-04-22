import apiService from '@/api/client'
import type { Article } from '@/types/entities'
import { ensurePagedData, assertApiResponseSuccess, requireApiResponseData, type PaginationParams, type PageResult } from '@/api/utils'
import { MOCK_ARTICLES } from '@/common_value/articles'

type HttpError = { response?: unknown }
const hasResponse = (error: unknown): error is HttpError => typeof error === 'object' && error !== null && 'response' in error

const LOCAL_KEY = 'admin-articles-local'

const readLocal = (): Article[] => {
  const stored = localStorage.getItem(LOCAL_KEY)
  if (!stored) return [...MOCK_ARTICLES]
  try {
    const parsed = JSON.parse(stored) as Article[]
    return Array.isArray(parsed) ? parsed : [...MOCK_ARTICLES]
  } catch {
    return [...MOCK_ARTICLES]
  }
}

const writeLocal = (items: Article[]) => localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
const nextId = () => Date.now().toString()

type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

interface PostDto {
  id?: string | number
  title?: string
  content?: string
  summary?: string
  author?: string
  tags?: string
  status?: PostStatus | string
  viewCount?: number
  likeCount?: number
  featured?: boolean
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
}

const mapDtoToArticle = (dto: PostDto): Article => ({
  id: String(dto.id ?? ''),
  title: dto.title || '未命名文章',
  summary: dto.summary || '',
  content: dto.content || '',
  author: { name: dto.author || '匿名' },
  tags: (dto.tags || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
  category: '默认',
  publishDate: (dto.publishedAt || dto.createdAt || '').slice(0, 10) || new Date().toISOString().slice(0, 10),
  updateDate: dto.updatedAt || new Date().toISOString(),
  readTime: 3,
  isPublished: String(dto.status || 'DRAFT').toUpperCase() === 'PUBLISHED',
  views: dto.viewCount ?? 0,
  likes: dto.likeCount ?? 0,
  isFeatured: dto.featured
})

const mapArticleToDto = (article: Partial<Article>): Partial<PostDto> => ({
  id: article.id,
  title: article.title,
  content: article.content,
  summary: article.summary,
  author: typeof article.author === 'string' ? article.author : article.author?.name,
  tags: Array.isArray(article.tags) ? article.tags.join(',') : '',
  status: article.isPublished ? 'PUBLISHED' : 'DRAFT',
  viewCount: article.views,
  likeCount: article.likes,
  featured: article.isFeatured,
  publishedAt: article.publishDate ? `${article.publishDate}T00:00:00` : undefined
})

const normalizeIncomingArticle = (value: Article | PostDto): Article => {
  if (value && typeof value === 'object' && 'publishDate' in value) {
    return value as Article
  }
  return mapDtoToArticle(value as PostDto)
}

export type PageArticle = PageResult<Article>

// 获取分页文章列表
export const getArticles = async (params?: PaginationParams & Record<string, unknown>): Promise<PageArticle> => {
  try {
    const res = await apiService.get<PageResult<PostDto | Article> | Array<PostDto | Article>>('/api/posts', { params })
    assertApiResponseSuccess(res, '获取文章列表失败')
    const page = ensurePagedData<PostDto | Article>(res.data, params, readLocal())
    return {
      ...page,
      content: (page.content || []).map((item) => normalizeIncomingArticle(item))
    }
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    return ensurePagedData<Article>(readLocal(), params)
  }
}

// 根据 ID 获取单个文章
export const getArticle = async (id: string | number): Promise<Article | null> => {
  try {
    const res = await apiService.get<Article | PostDto>(`/api/posts/${id}`)
    assertApiResponseSuccess(res, '获取文章失败')
    return res.data ? normalizeIncomingArticle(res.data) : null
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    return readLocal().find(item => item.id === id) ?? null
  }
}

// 创建新文章
export const createArticle = async (payload: Partial<Article>): Promise<Article> => {
  try {
    const requestBody = mapArticleToDto(payload)
    const res = await apiService.post<PostDto | Article>('/api/posts', requestBody)
    return normalizeIncomingArticle(requireApiResponseData(res, '创建文章失败'))
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    const items = readLocal()
    const created: Article = {
      id: payload.id ?? nextId(),
      title: payload.title ?? '未命名文章',
      summary: payload.summary ?? '',
      content: payload.content ?? '',
      author: payload.author ?? { name: '匿名' },
      category: payload.category ?? '默认',
      publishDate: payload.publishDate ?? new Date().toISOString().slice(0, 10),
      isPublished: payload.isPublished ?? false,
      tags: payload.tags ?? [],
      updateDate: payload.updateDate ?? new Date().toISOString(),
      readTime: payload.readTime ?? 3,
      views: payload.views ?? 0,
      likes: payload.likes ?? 0
    }
    items.unshift(created)
    writeLocal(items)
    return created
  }
}

// 更新文章
export const updateArticle = async (id: string | number, payload: Partial<Article>): Promise<Article> => {
  try {
    const requestBody = mapArticleToDto(payload)
    const res = await apiService.put<PostDto | Article>(`/api/posts/${id}`, requestBody)
    return normalizeIncomingArticle(requireApiResponseData(res, '更新文章失败'))
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    const items = readLocal()
    const idx = items.findIndex(item => item.id === id)
    if (idx === -1) throw error
    const updated: Article = { ...items[idx], ...payload }
    items[idx] = updated
    writeLocal(items)
    return updated
  }
}

// 删除文章
export const deleteArticle = async (id: string | number): Promise<void> => {
  try {
    const res = await apiService.delete(`/api/posts/${id}`)
    assertApiResponseSuccess(res, '删除文章失败')
    return
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    const items = readLocal().filter(item => item.id !== id)
    writeLocal(items)
  }
}

