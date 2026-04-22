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

interface BackendAuthResponse {
  accessToken?: string
  refreshToken?: string
  tokenType?: string
  expiresIn?: number
  username?: string
  role?: string
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

const mapBackendAuthResponse = (payload: BackendAuthResponse): AuthResponse => {
  const normalizedRole = String(payload.role || 'ADMIN').toUpperCase()
  return {
    token: payload.accessToken || `token-${Date.now()}`,
    user: {
      id: `admin-${String(payload.username || 'admin')}`,
      username: String(payload.username || 'admin'),
      role: normalizedRole === 'ADMIN' ? 'super-admin' : 'admin',
      permissions: ['meetings', 'members', 'projects', 'articles', 'files', 'logs'],
      loginTime: new Date()
    }
  }
}

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
    const res = await apiService.post<BackendAuthResponse>('/api/auth/login', data)
    const backendPayload = requireApiResponseData(res, '登录失败')
    return mapBackendAuthResponse(backendPayload)
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
    const res = await apiService.get<boolean>('/api/auth/validate')
    assertApiResponseSuccess(res, '校验登录状态失败')

    if (!res.data) {
      throw new Error('未登录')
    }

    const cached = localStorage.getItem('admin-user') || sessionStorage.getItem('admin-user')
    if (cached) {
      try {
        return JSON.parse(cached) as AdminUser
      } catch {
        console.warn('本地管理员缓存解析失败')
      }
    }

    return {
      id: 'admin-unknown',
      username: 'admin',
      role: 'admin',
      permissions: ['meetings', 'members', 'projects', 'articles', 'files', 'logs'],
      loginTime: new Date()
    }
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
