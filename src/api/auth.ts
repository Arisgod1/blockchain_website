import apiService from '@/api/client'
import type { AdminUser } from '@/types/entities'

// 管理员登录
export const login = async (data: any): Promise<{ token: string; user: AdminUser }> => {
  const res = await apiService.post<{ token: string; user: AdminUser }>('/api/auth/login', data)
  if (!res.success) throw new Error(res.message || '登录失败')
  if (!res.data) throw new Error('登录未返回数据')
  return res.data
}

// 管理员登出
export const logout = async (): Promise<void> => {
  const res = await apiService.post('/api/auth/logout')
  if (!res.success) throw new Error(res.message || '登出失败')
}

// 检查登录状态
export const checkAuth = async (): Promise<AdminUser> => {
  const res = await apiService.get<AdminUser>('/api/auth/check')
  if (!res.success) throw new Error(res.message || '未登录')
  if (!res.data) throw new Error('检查登录状态未返回数据')
  return res.data
}
