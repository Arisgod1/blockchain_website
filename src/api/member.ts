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

type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'GRADUATED'
type MemberRole = 'LEADER' | 'VICE_LEADER' | 'SECRETARY' | 'MEMBER'

interface MemberDto {
  id?: number | string
  name?: string
  studentId?: string
  role?: MemberRole | string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | string
  grade?: string
  email?: string
  phone?: string
  avatarUrl?: string
  bio?: string
  status?: MemberStatus | string
  displayOrder?: number
  createdAt?: string
  updatedAt?: string
}

type RawMember = Member & { avatarUrl?: string }

const ROLE_LABEL_TO_DTO: Record<string, MemberRole> = {
  LEADER: 'LEADER',
  VICE_LEADER: 'VICE_LEADER',
  SECRETARY: 'SECRETARY',
  MEMBER: 'MEMBER',
  负责人: 'LEADER',
  副负责人: 'VICE_LEADER',
  秘书: 'SECRETARY',
  成员: 'MEMBER'
}

const DTO_ROLE_TO_LABEL: Record<string, string> = {
  LEADER: '负责人',
  VICE_LEADER: '副负责人',
  SECRETARY: '秘书',
  MEMBER: '成员'
}

const normalizeRoleToDto = (role?: string): MemberRole => {
  const key = String(role || 'MEMBER').trim().toUpperCase()
  return ROLE_LABEL_TO_DTO[key] || 'MEMBER'
}

const normalizeRoleFromDto = (role?: string): string => {
  const key = String(role || 'MEMBER').trim().toUpperCase()
  return DTO_ROLE_TO_LABEL[key] || role || '成员'
}

const toAbsoluteAvatar = (value?: string): string => {
  if (!value) return ''
  const normalized = value.replace(/\\/g, '/').trim()
  if (!normalized) return ''
  if (/^(data:|blob:)/i.test(normalized)) return normalized
  if (/^https?:\/\//i.test(normalized)) return normalized
  if (normalized.startsWith('/')) return normalized
  if (/^(src|assets)\//i.test(normalized)) return `/${normalized}`
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082').replace(/\/+$/, '')
  return base ? `${base}/${normalized}` : normalized
}

const mapDtoToMember = (dto: MemberDto): Member => {
  const avatar = toAbsoluteAvatar(dto.avatarUrl)
  return {
    id: String(dto.id ?? ''),
    name: dto.name || '未命名成员',
    studentId: dto.studentId || '',
    role: normalizeRoleFromDto(dto.role),
    avatar,
    avatarUrl: avatar,
    bio: dto.bio || '',
    skills: [],
    grade: dto.grade || '',
    major: '',
    projectCount: 0,
    email: dto.email || '',
    github: '',
    linkedin: '',
    joinDate: (dto.createdAt || '').slice(0, 10) || new Date().toISOString().slice(0, 10),
    isActive: String(dto.status || 'ACTIVE').toUpperCase() === 'ACTIVE'
  }
}

const mapMemberToDto = (member: Partial<Member>): Partial<MemberDto> => ({
  id: member.id,
  name: member.name,
  studentId: member.studentId,
  role: normalizeRoleToDto(member.role),
  grade: member.grade,
  email: member.email,
  avatarUrl: member.avatar || member.avatarUrl,
  bio: member.bio,
  status: member.isActive === false ? 'INACTIVE' : 'ACTIVE',
  createdAt: member.joinDate ? `${member.joinDate}T00:00:00` : undefined
})

const normalizeAvatar = (member: RawMember): Member => ({
  ...member,
  avatar: toAbsoluteAvatar(member.avatar ?? member.avatarUrl ?? '')
})

const mapAvatars = (members: RawMember[]): Member[] => members.map(normalizeAvatar)

const normalizeIncomingMember = (member: RawMember | MemberDto): Member => {
  if ('joinDate' in member || 'skills' in member) {
    return normalizeAvatar(member as RawMember)
  }
  return mapDtoToMember(member as MemberDto)
}

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

const hasMemberId = (members: Member[], id?: string | number): boolean => {
  if (id === undefined || id === null) return false
  const target = String(id)
  return members.some(member => String(member.id) === target)
}

const resolveNextMemberId = (members: Member[]): number => {
  const numericIds = members
    .map((member) => Number.parseInt(String(member.id), 10))
    .filter((value) => Number.isFinite(value))

  if (numericIds.length === 0) {
    return 1
  }

  return Math.max(...numericIds) + 1
}

export type PageMember = PageResult<Member>

// 获取分页成员列表
export const getMembers = async (params?: PaginationParams & Record<string, unknown>): Promise<PageMember> => {
  try {
    const res = await apiService.get<PageResult<MemberDto | RawMember> | Array<MemberDto | RawMember>>('/api/members', { params })
    assertApiResponseSuccess(res, '获取成员列表失败')
    const page = ensurePagedData<MemberDto | RawMember>(res.data, params, readLocalMembers() as RawMember[])
    return {
      ...page,
      content: (page.content ?? []).map((item) => normalizeIncomingMember(item))
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
    const res = await apiService.get<MemberDto | RawMember>(`/api/members/${id}`)
    assertApiResponseSuccess(res, '获取成员失败')
    return res.data ? normalizeIncomingMember(res.data) : null
  } catch (error) {
    if (hasResponse(error)) throw error
    console.warn('远程获取成员失败（网络），尝试本地：', error)
    return readLocalMembers().find(item => item.id === id) ?? null
  }
}

// 创建新成员
export const createMember = async (payload: Partial<Member>): Promise<Member> => {
  const localMembersSnapshot = readLocalMembers()
  const resolvedId = String(payload.id ?? resolveNextMemberId(localMembersSnapshot))

  if (hasMemberId(localMembersSnapshot, resolvedId)) {
    throw new Error(`成员ID已存在：${resolvedId}`)
  }

  try {
    const requestBody = mapMemberToDto({ ...payload, id: resolvedId })
    const res = await apiService.post<MemberDto | RawMember>('/api/members', requestBody)
    return normalizeIncomingMember(requireApiResponseData(res, '创建成员失败'))
  } catch (error) {
    const respStatus = getStatus(error)
    if (respStatus) {
      console.warn('远程创建成员失败，回退到本地：', respStatus)
    } else {
      console.warn('远程创建成员失败（网络），回退到本地：', error)
    }
    const members = readLocalMembers()
    if (hasMemberId(members, resolvedId)) {
      throw new Error(`成员ID已存在：${resolvedId}`)
    }
    const newMember: Member = {
      id: String(resolvedId),
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
    const requestBody = mapMemberToDto(payload)
    const res = await apiService.put<MemberDto | RawMember>(`/api/members/${id}`, requestBody)
    return normalizeIncomingMember(requireApiResponseData(res, '更新成员失败'))
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
