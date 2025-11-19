import { ref } from 'vue'
import type { Project } from '@/types/entities'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

/**
 * useProjects - 一个轻量的 Vue composable，用来封装 Projects 的 fetch 请求
 * - 提供：projects, loading, error, fetchProjects(params), getProject(id)
 * - 基于 fetch，兼容后端返回 ApiResponse<T> 或直接返回数组的情况
 */
export function useProjects() {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const buildUrl = (path: string, params?: Record<string, any>) => {
    // 如果 API_BASE 为空，直接使用相对路径
    const base = API_BASE ? API_BASE.replace(/\/$/, '') : ''
    const url = new URL(`${base}${path}`, base || window.location.origin)
    if (params) {
      Object.keys(params).forEach((k) => {
        const v = params[k]
        if (v === undefined || v === null) return
        if (Array.isArray(v)) {
          v.forEach((item) => url.searchParams.append(k, String(item)))
        } else {
          url.searchParams.append(k, String(v))
        }
      })
    }
    return url.toString()
  }

  const fetchProjects = async (params?: Record<string, any>) => {
    loading.value = true
    error.value = null
    try {
      const url = buildUrl('/api/projects/', params)
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow'
      })

      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

      // 先尝试以 text 方式读取（兼容示例），再尝试解析 JSON
      const txt = await res.text()
      let data: any = null
      try {
        data = JSON.parse(txt)
      } catch {
        // 如果返回的是纯文本或 HTML，就把文本当作结果（此时 projects 设为空）
        error.value = txt
        projects.value = []
        return projects.value
      }

      // 如果服务端遵循 ApiResponse<T> 结构
      if (data && typeof data === 'object' && 'success' in data) {
        if (!data.success) throw new Error(data.message || '请求失败')
        projects.value = data.data ?? []
      } else if (Array.isArray(data)) {
        // 直接返回数组
        projects.value = data
      } else {
        projects.value = []
      }

      return projects.value
    } catch (e: any) {
      error.value = e?.message ?? String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const getProject = async (id: string | number) => {
    loading.value = true
    error.value = null
    try {
      const url = buildUrl(`/api/projects/${id}`)
      const res = await fetch(url, { method: 'GET', redirect: 'follow' })
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
      const data = await res.json()
      if (data && typeof data === 'object' && 'success' in data) {
        if (!data.success) throw new Error(data.message || '请求失败')
        return data.data ?? null
      }
      return data
    } catch (e: any) {
      error.value = e?.message ?? String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // 解析 fetch Response：先 text，再尝试 JSON 解析，兼容 ApiResponse<T> 或直接返回对象/数组
  const parseResponse = async (res: Response) => {
    const txt = await res.text()
    try {
      return JSON.parse(txt)
    } catch {
      return txt
    }
  }

  const createProject = async (payload: Partial<Project>): Promise<Project> => {
    loading.value = true
    error.value = null
    try {
      const url = buildUrl('/api/projects')
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      })

      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
      const data = await parseResponse(res)

      let created: any = null
      if (data && typeof data === 'object' && 'success' in data) {
        if (!data.success) throw new Error(data.message || '创建失败')
        created = data.data
      } else {
        created = data
      }

      if (created) {
        // 同步本地列表（如果已加载）
        projects.value = [created, ...projects.value]
      }

      return created
    } catch (e: any) {
      error.value = e?.message ?? String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id: string | number | null, payload: Partial<Project>): Promise<Project> => {
    loading.value = true
    error.value = null
    try {
      const path = id ? `/api/projects/${id}` : '/api/projects/'
      const url = buildUrl(path)
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      })

      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
      const data = await parseResponse(res)

      let updated: any = null
      if (data && typeof data === 'object' && 'success' in data) {
        if (!data.success) throw new Error(data.message || '更新失败')
        updated = data.data
      } else {
        updated = data
      }

      if (updated) {
        const idx = projects.value.findIndex((p) => String(p.id) === String(updated.id))
        if (idx >= 0) projects.value.splice(idx, 1, updated)
      }

      return updated
    } catch (e: any) {
      error.value = e?.message ?? String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (id: string | number): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const url = buildUrl(`/api/projects/${id}`)
      const res = await fetch(url, { method: 'DELETE', redirect: 'follow' })
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
      const data = await parseResponse(res)

      // 若返回 ApiResponse 检查 success
      if (data && typeof data === 'object' && 'success' in data && !data.success) {
        throw new Error(data.message || '删除失败')
      }

      // 同步本地列表
      const idx = projects.value.findIndex((p) => String(p.id) === String(id))
      if (idx >= 0) projects.value.splice(idx, 1)
      return
    } catch (e: any) {
      error.value = e?.message ?? String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProject
    , createProject, updateProject, deleteProject
  }
}

export default useProjects
