import apiService from '@/api/client'
import type { Member } from '@/types/entities'
import { ensurePagedData, type PaginationParams } from '@/api/utils'

// 分页响应类型
export interface PageMember {
  totalElements: number
  totalPages: number
  size: number
  content: Member[]
  number: number
  sort: any
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: any
  empty: boolean
}

// 获取分页成员列表
export const getMembers = async (params?: PaginationParams & Record<string, unknown>): Promise<PageMember> => {
  const res = await apiService.get<PageMember | Member[]>('/api/members', { params })
  if (!res.success) throw new Error(res.message || '获取成员列表失败')
  return ensurePagedData<Member>(res.data, params)
}

// 根据 ID 获取单个成员
export const getMember = async (id: string | number): Promise<Member | null> => {
  const res = await apiService.get<Member>(`/api/members/${id}`)
  if (!res.success) throw new Error(res.message || '获取成员失败')
  return res.data ?? null
}

// 创建新成员
export const createMember = async (payload: Partial<Member>): Promise<Member> => {
  const res = await apiService.post<Member>('/api/members', payload)
  if (!res.success) throw new Error(res.message || '创建成员失败')
  if (!res.data) throw new Error('创建成员未返回数据')
  return res.data
}

// 更新成员
export const updateMember = async (id: string | number, payload: Partial<Member>): Promise<Member> => {
  const res = await apiService.put<Member>(`/api/members/${id}`, payload)
  if (!res.success) throw new Error(res.message || '更新成员失败')
  if (!res.data) throw new Error('更新成员未返回数据')
  return res.data
}

// 删除成员
export const deleteMember = async (id: string | number): Promise<void> => {
  const res = await apiService.delete(`/api/members/${id}`)
  if (!res.success) throw new Error(res.message || '删除成员失败')
}
