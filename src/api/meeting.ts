import apiService from '@/api/client'
import type { Meeting } from '@/types/entities'
import { ensurePagedData, type PaginationParams, type PageResult } from '@/api/utils'

export type PageMeeting = PageResult<Meeting>

// 获取分页例会列表
export const getMeetings = async (params?: PaginationParams & Record<string, unknown>): Promise<PageMeeting> => {
  const res = await apiService.get<PageMeeting | Meeting[]>('/api/meetings', { params })
  if (!res.success) throw new Error(res.message || '获取例会列表失败')
  return ensurePagedData<Meeting>(res.data, params)
}

// 根据 ID 获取单个例会
export const getMeeting = async (id: string | number): Promise<Meeting | null> => {
  const res = await apiService.get<Meeting>(`/api/meetings/${id}`)
  if (!res.success) throw new Error(res.message || '获取例会失败')
  return res.data ?? null
}

// 创建新例会
export const createMeeting = async (payload: Partial<Meeting>): Promise<Meeting> => {
  const res = await apiService.post<Meeting>('/api/meetings', payload)
  if (!res.success) throw new Error(res.message || '创建例会失败')
  if (!res.data) throw new Error('创建例会未返回数据')
  return res.data
}

// 更新例会
export const updateMeeting = async (id: string | number, payload: Partial<Meeting>): Promise<Meeting> => {
  const res = await apiService.put<Meeting>(`/api/meetings/${id}`, payload)
  if (!res.success) throw new Error(res.message || '更新例会失败')
  if (!res.data) throw new Error('更新例会未返回数据')
  return res.data
}

// 删除例会
export const deleteMeeting = async (id: string | number): Promise<void> => {
  const res = await apiService.delete(`/api/meetings/${id}`)
  if (!res.success) throw new Error(res.message || '删除例会失败')
}
