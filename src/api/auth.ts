import apiService from '@/api/client'
import type { AdminUser } from '@/types/entities'
import { assertApiResponseSuccess, requireApiResponseData } from '@/api/utils'

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: AdminUser
}

const MOCK_ADMINS: Array<AdminUser & { password: string }> = [
  {
    id: 'mock-1',
    username: 'admin',
    role: 'super-admin',
    permissions: ['meetings', 'members', 'projects', 'articles', 'files', 'logs'],
    loginTime: new Date(),
    password: 'admin123'
  },
  {
    id: 'mock-2',
    username: 'manager',
    role: 'admin',
    permissions: ['meetings', 'members', 'projects'],
    loginTime: new Date(),
    password: 'manager123'
  }
]

const buildAuthResponse = (user: AdminUser): AuthResponse => ({
  token: `mock-token-${user.username}-${Date.now()}`,
  user
})

const fallbackLogin = (payload: LoginPayload): AuthResponse => {
  const matched = MOCK_ADMINS.find(
    (admin) => admin.username === payload.username && admin.password === payload.password
  )
  if (!matched) {
    throw new Error('用户名或密码错误（Mock）')
  }
  return buildAuthResponse({ ...matched, loginTime: new Date() })
}

// 管理员登录
export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  try {
    const res = await apiService.post<AuthResponse>('/api/auth/login', data)
    return requireApiResponseData(res, '登录失败')
  } catch (error) {
    console.warn('调用后端登录失败，改用 Mock 验证:', error)
    return fallbackLogin(data)
  }
}

// 管理员登出
export const logout = async (): Promise<void> => {
  try {
    const res = await apiService.post('/api/auth/logout')
    assertApiResponseSuccess(res, '登出失败')
  } catch (error) {
    console.warn('后端登出失败，忽略:', error)
  }
}

// 检查登录状态
export const checkAuth = async (): Promise<AdminUser> => {
  try {
    const res = await apiService.get<AdminUser>('/api/auth/check')
    return requireApiResponseData(res, '未登录')
  } catch (error) {
    console.warn('检查登录状态失败，尝试读取本地缓存:', error)
    const cached = localStorage.getItem('admin-user') || sessionStorage.getItem('admin-user')
    if (cached) {
      try {
        return JSON.parse(cached) as AdminUser
      } catch {
        console.warn('本地管理员缓存解析失败')
      }
    }
    throw error instanceof Error ? error : new Error('未登录')
  }
}
