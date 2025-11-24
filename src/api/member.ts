import apiService from '@/api/client'
import type { Member } from '@/types/entities'
import { ensurePagedData, assertApiResponseSuccess, requireApiResponseData, type PaginationParams, type PageResult } from '@/api/utils'

export type PageMember = PageResult<Member>

// 获取分页成员列表
export const getMembers = async (params?: PaginationParams & Record<string, unknown>): Promise<PageMember> => {
  const res = await apiService.get<PageMember | Member[]>('/api/members', { params })
  assertApiResponseSuccess(res, '获取成员列表失败')
  return ensurePagedData<Member>(res.data, params)
}

// 根据 ID 获取单个成员
export const getMember = async (id: string | number): Promise<Member | null> => {
  const res = await apiService.get<Member>(`/api/members/${id}`)
  assertApiResponseSuccess(res, '获取成员失败')
  return res.data ?? null
}

// 创建新成员
export const createMember = async (payload: Partial<Member>): Promise<Member> => {
  const res = await apiService.post<Member>('/api/members', payload)
  return requireApiResponseData(res, '创建成员失败')
}

// 更新成员
export const updateMember = async (id: string | number, payload: Partial<Member>): Promise<Member> => {
  const res = await apiService.put<Member>(`/api/members/${id}`, payload)
  return requireApiResponseData(res, '更新成员失败')
}

// 删除成员
export const deleteMember = async (id: string | number): Promise<void> => {
  const res = await apiService.delete(`/api/members/${id}`)
  assertApiResponseSuccess(res, '删除成员失败')
}
