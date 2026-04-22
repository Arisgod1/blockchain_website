import type { MeetingAttendee, Member } from '@/types/entities'
import { MOCK_MEMBERS } from '@/common_value/members'
import defaultAvatar from '@/assets/BLOCKCHAINNexus.png'

const LOCAL_MEMBER_KEY = 'admin-members-local'
const DEFAULT_AVATAR = defaultAvatar

type MemberLike = Member & { avatarUrl?: string }

const normalizeNameKey = (value?: string): string => {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[（(].*?[)）]$/g, '')
    .replace(/[\s·•・\-—_]/g, '')
}

const normalizeAvatar = (value?: string): string => {
  if (!value) return DEFAULT_AVATAR
  const normalized = value.replace(/\\/g, '/').trim()
  if (!normalized) return DEFAULT_AVATAR
  if (/^(data:|blob:)/i.test(normalized)) return normalized
  if (/^https?:\/\//i.test(normalized)) return normalized
  if (normalized.startsWith('/')) return normalized
  if (/^(src|assets)\//i.test(normalized)) return `/${normalized}`
  const cleaned = normalized.replace(/^\/+/, '')
  if (!cleaned) return DEFAULT_AVATAR
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082').replace(/\/+$/, '')
  return base ? `${base}/${cleaned}` : `/${cleaned}`
}

const readLocalMembers = (): MemberLike[] => {
  if (typeof window === 'undefined') return [...MOCK_MEMBERS]
  try {
    const raw = localStorage.getItem(LOCAL_MEMBER_KEY)
    if (!raw) return [...MOCK_MEMBERS]
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return (parsed as MemberLike[]).map((m) => ({
        ...m,
        avatar: normalizeAvatar(m.avatar ?? m.avatarUrl)
      }))
    }
  } catch (error) {
    console.warn('无法读取本地成员缓存，使用默认成员数据', error)
  }
  return [...MOCK_MEMBERS].map((m) => ({ ...m, avatar: normalizeAvatar(m.avatar) }))
}

const buildMemberIndex = (): Map<string, Member> => {
  const map = new Map<string, Member>()
  const localMembers = readLocalMembers()
  const all = [...MOCK_MEMBERS, ...localMembers]
  all.forEach((member) => {
    const idKey = normalizeNameKey(String(member.id ?? ''))
    const nameKey = normalizeNameKey(member.name)
    if (idKey) map.set(idKey, member)
    if (nameKey) map.set(nameKey, member)
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
    const lookupKeys = [
      normalizeNameKey(normalizedName),
      normalizeNameKey(String(asObject.id ?? ''))
    ]
    const matchedMember = lookupKeys
      .map((key) => memberIndex.get(key))
      .find((member): member is Member => Boolean(member))
    const resolvedName = normalizedName || matchedMember?.name || String(asObject.id ?? '')

    return {
      ...asObject,
      id: asObject.id || matchedMember?.id || resolvedName,
      name: resolvedName,
      role: asObject.role || matchedMember?.role,
      avatar: normalizeAvatar(asObject.avatar || matchedMember?.avatar)
    }
  })
}
