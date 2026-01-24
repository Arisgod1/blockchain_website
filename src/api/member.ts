import apiService from '@/api/client'
import type { Member } from '@/types/entities'
import { ensurePagedData, assertApiResponseSuccess, requireApiResponseData, type PaginationParams, type PageResult } from '@/api/utils'
import { MOCK_MEMBERS } from '@/common_value/members'

type HttpError = { response?: { status?: number } }
const getStatus = (error: unknown): number | undefined => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const resp = (error as HttpError).response
    return resp?.status
  }
  return undefined
}
const hasResponse = (error: unknown): boolean => typeof error === 'object' && error !== null && 'response' in error

const LOCAL_KEY = 'admin-members-local'

type RawMember = Member & { avatarUrl?: string }

const toAbsoluteAvatar = (value?: string): string => {
  if (!value) return ''
  const normalized = value.replace(/\\/g, '/').replace(/^\//, '')
  if (/^https?:\/\//i.test(normalized)) return normalized
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082').replace(/\/+$/, '')
  return base ? `${base}/${normalized}` : normalized
}

const normalizeAvatar = (member: RawMember): Member => ({
  ...member,
  avatar: toAbsoluteAvatar(member.avatar ?? member.avatarUrl ?? '')
})

const mapAvatars = (members: RawMember[]): Member[] => members.map(normalizeAvatar)

const readLocalMembers = (): Member[] => {
  const stored = localStorage.getItem(LOCAL_KEY)
  if (!stored) return [...MOCK_MEMBERS]
  try {
    const parsed = JSON.parse(stored) as RawMember[]
    return Array.isArray(parsed) ? mapAvatars(parsed) : [...MOCK_MEMBERS]
  } catch (error) {
    console.warn('解析本地成员数据失败，使用默认 Mock：', error)
    return [...MOCK_MEMBERS]
  }
}

const writeLocalMembers = (members: Member[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(members))
}

const nextId = () => Date.now().toString()

export type PageMember = PageResult<Member>

// 获取分页成员列表
export const getMembers = async (params?: PaginationParams & Record<string, unknown>): Promise<PageMember> => {
  try {
    const res = await apiService.get<PageMember | RawMember[]>('/api/members', { params })
    assertApiResponseSuccess(res, '获取成员列表失败')
    const page = ensurePagedData<Member>(res.data, params, mapAvatars(readLocalMembers() as RawMember[]))
    return {
      ...page,
      content: mapAvatars(page.content ?? [])
    }
  } catch (error) {
    // 网络错误才使用本地数据，后端错误直接抛出便于排查
    if (hasResponse(error)) {
      throw error
    }
    console.warn('远程获取成员失败（网络），使用本地数据：', error)
    const page = ensurePagedData<Member>(mapAvatars(readLocalMembers() as RawMember[]), params)
    return {
      ...page,
      content: mapAvatars(page.content ?? [])
    }
  }
}

// 根据 ID 获取单个成员
export const getMember = async (id: string | number): Promise<Member | null> => {
  try {
    const res = await apiService.get<RawMember>(`/api/members/${id}`)
    assertApiResponseSuccess(res, '获取成员失败')
    return res.data ? normalizeAvatar(res.data) : null
  } catch (error) {
    if (hasResponse(error)) throw error
    console.warn('远程获取成员失败（网络），尝试本地：', error)
    return readLocalMembers().find(item => item.id === id) ?? null
  }
}

// 创建新成员
export const createMember = async (payload: Partial<Member>): Promise<Member> => {
  try {
    const res = await apiService.post<Member>('/api/members', payload)
    return normalizeAvatar(requireApiResponseData(res, '创建成员失败'))
  } catch (error) {
    const respStatus = getStatus(error)
    if (respStatus) {
      console.warn('远程创建成员失败，回退到本地：', respStatus)
    } else {
      console.warn('远程创建成员失败（网络），回退到本地：', error)
    }
    const members = readLocalMembers()
    const newMember: Member = {
      id: payload.id ?? nextId(),
      name: payload.name ?? '未命名成员',
      role: payload.role ?? '成员',
      avatar: payload.avatar ?? '',
      bio: payload.bio ?? '',
      skills: payload.skills ?? [],
      grade: payload.grade ?? '',
      email: payload.email ?? '',
      github: payload.github ?? '',
      linkedin: payload.linkedin ?? '',
      joinDate: payload.joinDate ?? new Date().toISOString().slice(0, 10),
      isActive: payload.isActive ?? true,
      major: payload.major ?? '',
      projectCount: payload.projectCount ?? 0
    }
    members.unshift(newMember)
    writeLocalMembers(members)
    return newMember
  }
}

// 更新成员
export const updateMember = async (id: string | number, payload: Partial<Member>): Promise<Member> => {
  try {
    const res = await apiService.put<Member>(`/api/members/${id}`, payload)
    return normalizeAvatar(requireApiResponseData(res, '更新成员失败'))
  } catch (error) {
    const respStatus = getStatus(error)
    if (respStatus) {
      console.warn('远程更新成员失败，回退到本地：', respStatus)
    } else {
      console.warn('远程更新成员失败（网络），回退到本地：', error)
    }
    const members = readLocalMembers()
    const idx = members.findIndex(item => item.id === id)
    if (idx === -1) throw error
    const updated: Member = { ...members[idx], ...payload }
    members[idx] = updated
    writeLocalMembers(members)
    return updated
  }
}

// 删除成员
export const deleteMember = async (id: string | number): Promise<void> => {
  try {
    const res = await apiService.delete(`/api/members/${id}`)
    assertApiResponseSuccess(res, '删除成员失败')
    return
  } catch (error) {
    if (hasResponse(error)) throw error
    console.warn('远程删除成员失败（网络），回退到本地：', error)
    const members = readLocalMembers().filter(item => item.id !== id)
    writeLocalMembers(members)
  }
}
