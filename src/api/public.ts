import apiService from '@/api/client'
import type { SiteStats, HeroBanner, ContactRequest, ContactResponse, PublicEvent } from '@/types/entities'
import { MOCK_SITE_STATS, MOCK_HERO_BANNERS, MOCK_CONTACT_RESPONSE, MOCK_PUBLIC_EVENTS } from '@/common_value/public'

const withFallback = <T>(data: T | undefined, fallback: T): T => {
	return data ?? fallback
}

export const getSiteStats = async (): Promise<SiteStats> => {
	try {
		const res = await apiService.get<SiteStats>('/api/public/stats')
		if (!res.success) throw new Error(res.message || '获取站点统计失败')
		return withFallback(res.data, MOCK_SITE_STATS)
	} catch (error) {
		console.warn('获取站点统计失败，使用本地 Mock 数据', error)
		return MOCK_SITE_STATS
	}
}

export const getHeroBanners = async (): Promise<HeroBanner[]> => {
	try {
		const res = await apiService.get<HeroBanner[]>('/api/public/hero-banners')
		if (!res.success) throw new Error(res.message || '获取 Hero Banners 失败')
		return withFallback(res.data, MOCK_HERO_BANNERS)
	} catch (error) {
		console.warn('获取 Hero Banners 失败，使用本地 Mock 数据', error)
		return MOCK_HERO_BANNERS
	}
}

export const submitContactMessage = async (payload: ContactRequest): Promise<ContactResponse> => {
	try {
		const res = await apiService.post<ContactResponse>('/api/public/contact', payload)
		if (!res.success) throw new Error(res.message || '提交联系表单失败')
		return withFallback(res.data, {
			...MOCK_CONTACT_RESPONSE,
			ticketId: `${MOCK_CONTACT_RESPONSE.ticketId}-${Date.now()}`
		})
	} catch (error) {
		console.warn('提交联系表单失败，降级为 Mock 响应', error)
		return {
			...MOCK_CONTACT_RESPONSE,
			ticketId: `${MOCK_CONTACT_RESPONSE.ticketId}-${Date.now()}`
		}
	}
}

export const getPublicEvents = async (params?: Record<string, unknown>): Promise<PublicEvent[]> => {
	try {
		const res = await apiService.get<PublicEvent[]>('/api/public/events', { params })
		if (!res.success) throw new Error(res.message || '获取活动列表失败')
		return withFallback(res.data, MOCK_PUBLIC_EVENTS)
	} catch (error) {
		console.warn('获取公共活动失败，使用 Mock:', error)
		return MOCK_PUBLIC_EVENTS
	}
}

export default {
	getSiteStats,
	getHeroBanners,
	submitContactMessage
}
