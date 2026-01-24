import type { MeetingAttendee, Member } from '@/types/entities'
import { MOCK_MEMBERS } from '@/common_value/members'

const LOCAL_MEMBER_KEY = 'admin-members-local'
const DEFAULT_AVATAR = '/images/default-avatar.svg'

const normalizeAvatar = (value?: string): string => {
  if (!value) return DEFAULT_AVATAR
  const cleaned = value.replace(/\\/g, '/').replace(/^\/+/, '')
  if (!cleaned) return DEFAULT_AVATAR
  if (/^https?:\/\//i.test(cleaned)) return cleaned
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082').replace(/\/+$/, '')
  return base ? `${base}/${cleaned}` : `/${cleaned}`
}

const readLocalMembers = (): Member[] => {
  if (typeof window === 'undefined') return [...MOCK_MEMBERS]
  try {
    const raw = localStorage.getItem(LOCAL_MEMBER_KEY)
    if (!raw) return [...MOCK_MEMBERS]
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return (parsed as Member[]).map((m) => ({ ...m, avatar: normalizeAvatar(m.avatar) }))
    }
  } catch (error) {
    console.warn('无法读取本地成员缓存，使用默认成员数据', error)
  }
  return [...MOCK_MEMBERS].map((m) => ({ ...m, avatar: normalizeAvatar(m.avatar) }))
}

const buildMemberIndex = (): Map<string, Member> => {
  const map = new Map<string, Member>()
  const localMembers = readLocalMembers()
  const all = localMembers.length ? localMembers : [...MOCK_MEMBERS]
  all.forEach((member) => {
    if (member.id) map.set(String(member.id).toLowerCase(), member)
    if (member.name) map.set(member.name.toLowerCase().trim(), member)
  })
  return map
}

export const mergeAttendeesWithMembers = (attendees: Array<MeetingAttendee | string>): MeetingAttendee[] => {
  if (!attendees?.length) return []
  const memberIndex = buildMemberIndex()

  return attendees.map((attendee) => {
    const asObject: MeetingAttendee = typeof attendee === 'string'
      ? { id: attendee, name: attendee }
      : attendee

    const normalizedName = (asObject.name || '').trim()
    const lookupKey = (normalizedName || asObject.id || '').toString().toLowerCase()
    const matchedMember = memberIndex.get(lookupKey)

    return {
      ...asObject,
      id: asObject.id || matchedMember?.id || normalizedName,
      name: normalizedName,
      role: asObject.role || matchedMember?.role,
      avatar: normalizeAvatar(asObject.avatar || matchedMember?.avatar)
    }
  })
}
