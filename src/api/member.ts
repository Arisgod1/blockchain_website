import apiService from '@/api/client'
import type { Member, MemberListFilters, MemberListResponse } from '@/types/entities'

const DEFAULT_PAGE_SIZE = 12

const normalizeMemberList = (data: MemberListResponse | Member[] | undefined): MemberListResponse => {
  if (!data) {
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE
    }
  }

  if (Array.isArray(data)) {
    const roleMap = new Map<string, number>()
    const skillSet = new Set<string>()
    data.forEach((member) => {
      roleMap.set(member.role, (roleMap.get(member.role) || 0) + 1)
      member.skills?.forEach((skill) => skillSet.add(skill))
    })

    return {
      items: data,
      total: data.length,
      page: 1,
      pageSize: data.length || DEFAULT_PAGE_SIZE,
      filters: {
        roles: Array.from(roleMap.entries()).map(([id, count]) => ({ id, name: id, count })),
        skills: Array.from(skillSet.values())
      }
    }
  }

  return data
}

const buildMemberParams = (filters: MemberListFilters = {}) => {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    search,
    role,
    skills,
    status,
    sortBy,
    sortOrder,
    isActive
  } = filters

  return {
    page,
    pageSize,
    search,
    role,
    skills,
    status,
    sortBy,
    sortOrder,
    isActive
  }
}

// 公共：获取成员列表
export const getMembers = async (filters?: MemberListFilters): Promise<MemberListResponse> => {
  const res = await apiService.get<MemberListResponse | Member[]>('/api/members', {
    params: buildMemberParams(filters)
  })

  if (!res.success) {
    throw new Error(res.message || '获取成员列表失败')
  }

  return normalizeMemberList(res.data)
}

// 公共：根据 ID 获取成员详情
export const getMember = async (id: string | number): Promise<Member | null> => {
  const res = await apiService.get<Member>(`/api/members/${id}`)
  if (!res.success) throw new Error(res.message || '获取成员失败')
  return res.data ?? null
}

// 管理员：获取成员列表
export const getAdminMembers = async (filters?: MemberListFilters): Promise<MemberListResponse> => {
  const res = await apiService.get<MemberListResponse>('/api/admin/members', {
    params: buildMemberParams(filters)
  })

  if (!res.success || !res.data) {
    throw new Error(res.message || '获取管理员成员列表失败')
  }

  return res.data
}

// 管理员：创建成员
export const createMember = async (payload: Partial<Member>): Promise<Member> => {
  const res = await apiService.post<Member>('/api/admin/members', payload)
  if (!res.success || !res.data) throw new Error(res.message || '创建成员失败')
  return res.data
}

// 管理员：更新成员
export const updateMember = async (id: string | number, payload: Partial<Member>): Promise<Member> => {
  const res = await apiService.put<Member>(`/api/admin/members/${id}`, payload)
  if (!res.success || !res.data) throw new Error(res.message || '更新成员失败')
  return res.data
}

// 管理员：更新成员状态
export const updateMemberStatus = async (
  id: string | number,
  status: 'active' | 'inactive',
  reason?: string
): Promise<Member> => {
  const res = await apiService.patch<Member>(`/api/admin/members/${id}/status`, {
    status,
    reason
  })
  if (!res.success || !res.data) throw new Error(res.message || '更新成员状态失败')
  return res.data
}

// 管理员：删除成员
export const deleteMember = async (id: string | number): Promise<void> => {
  const res = await apiService.delete(`/api/admin/members/${id}`)
  if (!res.success) throw new Error(res.message || '删除成员失败')
}
