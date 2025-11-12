import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAppStore } from '@/store/app'
import type { ApiResponse } from '@/types/entities'

class ApiService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加请求时间戳
        config.metadata = { startTime: Date.now() }
        
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
        const duration = endTime - response.config.metadata?.startTime
        console.log(`API 请求 ${response.config.url} 耗时: ${duration}ms`)

        return response
      },
      (error) => {
        const appStore = useAppStore()
        
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
    return response.data
  }

  // POST 请求
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, data, config)
    return response.data
  }

  // PUT 请求
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data, config)
    return response.data
  }

  // PATCH 请求
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch(url, data, config)
    return response.data
  }

  // DELETE 请求
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete(url, config)
    return response.data
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
    return response.data
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