import { ref, computed } from 'vue'
import type { AdminLogPayload, AdminOperationLog } from '@/types/entities'
import { getAdminLogs, createAdminLog, clearAdminLogs } from '@/api/adminLog'
import { dispatchAdminLogCreated } from '@/utils/adminEvents'

const logs = ref<AdminOperationLog[]>([])
const loading = ref(false)
const initialized = ref(false)
const error = ref<string | null>(null)

const getCurrentAdminName = (): string => {
  try {
    const adminRaw = localStorage.getItem('admin-user')
    if (adminRaw) {
      const parsed = JSON.parse(adminRaw) as { username?: string }
      return parsed.username ?? 'admin'
    }
  } catch (parseError) {
    console.warn('解析管理员信息失败:', parseError)
  }
  return 'admin'
}

const ensureInitialized = async () => {
  if (initialized.value || loading.value) return
  await loadLogs()
}

const loadLogs = async () => {
  loading.value = true
  try {
    logs.value = await getAdminLogs()
    error.value = null
  } catch (err) {
    console.error('加载管理员操作日志失败:', err)
    error.value = err instanceof Error ? err.message : '加载失败'
    if (logs.value.length === 0) {
      logs.value = []
    }
  } finally {
    loading.value = false
    initialized.value = true
  }
}

const addLog = async (payload: AdminLogPayload) => {
  await ensureInitialized()
  const enrichedPayload: AdminLogPayload = {
    ...payload,
    operator: payload.operator ?? getCurrentAdminName()
  }
  const log = await createAdminLog(enrichedPayload)
  logs.value = [log, ...logs.value]
  dispatchAdminLogCreated(log)
  return log
}

const removeAllLogs = async () => {
  await clearAdminLogs()
  logs.value = []
}

export const useAdminLogs = () => {
  const totalLogs = computed(() => logs.value.length)
  const lastLog = computed(() => logs.value[0] ?? null)

  return {
    logs,
    loading,
    error,
    totalLogs,
    lastLog,
    loadLogs,
    addLog,
    removeAllLogs
  }
}

export const recordAdminOperation = async (payload: AdminLogPayload) => {
  return addLog(payload)
}
