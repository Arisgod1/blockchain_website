import apiService from '@/api/client'
import type {
  AboutData,
  ApiResponse,
  ContactInfo,
  ContactMessage,
  ContactMessagePayload,
  HomeData
} from '@/types/entities'

function ensureData<T>(response: ApiResponse<T>, fallbackMessage: string): T {
  if (!response.success || !response.data) {
    throw new Error(response.message || fallbackMessage)
  }
  return response.data
}

export const getHomeData = async (): Promise<HomeData> => {
  const res = await apiService.get<HomeData>('/api/public/home')
  return ensureData(res, '获取首页数据失败')
}

export const getAboutData = async (): Promise<AboutData> => {
  const res = await apiService.get<AboutData>('/api/public/about')
  return ensureData(res, '获取关于我们数据失败')
}

export const getContactInfo = async (): Promise<ContactInfo> => {
  const res = await apiService.get<ContactInfo>('/api/contact/info')
  return ensureData(res, '获取联系信息失败')
}

export const submitContactMessage = async (payload: ContactMessagePayload): Promise<ContactMessage> => {
  const res = await apiService.post<ContactMessage>('/api/contact/messages', payload)
  return ensureData(res, '提交留言失败')
}
