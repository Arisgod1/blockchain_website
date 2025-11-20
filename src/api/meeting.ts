import apiService from '@/api/client'
import type { Meeting, MeetingPage } from '@/types/entities'

const DEFAULT_MEETING_PAGE_SIZE = 12

const createEmptyMeetingPage = (): MeetingPage => ({
  content: [],
  items: [],
  totalElements: 0,
  totalPages: 0,
  size: DEFAULT_MEETING_PAGE_SIZE,
  number: 0,
  first: true,
  last: true,
  numberOfElements: 0,
  empty: true,
  total: 0,
  page: 1,
  pageSize: DEFAULT_MEETING_PAGE_SIZE,
  pages: 0
})

const normalizeMeetingPage = (data?: MeetingPage | Meeting[]): MeetingPage => {
  if (!data) return createEmptyMeetingPage()

  if (Array.isArray(data)) {
    const length = data.length
    return {
      ...createEmptyMeetingPage(),
      content: data,
      items: data,
      totalElements: length,
      totalPages: length ? 1 : 0,
      size: length || DEFAULT_MEETING_PAGE_SIZE,
      number: 0,
      last: true,
      numberOfElements: length,
      empty: length === 0,
      total: length,
      page: 1,
      pageSize: length || DEFAULT_MEETING_PAGE_SIZE,
      pages: length ? 1 : 0,
      fromFallback: true
    }
  }

  const items = data.content ?? data.items ?? []
  const size = data.size ?? data.pageSize ?? DEFAULT_MEETING_PAGE_SIZE
  const number = typeof data.number === 'number' ? data.number : Math.max(0, (data.page ?? 1) - 1)
  const page = data.page ?? number + 1
  const totalElements = data.totalElements ?? data.total ?? items.length
  const totalPages = data.totalPages ?? (totalElements ? Math.ceil(totalElements / size) : 0)

  return {
    ...data,
    content: items,
    items,
    totalElements,
    totalPages,
    size,
    number,
    first: data.first ?? number === 0,
    last: data.last ?? page >= totalPages,
    numberOfElements: data.numberOfElements ?? items.length,
    empty: data.empty ?? items.length === 0,
    total: data.total ?? totalElements,
    page,
    pageSize: size,
    pages: data.pages ?? totalPages,
    fromFallback: data.fromFallback ?? false
  }
}

// 获取分页例会列表
export const getMeetings = async (params?: Record<string, any>): Promise<MeetingPage> => {
  const res = await apiService.get<MeetingPage | Meeting[]>('/api/meetings', { params })
  if (!res.success) throw new Error(res.message || '获取例会列表失败')
  return normalizeMeetingPage(res.data)
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
