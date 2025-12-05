import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAppStore } from '@/store/app'
import type { ApiResponse } from '@/types/entities'
import type { PageResult } from '@/api/utils'
import { MOCK_PROJECTS } from '@/common_value/projects'
import { MOCK_MEMBERS } from '@/common_value/members'
import { MOCK_ARTICLES } from '@/common_value/articles'
import { MOCK_MEETINGS } from '@/common_value/meetings'
import { MOCK_ADMIN_LOGS } from '@/common_value/adminLogs'
import { MOCK_SITE_STATS, MOCK_HERO_BANNERS, MOCK_CONTACT_RESPONSE } from '@/common_value/public'
import { MOCK_FILES } from '@/common_value/files'

class ApiService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private isPageResultPayload(payload: unknown): payload is PageResult<unknown> {
    if (!payload || typeof payload !== 'object') return false
    const record = payload as Record<string, unknown>
    return Array.isArray(record.content) && typeof record.totalElements === 'number' && typeof record.totalPages === 'number'
  }

  private normalizeResponsePayload<T>(raw: unknown): ApiResponse<T> {
    if (raw && typeof raw === 'object') {
      const record = raw as Record<string, unknown>

      if (typeof record.code === 'number') {
        return {
          code: record.code,
          message: typeof record.message === 'string' ? record.message : undefined,
          data: record.data as T,
          timestamp: typeof record.timestamp === 'number' ? record.timestamp : Date.now(),
          error: typeof record.error === 'string' ? record.error : undefined
        }
      }

      if (this.isPageResultPayload(record)) {
        return {
          code: 200,
          message: 'OK',
          data: raw as T,
          timestamp: Date.now()
        }
      }
    }

    return {
      code: 200,
      message: 'OK',
      data: raw as T,
      timestamp: Date.now()
    }
  }

  private getMockData(url: string): unknown {
    if (url.includes('/projects')) {
      return MOCK_PROJECTS
    } else if (url.includes('/members')) {
      return MOCK_MEMBERS
    } else if (url.includes('/articles') || url.includes('/posts')) {
      return MOCK_ARTICLES
    } else if (url.includes('/meetings')) {
      return MOCK_MEETINGS
    } else if (url.includes('/admin/logs')) {
      return MOCK_ADMIN_LOGS
    } else if (url.includes('/public/stats')) {
      return MOCK_SITE_STATS
    } else if (url.includes('/public/hero-banners')) {
      return MOCK_HERO_BANNERS
    } else if (url.includes('/public/contact')) {
      return MOCK_CONTACT_RESPONSE
    } else if (url.includes('/files')) {
      return MOCK_FILES
    }
    return null
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加请求时间戳
            
       
        
        // 添加认证令牌（如果有）
        const token = localStorage.getItem('adminToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 计算请求耗时
        const endTime = Date.now()
        const resConfig = response.config as import('axios').InternalAxiosRequestConfig & { metadata?: { startTime?: number } }
        const duration = endTime - (resConfig.metadata?.startTime ?? endTime)
        console.log(`API 请求 ${response.config.url} 耗时: ${duration}ms`)

        return response
      },
      async (error) => {
        const appStore = useAppStore()
        const url = error.config?.url || ''
        
        // 尝试获取 Mock 数据
        const mockData = this.getMockData(url)

        if (mockData) {
          console.warn(`API 请求失败: ${url}，已降级使用本地 Mock 数据`)
          // 构造成功的响应结构
          return {
            data: {
              code: 200,
              data: mockData,
              message: 'Loaded from local mock data (Fallback)',
              timestamp: Date.now()
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: error.config
          }
        }

        if (error.response) {
          // 服务器返回错误状态码
          const { status, data } = error.response
          
          switch (status) {
            case 401:
              // 未授权，清除令牌并跳转到登录页
              localStorage.removeItem('adminToken')
              appStore.setError({
                message: '登录已过期，请重新登录',
                code: 'UNAUTHORIZED'
              })
              break
            case 403:
              appStore.setError({
                message: '没有权限访问此资源',
                code: 'FORBIDDEN'
              })
              break
            case 404:
              appStore.setError({
                message: '请求的资源不存在',
                code: 'NOT_FOUND'
              })
              break
            case 500:
              appStore.setError({
                message: '服务器内部错误',
                code: 'SERVER_ERROR'
              })
              break
            default:
              appStore.setError({
                message: data?.message || '请求失败',
                code: 'REQUEST_FAILED'
              })
          }
        } else if (error.request) {
          // 网络错误
          appStore.setError({
            message: '网络连接失败，请检查网络设置',
            code: 'NETWORK_ERROR'
          })
        } else {
          // 其他错误
          appStore.setError({
            message: error.message || '请求配置错误',
            code: 'CONFIG_ERROR'
          })
        }

        return Promise.reject(error)
      }
    )
  }

  // GET 请求
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get(url, config)
    return this.normalizeResponsePayload<T>(response.data)
  }

  // POST 请求
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, data, config)
    return this.normalizeResponsePayload<T>(response.data)
  }

  // PUT 请求
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data, config)
    return this.normalizeResponsePayload<T>(response.data)
  }

  // PATCH 请求
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch(url, data, config)
    return this.normalizeResponsePayload<T>(response.data)
  }

  // DELETE 请求
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete(url, config)
    return this.normalizeResponsePayload<T>(response.data)
  }

  // 文件上传
  async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      }
    })
    return this.normalizeResponsePayload<T>(response.data)
  }

  // 下载文件
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.instance.get(url, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }
}

// 创建 API 服务实例
export const apiService = new ApiService()
export default apiService