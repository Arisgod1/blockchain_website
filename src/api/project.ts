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

type BackendProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD' | 'ONGOING'

interface ProjectDto {
  id?: string | number
  name?: string
  description?: string
  category?: string
  status?: BackendProjectStatus | string
  startDate?: string
  endDate?: string
  budget?: number
  progress?: number
  isPublic?: boolean
  featured?: boolean
  goals?: string
  techStack?: string
  achievements?: string
  imageUrl?: string
  repositoryUrl?: string
  demoUrl?: string
  documentationUrl?: string
  displayOrder?: number
}

const normalizeProjectStatusToDto = (status?: string): BackendProjectStatus => {
  const raw = String(status || 'PLANNING').trim().toUpperCase().replace(/-/g, '_')
  switch (raw) {
    case 'IN_PROGRESS':
    case 'ONGOING':
    case 'COMPLETED':
    case 'CANCELLED':
    case 'ON_HOLD':
    case 'PLANNING':
      return raw
    case 'PAUSED':
      return 'ON_HOLD'
    case 'ACTIVE':
      return 'IN_PROGRESS'
    case 'ARCHIVED':
      return 'COMPLETED'
    default:
      return 'PLANNING'
  }
}

const normalizeProjectCategory = (category?: string): string => {
  if (!category) return 'DEVELOPMENT'
  return String(category).trim().toUpperCase().replace(/\s+/g, '_')
}

const mapDtoToProject = (dto: ProjectDto): Project => {
  const techStack = (dto.techStack || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return {
    id: dto.id,
    name: dto.name || '',
    title: dto.name || '',
    description: dto.description || '',
    category: dto.category,
    status: normalizeProjectStatusToDto(dto.status) as Status,
    startDate: dto.startDate,
    endDate: dto.endDate,
    budget: dto.budget,
    progress: dto.progress,
    isPublic: dto.isPublic,
    featured: dto.featured,
    goals: dto.goals,
    techStack,
    achievements: dto.achievements,
    imageUrl: dto.imageUrl,
    repositoryUrl: dto.repositoryUrl,
    githubUrl: dto.repositoryUrl,
    demoUrl: dto.demoUrl,
    documentationUrl: dto.documentationUrl,
    documentation: dto.documentationUrl,
    displayOrder: dto.displayOrder
  }
}

const mapProjectToDto = (project: Partial<Project>): Partial<ProjectDto> => ({
  id: project.id,
  name: project.name || project.title,
  description: project.description,
  category: normalizeProjectCategory(typeof project.category === 'string' ? project.category : String(project.category || '')),
  status: normalizeProjectStatusToDto(typeof project.status === 'string' ? project.status : String(project.status || '')),
  startDate: typeof project.startDate === 'string' ? project.startDate : project.startDate?.toISOString().slice(0, 10),
  endDate: typeof project.endDate === 'string' ? project.endDate : project.endDate?.toISOString().slice(0, 10),
  budget: project.budget,
  progress: typeof project.progress === 'number' ? Math.max(0, Math.min(100, project.progress)) : project.progress,
  isPublic: project.isPublic,
  featured: project.featured,
  goals: project.goals,
  techStack: Array.isArray(project.techStack) ? project.techStack.join(',') : String(project.techStack || ''),
  achievements: project.achievements,
  imageUrl: project.imageUrl,
  repositoryUrl: project.repositoryUrl || project.githubUrl,
  demoUrl: project.demoUrl,
  documentationUrl: project.documentationUrl || project.documentation,
  displayOrder: project.displayOrder
})

export type PageProject = PageResult<Project>

// 获取分页项目列表
export const getProjects = async (params?: PaginationParams & Record<string, unknown>): Promise<PageProject> => {
  try {
    const res = await apiService.get<PageResult<ProjectDto | Project> | Array<ProjectDto | Project>>('/api/projects', { params })
    assertApiResponseSuccess(res, '获取项目列表失败')
    const page = ensurePagedData<ProjectDto | Project>(res.data, params, readLocal())
    return {
      ...page,
      content: (page.content || []).map((item) => {
        if (item && typeof item === 'object' && ('title' in item || 'techStack' in item && Array.isArray((item as Project).techStack))) {
          return item as Project
        }
        return mapDtoToProject(item as ProjectDto)
      })
    }
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    return ensurePagedData<Project>(readLocal(), params)
  }
}

// 根据 ID 获取单个项目
export const getProject = async (id: string | number): Promise<Project | null> => {
  try {
    const res = await apiService.get<ProjectDto | Project>(`/api/projects/${id}`)
    assertApiResponseSuccess(res, '获取项目失败')
    if (!res.data) return null
    if ('title' in (res.data as Project) || Array.isArray((res.data as Project).techStack)) {
      return res.data as Project
    }
    return mapDtoToProject(res.data as ProjectDto)
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    return readLocal().find(item => item.id === id) ?? null
  }
}

// 创建新项目
export const createProject = async (payload: Partial<Project>): Promise<Project> => {
  try {
    const requestBody = mapProjectToDto(payload)
    const res = await apiService.post<ProjectDto | Project>('/api/projects', requestBody)
    const created = requireApiResponseData(res, '创建项目失败')
    return 'title' in (created as Project) || Array.isArray((created as Project).techStack)
      ? (created as Project)
      : mapDtoToProject(created as ProjectDto)
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
    const requestBody = mapProjectToDto(payload)
    const res = await apiService.put<ProjectDto | Project>(`/api/projects/${id}`, requestBody)
    const updated = requireApiResponseData(res, '更新项目失败')
    return 'title' in (updated as Project) || Array.isArray((updated as Project).techStack)
      ? (updated as Project)
      : mapDtoToProject(updated as ProjectDto)
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
  const res = await apiService.get<ProjectDto[]>(`/api/projects/status/${normalizeProjectStatusToDto(status)}`)
  assertApiResponseSuccess(res, '根据状态获取项目失败')
  return (res.data ?? []).map((item) => mapDtoToProject(item))
}

// 搜索项目
export const searchProjects = async (params?: QueryParams): Promise<Project[]> => {
  const res = await apiService.get<ProjectDto[]>('/api/projects/search', { params })
  assertApiResponseSuccess(res, '搜索项目失败')
  return (res.data ?? []).map((item) => mapDtoToProject(item))
}

// PATCH 更新项目状态
export const patchProjectStatus = async (id: string | number, status: string): Promise<Project> => {
  const res = await apiService.patch<ProjectDto>(`/api/projects/${id}/status`, null, { params: { status: normalizeProjectStatusToDto(status) } })
  return mapDtoToProject(requireApiResponseData(res, '更新项目状态失败'))
}

// PATCH 更新项目进度
export const patchProjectProgress = async (id: string | number, progress: number): Promise<Project> => {
  const res = await apiService.patch<ProjectDto>(`/api/projects/${id}/progress`, null, { params: { progress: Math.max(0, Math.min(100, progress)) } })
  return mapDtoToProject(requireApiResponseData(res, '更新项目进度失败'))
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