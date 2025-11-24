import apiService from '@/api/client'
import type { Article } from '@/types/entities'
import { ensurePagedData, assertApiResponseSuccess, requireApiResponseData, type PaginationParams, type PageResult } from '@/api/utils'

export type PageArticle = PageResult<Article>

// 获取分页文章列表
export const getArticles = async (params?: PaginationParams & Record<string, unknown>): Promise<PageArticle> => {
  const res = await apiService.get<PageArticle | Article[]>('/api/posts', { params })
  assertApiResponseSuccess(res, '获取文章列表失败')
  return ensurePagedData<Article>(res.data, params)
}

// 根据 ID 获取单个文章
export const getArticle = async (id: string | number): Promise<Article | null> => {
  const res = await apiService.get<Article>(`/api/posts/${id}`)
  assertApiResponseSuccess(res, '获取文章失败')
  return res.data ?? null
}

// 创建新文章
export const createArticle = async (payload: Partial<Article>): Promise<Article> => {
  const res = await apiService.post<Article>('/api/posts', payload)
  return requireApiResponseData(res, '创建文章失败')
}

// 更新文章
export const updateArticle = async (id: string | number, payload: Partial<Article>): Promise<Article> => {
  const res = await apiService.put<Article>(`/api/posts/${id}`, payload)
  return requireApiResponseData(res, '更新文章失败')
}

// 删除文章
export const deleteArticle = async (id: string | number): Promise<void> => {
  const res = await apiService.delete(`/api/posts/${id}`)
  assertApiResponseSuccess(res, '删除文章失败')
}

