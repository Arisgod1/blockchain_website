import apiService from '@/api/client'
import { MOCK_ADMIN_LOGS } from '@/common_value/adminLogs'
import type { AdminLogPayload, AdminOperationLog } from '@/types/entities'
import { assertApiResponseSuccess } from '@/api/utils'

const STORAGE_KEY = 'admin-operation-logs'

type PersistStrategy = (logs: AdminOperationLog[]) => void

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

const readLocalLogs = (): AdminOperationLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as AdminOperationLog[]
    }
  } catch (error) {
    console.warn('读取本地管理员日志失败:', error)
  }
  return [...MOCK_ADMIN_LOGS]
}

const writeLocalLogs: PersistStrategy = (logs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
  } catch (error) {
    console.warn('写入本地管理员日志失败:', error)
  }
}

const buildLog = (payload: AdminLogPayload): AdminOperationLog => {
  const id = `log-${generateId()}`
  return {
    id,
    entity: payload.entity,
    action: payload.action,
    targetId: payload.targetId,
    operator: payload.operator,
    result: payload.result ?? 'success',
    message: payload.message,
    timestamp: new Date().toISOString(),
    metadata: payload.metadata
  }
}

export const getAdminLogs = async (): Promise<AdminOperationLog[]> => {
  try {
    const res = await apiService.get<AdminOperationLog[]>('/api/admin/logs')
    assertApiResponseSuccess(res, '获取管理员日志失败')
    if (Array.isArray(res.data)) {
      writeLocalLogs(res.data)
      return res.data
    }
  } catch (error) {
    console.warn('获取管理员日志失败，使用本地副本:', error)
  }

  const localLogs = readLocalLogs()
  writeLocalLogs(localLogs)
  return localLogs
}

export const createAdminLog = async (payload: AdminLogPayload): Promise<AdminOperationLog> => {
  const log = buildLog(payload)

  try {
    const res = await apiService.post<AdminOperationLog>('/api/admin/logs', log)
    assertApiResponseSuccess(res, '记录管理员日志失败')
    const created = res.data ?? log
    const current = [created, ...readLocalLogs()]
    writeLocalLogs(current)
    return created
  } catch (error) {
    console.warn('远程记录管理员日志失败，已降级写入本地:', error)
    const current = [log, ...readLocalLogs()]
    writeLocalLogs(current)
    return log
  }
}

export const clearAdminLogs = async (): Promise<void> => {
  try {
    await apiService.delete('/api/admin/logs')
  } catch (error) {
    console.warn('远程清空管理员日志失败，继续清理本地记录:', error)
  }

  writeLocalLogs([])
}
