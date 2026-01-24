import apiService from '@/api/client'
import type { Project } from '@/types/entities'
import { Status } from '@/types/entities'
import { ensurePagedData, assertApiResponseSuccess, requireApiResponseData, type PaginationParams, type PageResult, type QueryParams } from '@/api/utils'
import { MOCK_PROJECTS } from '@/common_value/projects'

type HttpError = { response?: unknown }
const hasResponse = (error: unknown): error is HttpError => typeof error === 'object' && error !== null && 'response' in error

const LOCAL_KEY = 'admin-projects-local'

const readLocal = (): Project[] => {
  const stored = localStorage.getItem(LOCAL_KEY)
  if (!stored) return [...MOCK_PROJECTS]
  try {
    const parsed = JSON.parse(stored) as Project[]
    return Array.isArray(parsed) ? parsed : [...MOCK_PROJECTS]
  } catch {
    return [...MOCK_PROJECTS]
  }
}

const writeLocal = (items: Project[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
}

const nextId = () => Date.now().toString()

export type PageProject = PageResult<Project>

// 获取分页项目列表
export const getProjects = async (params?: PaginationParams & Record<string, unknown>): Promise<PageProject> => {
  try {
    const res = await apiService.get<PageProject | Project[]>('/api/projects', { params })
    assertApiResponseSuccess(res, '获取项目列表失败')
    return ensurePagedData<Project>(res.data, params, readLocal())
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    return ensurePagedData<Project>(readLocal(), params)
  }
}

// 根据 ID 获取单个项目
export const getProject = async (id: string | number): Promise<Project | null> => {
  try {
    const res = await apiService.get<Project>(`/api/projects/${id}`)
    assertApiResponseSuccess(res, '获取项目失败')
    return res.data ?? null
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    return readLocal().find(item => item.id === id) ?? null
  }
}

// 创建新项目
export const createProject = async (payload: Partial<Project>): Promise<Project> => {
  try {
    const res = await apiService.post<Project>('/api/projects', payload)
    return requireApiResponseData(res, '创建项目失败')
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    const items = readLocal()
    const created: Project = {
      id: payload.id ?? nextId(),
      name: payload.name ?? '未命名项目',
      description: payload.description ?? '',
      category: payload.category ?? 'DEVELOPMENT',
      status: payload.status ?? Status.Planning,
      progress: payload.progress ?? 0,
      tags: payload.tags ?? [],
      members: payload.members ?? [],
      startDate: payload.startDate ?? new Date().toISOString(),
      endDate: payload.endDate ?? '',
      displayOrder: payload.displayOrder ?? items.length,
      repoUrl: payload.repoUrl ?? '',
      link: payload.link ?? ''
    }
    items.unshift(created)
    writeLocal(items)
    return created
  }
}

// 更新项目（PUT）
export const updateProject = async (id: string | number, payload: Partial<Project>): Promise<Project> => {
  try {
    const res = await apiService.put<Project>(`/api/projects/${id}`, payload)
    return requireApiResponseData(res, '更新项目失败')
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    const items = readLocal()
    const idx = items.findIndex(item => item.id === id)
    if (idx === -1) throw error
    const updated: Project = { ...items[idx], ...payload }
    items[idx] = updated
    writeLocal(items)
    return updated
  }
}

// 删除项目
export const deleteProject = async (id: string | number): Promise<void> => {
  try {
    const res = await apiService.delete<void>(`/api/projects/${id}`)
    assertApiResponseSuccess(res, '删除项目失败')
    return
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    const items = readLocal().filter(item => item.id !== id)
    writeLocal(items)
  }
}

// 根据状态获取项目列表（不分页）
export const getProjectsByStatus = async (status: string): Promise<Project[]> => {
  const res = await apiService.get<Project[]>(`/api/projects/status/${status}`)
  assertApiResponseSuccess(res, '根据状态获取项目失败')
  return res.data ?? []
}

// 搜索项目
export const searchProjects = async (params?: QueryParams): Promise<Project[]> => {
  const res = await apiService.get<Project[]>('/api/projects/search', { params })
  assertApiResponseSuccess(res, '搜索项目失败')
  return res.data ?? []
}

// PATCH 更新项目状态
export const patchProjectStatus = async (id: string | number, status: string): Promise<Project> => {
  const res = await apiService.patch<Project>(`/api/projects/${id}/status`, null, { params: { status } })
  return requireApiResponseData(res, '更新项目状态失败')
}

// PATCH 更新项目进度
export const patchProjectProgress = async (id: string | number, progress: number): Promise<Project> => {
  const res = await apiService.patch<Project>(`/api/projects/${id}/progress`, null, { params: { progress } })
  return requireApiResponseData(res, '更新项目进度失败')
}

// PATCH 更新显示顺序（displayOrder）
export const patchProjectDisplayOrder = async (id: string | number, displayOrder: number): Promise<void> => {
  const res = await apiService.patch<void>(`/api/projects/${id}/display-order`, null, { params: { displayOrder } })
  assertApiResponseSuccess(res, '更新显示顺序失败')
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