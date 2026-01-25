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

export type PageMeeting = PageResult<Meeting>

// 获取分页例会列表
export const getMeetings = async (params?: PaginationParams & Record<string, unknown>): Promise<PageMeeting> => {
  try {
    const res = await apiService.get<PageMeeting | Meeting[]>('/api/meetings', { params })
    assertApiResponseSuccess(res, '获取例会列表失败')
    return ensurePagedData<Meeting>(res.data, params, readLocal())
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
    const res = await apiService.get<Meeting>(`/api/meetings/${id}`)
    assertApiResponseSuccess(res, '获取例会失败')
    return res.data ?? null
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
  try {
    const res = await apiService.post<Meeting>('/api/meetings', payload)
    return requireApiResponseData(res, '创建例会失败')
  } catch (error) {
    const respStatus = getStatus(error)
    if (respStatus) {
      console.warn('远程创建例会失败，回退到本地：', respStatus)
    } else {
      console.warn('远程创建例会失败（网络），回退到本地：', error)
    }
    const items = readLocal()
    const time = (payload.meeting_time || '00:00').replace('Z', '')
    const meetingTime = payload.meetingTime || `${new Date().toISOString().slice(0, 10)}T${time}`
    const created: Meeting = {
      id: payload.id ?? nextId(),
      title: payload.title ?? '未命名例会',
      summary: payload.summary ?? '',
      meetingTime,
      meeting_time: time,
      duration: payload.duration ?? 60,
      attendees: payload.attendees ?? [],
      status: payload.status ?? 'upcoming',
      agenda: payload.agenda ?? [],
      content: payload.content ?? '',
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
      location: payload.location ?? ''
    }
    items.unshift(created)
    writeLocal(items)
    return created
  }
}

// 更新例会
export const updateMeeting = async (id: string | number, payload: Partial<Meeting>): Promise<Meeting> => {
  try {
    const res = await apiService.put<Meeting>(`/api/meetings/${id}`, payload)
    return requireApiResponseData(res, '更新例会失败')
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
    const updated: Meeting = { ...items[idx], ...payload }
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
