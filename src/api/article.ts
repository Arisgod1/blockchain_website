import apiService from '@/api/client'
import type { Article } from '@/types/entities'
import { ensurePagedData, type PaginationParams, type PageResult } from '@/api/utils'

export type PageArticle = PageResult<Article>

// 获取分页文章列表
export const getArticles = async (params?: PaginationParams & Record<string, unknown>): Promise<PageArticle> => {
  const res = await apiService.get<PageArticle | Article[]>('/api/posts', { params })
  if (!res.success) throw new Error(res.message || '获取文章列表失败')
  return ensurePagedData<Article>(res.data, params)
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

