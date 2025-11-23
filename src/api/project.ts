import apiService from '@/api/client'
import type { Project } from '@/types/entities'

// 分页响应类型（根据文档）
export interface PageProject {
  totalElements: number
  totalPages: number
  size: number
  content: Project[]
  number: number
  sort: any
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: any
  empty: boolean
}

// 获取分页项目列表
export const getProjects = async (params?: Record<string, any>): Promise<PageProject> => {
  const res = await apiService.get<PageProject>('/api/projects', { params })
  if (!res.success) throw new Error(res.message || '获取项目列表失败')
  return res.data as PageProject
}

// 根据 ID 获取单个项目
export const getProject = async (id: string | number): Promise<Project | null> => {
  const res = await apiService.get<Project>(`/api/projects/${id}`)
  if (!res.success) throw new Error(res.message || '获取项目失败')
  return res.data ?? null
}

// 创建新项目
export const createProject = async (payload: Partial<Project>): Promise<Project> => {
  const res = await apiService.post<Project>('/api/projects', payload)
  if (!res.success) throw new Error(res.message || '创建项目失败')
  if (!res.data) throw new Error('创建项目未返回数据')
  return res.data
}

// 更新项目（PUT）
export const updateProject = async (id: string | number, payload: Partial<Project>): Promise<Project> => {
  const res = await apiService.put<Project>(`/api/projects/${id}`, payload)
  if (!res.success) throw new Error(res.message || '更新项目失败')
  if (!res.data) throw new Error('更新项目未返回数据')
  return res.data
}

// 删除项目
export const deleteProject = async (id: string | number): Promise<void> => {
  const res = await apiService.delete<void>(`/api/projects/${id}`)
  if (!res.success) throw new Error(res.message || '删除项目失败')
  return
}

// 根据状态获取项目列表（不分页）
export const getProjectsByStatus = async (status: string): Promise<Project[]> => {
  const res = await apiService.get<Project[]>(`/api/projects/status/${status}`)
  if (!res.success) throw new Error(res.message || '根据状态获取项目失败')
  return res.data ?? []
}

// 搜索项目
export const searchProjects = async (params?: Record<string, any>): Promise<Project[]> => {
  const res = await apiService.get<Project[]>('/api/projects/search', { params })
  if (!res.success) throw new Error(res.message || '搜索项目失败')
  return res.data ?? []
}

// PATCH 更新项目状态
export const patchProjectStatus = async (id: string | number, status: string): Promise<Project> => {
  const res = await apiService.patch<Project>(`/api/projects/${id}/status`, null, { params: { status } })
  if (!res.success) throw new Error(res.message || '更新项目状态失败')
  if (!res.data) throw new Error('更新项目状态未返回数据')
  return res.data
}

// PATCH 更新项目进度
export const patchProjectProgress = async (id: string | number, progress: number): Promise<Project> => {
  const res = await apiService.patch<Project>(`/api/projects/${id}/progress`, null, { params: { progress } })
  if (!res.success) throw new Error(res.message || '更新项目进度失败')
  if (!res.data) throw new Error('更新项目进度未返回数据')
  return res.data
}

// PATCH 更新显示顺序（displayOrder）
export const patchProjectDisplayOrder = async (id: string | number, displayOrder: number): Promise<void> => {
  const res = await apiService.patch<void>(`/api/projects/${id}/display-order`, null, { params: { displayOrder } })
  if (!res.success) throw new Error(res.message || '更新显示顺序失败')
  return
}

export default {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByStatus,
  searchProjects,
  patchProjectStatus,
  patchProjectProgress,
  patchProjectDisplayOrder
}