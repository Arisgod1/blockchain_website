import apiService from '@/api/client'
import type { Meeting } from '@/types/entities'
import { ensurePagedData, assertApiResponseSuccess, requireApiResponseData, type PaginationParams, type PageResult } from '@/api/utils'
import { MOCK_MEETINGS } from '@/common_value/meetings'

type HttpError = { response?: { status?: number } }
const getStatus = (error: unknown): number | undefined => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const resp = (error as HttpError).response
    return resp?.status
  }
  return undefined
}
const hasResponse = (error: unknown): boolean => typeof error === 'object' && error !== null && 'response' in error

const LOCAL_KEY = 'admin-meetings-local'
const readLocal = (): Meeting[] => {
  const stored = localStorage.getItem(LOCAL_KEY)
  if (!stored) return [...MOCK_MEETINGS]
  try {
    const parsed = JSON.parse(stored) as Meeting[]
    return Array.isArray(parsed) ? parsed : [...MOCK_MEETINGS]
  } catch {
    return [...MOCK_MEETINGS]
  }
}
const writeLocal = (items: Meeting[]) => localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
const nextId = () => Date.now().toString()

type BackendMeetingStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'

interface MeetingDto {
  id?: string | number
  title?: string
  content?: string
  meetingType?: string
  status?: BackendMeetingStatus | string
  meetingTime?: string
  location?: string
  attendees?: string[]
  meetingNotes?: string
  conclusion?: string
  actionItems?: string
  tags?: string
}

const mapStatusFromDto = (status?: string): Meeting['status'] => {
  const normalized = String(status || 'SCHEDULED').toUpperCase()
  switch (normalized) {
    case 'IN_PROGRESS':
      return 'ongoing'
    case 'COMPLETED':
      return 'completed'
    case 'CANCELLED':
      return 'cancelled'
    case 'POSTPONED':
      return 'draft'
    case 'SCHEDULED':
    default:
      return 'upcoming'
  }
}

const mapStatusToDto = (status?: Meeting['status']): BackendMeetingStatus => {
  switch (status) {
    case 'ongoing':
      return 'IN_PROGRESS'
    case 'completed':
      return 'COMPLETED'
    case 'cancelled':
      return 'CANCELLED'
    case 'draft':
      return 'POSTPONED'
    case 'upcoming':
    default:
      return 'SCHEDULED'
  }
}

const mapDtoToMeeting = (dto: MeetingDto): Meeting => {
  const meetingTime = dto.meetingTime || new Date().toISOString()
  return {
    id: String(dto.id ?? ''),
    title: dto.title || '未命名例会',
    meetingTime,
    meeting_time: meetingTime.split('T')[1]?.slice(0, 5) || '00:00',
    summary: dto.content || dto.meetingNotes || '',
    location: dto.location || '',
    status: mapStatusFromDto(dto.status),
    types: dto.meetingType ? [dto.meetingType] : [],
    attendees: Array.isArray(dto.attendees) ? dto.attendees : [],
    content: dto.content || '',
    tags: (dto.tags || '').split(',').map((item) => item.trim()).filter(Boolean),
    notes: dto.meetingNotes || dto.conclusion || '',
    actionItems: [],
    issues: [],
    files: []
  }
}

const normalizeAttendeesForApi = (attendees?: Meeting['attendees']): string[] => {
  if (!Array.isArray(attendees)) return []
  return attendees
    .map((attendee) => (typeof attendee === 'string' ? attendee : attendee?.name))
    .map((name) => String(name ?? '').trim())
    .filter(Boolean)
}

const normalizeMeetingPayloadForApi = (payload: Partial<Meeting>): Partial<MeetingDto> => {
  const meetingDate = typeof payload.meetingTime === 'string' && payload.meetingTime
    ? payload.meetingTime.slice(0, 10)
    : new Date().toISOString().slice(0, 10)

  const meetingTime = String(payload.meeting_time || payload.meetingTime?.split('T')[1]?.slice(0, 5) || '14:00')

  return {
    id: payload.id,
    title: payload.title,
    content: payload.content || payload.summary,
    meetingType: Array.isArray(payload.types) ? payload.types[0] : undefined,
    status: mapStatusToDto(payload.status),
    meetingTime: `${meetingDate}T${meetingTime.length === 5 ? `${meetingTime}:00` : meetingTime}`,
    location: payload.location,
    attendees: normalizeAttendeesForApi(payload.attendees),
    meetingNotes: payload.notes,
    conclusion: payload.notes,
    actionItems: Array.isArray(payload.actionItems)
      ? payload.actionItems.map((item) => item.description).filter(Boolean).join('\n')
      : undefined,
    tags: Array.isArray(payload.tags) ? payload.tags.join(',') : undefined
  }
}

const normalizeIncomingMeeting = (value: Meeting | MeetingDto): Meeting => {
  if (value && typeof value === 'object' && 'meeting_time' in value) {
    return value as Meeting
  }
  return mapDtoToMeeting(value as MeetingDto)
}

export type PageMeeting = PageResult<Meeting>

// 获取分页例会列表
export const getMeetings = async (params?: PaginationParams & Record<string, unknown>): Promise<PageMeeting> => {
  try {
    const res = await apiService.get<PageResult<MeetingDto | Meeting> | Array<MeetingDto | Meeting>>('/api/meetings', { params })
    assertApiResponseSuccess(res, '获取例会列表失败')
    const page = ensurePagedData<MeetingDto | Meeting>(res.data, params, readLocal())
    return {
      ...page,
      content: (page.content || []).map((item) => normalizeIncomingMeeting(item))
    }
  } catch (error) {
      // 如果是服务器错误(5xx)，当作网络回退到本地 mock 数据以保证前端可用
      const respStatus = getStatus(error)
      if (respStatus && respStatus >= 500 && respStatus < 600) {
        console.warn('远程创建例会返回服务器错误，回退到本地：', respStatus)
      } else if (hasResponse(error)) {
        throw error
      }
    return ensurePagedData<Meeting>(readLocal(), params)
  }
}

// 根据 ID 获取单个例会
export const getMeeting = async (id: string | number): Promise<Meeting | null> => {
  try {
    const res = await apiService.get<MeetingDto | Meeting>(`/api/meetings/${id}`)
    assertApiResponseSuccess(res, '获取例会失败')
    return res.data ? normalizeIncomingMeeting(res.data) : null
  } catch (error) {
      const respStatus = getStatus(error)
      if (respStatus && respStatus >= 500 && respStatus < 600) {
        console.warn('远程更新例会返回服务器错误，回退到本地：', respStatus)
      } else if (hasResponse(error)) {
        throw error
      }
    return readLocal().find(item => item.id === id) ?? null
  }
}

// 创建新例会
export const createMeeting = async (payload: Partial<Meeting>): Promise<Meeting> => {
  const normalizedPayload = normalizeMeetingPayloadForApi(payload)
  try {
    const res = await apiService.post<MeetingDto | Meeting>('/api/meetings', normalizedPayload)
    return normalizeIncomingMeeting(requireApiResponseData(res, '创建例会失败'))
  } catch (error) {
    const respStatus = getStatus(error)
    if (respStatus) {
      console.warn('远程创建例会失败，回退到本地：', respStatus)
    } else {
      console.warn('远程创建例会失败（网络），回退到本地：', error)
    }
    const items = readLocal()
    const time = String(payload.meeting_time || '00:00').replace('Z', '')
    const meetingTime = payload.meetingTime || `${new Date().toISOString().slice(0, 10)}T${time}`
    const created: Meeting = {
      id: String(normalizedPayload.id ?? nextId()),
      title: normalizedPayload.title ?? '未命名例会',
      summary: payload.summary ?? payload.content ?? '',
      meetingTime,
      meeting_time: time,
      duration: payload.duration ?? 60,
      attendees: normalizeAttendeesForApi(normalizedPayload.attendees),
      status: payload.status ?? mapStatusFromDto(normalizedPayload.status),
      agenda: payload.agenda ?? [],
      content: normalizedPayload.content ?? payload.content ?? '',
      decisions: payload.decisions ?? [],
      actionItems: payload.actionItems ?? [],
      issues: payload.issues ?? [],
      files: payload.files ?? [],
      attachments: payload.attachments ?? [],
      tags: payload.tags ?? [],
      recording: payload.recording ?? '',
      minutes: payload.minutes ?? '',
      recorder: payload.recorder ?? '',
      isPublic: payload.isPublic ?? true,
      notes: payload.notes ?? '',
      location: normalizedPayload.location ?? ''
    }
    items.unshift(created)
    writeLocal(items)
    return created
  }
}

// 更新例会
export const updateMeeting = async (id: string | number, payload: Partial<Meeting>): Promise<Meeting> => {
  const normalizedPayload = normalizeMeetingPayloadForApi(payload)
  try {
    const res = await apiService.put<MeetingDto | Meeting>(`/api/meetings/${id}`, normalizedPayload)
    return normalizeIncomingMeeting(requireApiResponseData(res, '更新例会失败'))
  } catch (error) {
    const respStatus = getStatus(error)
    if (respStatus) {
      console.warn('远程更新例会失败，回退到本地：', respStatus)
    } else {
      console.warn('远程更新例会失败（网络），回退到本地：', error)
    }
    const items = readLocal()
    const idx = items.findIndex(item => item.id === id)
    if (idx === -1) throw error
    const updated: Meeting = {
      ...items[idx],
      ...payload,
      status: payload.status ?? mapStatusFromDto(normalizedPayload.status),
      attendees: normalizeAttendeesForApi(normalizedPayload.attendees),
      content: normalizedPayload.content ?? payload.content ?? items[idx].content
    }
    items[idx] = updated
    writeLocal(items)
    return updated
  }
}

// 删除例会
export const deleteMeeting = async (id: string | number): Promise<void> => {
  try {
    const res = await apiService.delete(`/api/meetings/${id}`)
    assertApiResponseSuccess(res, '删除例会失败')
    return
  } catch (error) {
    if (hasResponse(error)) throw error
    const items = readLocal().filter(item => item.id !== id)
    writeLocal(items)
  }
}
