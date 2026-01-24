import apiService from '@/api/client'
import type { Article } from '@/types/entities'
import { ensurePagedData, assertApiResponseSuccess, requireApiResponseData, type PaginationParams, type PageResult } from '@/api/utils'
import { MOCK_ARTICLES } from '@/common_value/articles'

type HttpError = { response?: unknown }
const hasResponse = (error: unknown): error is HttpError => typeof error === 'object' && error !== null && 'response' in error

const LOCAL_KEY = 'admin-posts-local'

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

export type PageArticle = PageResult<Article>

// 获取分页帖子列表
export const getPosts = async (params?: PaginationParams & Record<string, unknown>): Promise<PageArticle> => {
  try {
    const res = await apiService.get<PageArticle | Article[]>('/api/posts', { params })
    assertApiResponseSuccess(res, '获取帖子列表失败')
    return ensurePagedData<Article>(res.data, params, readLocal())
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    return ensurePagedData<Article>(readLocal(), params)
  }
}

// 根据 ID 获取单个帖子
export const getPost = async (id: string | number): Promise<Article | null> => {
  try {
    const res = await apiService.get<Article>(`/api/posts/${id}`)
    assertApiResponseSuccess(res, '获取帖子失败')
    return res.data ?? null
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    return readLocal().find(item => item.id === id) ?? null
  }
}

// 创建新帖子
export const createPost = async (payload: Partial<Article>): Promise<Article> => {
  try {
    const res = await apiService.post<Article>('/api/posts', payload)
    return requireApiResponseData(res, '创建帖子失败')
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    const items = readLocal()
    const authorName = typeof payload.author === 'string'
      ? payload.author
      : payload.author?.name

    const created: Article = {
      id: payload.id ?? nextId(),
      title: payload.title ?? '未命名帖子',
      summary: payload.summary ?? '',
      content: payload.content ?? '',
      author: { name: authorName && authorName.trim() ? authorName.trim() : '匿名' },
      category: payload.category ?? '默认',
      publishDate: payload.publishDate ?? new Date().toISOString().slice(0, 10),
      isPublished: payload.isPublished ?? false,
      tags: payload.tags ?? [],
      updateDate: payload.updateDate ?? new Date().toISOString(),
      readTime: payload.readTime ?? 3,
      views: 0,
      likes: 0
    }
    items.unshift(created)
    writeLocal(items)
    return created
  }
}

// 更新帖子
export const updatePost = async (id: string | number, payload: Partial<Article>): Promise<Article> => {
  try {
    const res = await apiService.put<Article>(`/api/posts/${id}`, payload)
    return requireApiResponseData(res, '更新帖子失败')
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

// 删除帖子
export const deletePost = async (id: string | number): Promise<void> => {
  try {
    const res = await apiService.delete(`/api/posts/${id}`)
    assertApiResponseSuccess(res, '删除帖子失败')
    return
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    const items = readLocal().filter(item => item.id !== id)
    writeLocal(items)
  }
}
