import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AppError {
  message: string
  code?: string
  details?: unknown
}

export const useAppStore = defineStore('app', () => {
  // 状态
  const isLoading = ref(false)
  const error = ref<AppError | null>(null)
  const isAdminMode = ref(false)
  const isOnline = ref(navigator.onLine)
  
  // 计算属性
  const hasError = computed(() => error.value !== null)
  const isInitialized = computed(() => !isLoading.value)
  
  // 动作
  function setLoading(loading: boolean) {
    isLoading.value = loading
  }
  
  function setError(errorData: AppError | null) {
    error.value = errorData
  }
  
  function clearError() {
    error.value = null
  }
  
  function setAdminMode(enabled: boolean) {
    isAdminMode.value = enabled
  }
  
  function initialize() {
    setLoading(true)
    
    // 初始化网络状态监听
    window.addEventListener('online', () => {
      isOnline.value = true
    })
    
    window.addEventListener('offline', () => {
      isOnline.value = false
    })
    
    // 模拟初始化过程
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  
  return {
    // 状态
    isLoading,
    error,
    isAdminMode,
    isOnline,
    
    // 计算属性
    hasError,
    isInitialized,
    
    // 动作
    setLoading,
    setError,
    clearError,
    setAdminMode,
    initialize
  }
})