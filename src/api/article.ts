import apiService from '@/api/client'
import type { Article } from '@/types/entities'

// 分页响应类型
export interface PageArticle {
  totalElements: number
  totalPages: number
  size: number
  content: Article[]
  number: number
  sort: any
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: any
  empty: boolean
}

// 获取分页文章列表
export const getArticles = async (params?: Record<string, any>): Promise<PageArticle> => {
  const res = await apiService.get<PageArticle>('/api/posts', { params })
  if (!res.success) throw new Error(res.message || '获取文章列表失败')
  return res.data as PageArticle
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
