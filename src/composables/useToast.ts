import { ref } from 'vue'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastMessage {
  id: number
  message: string
  type: ToastType
  duration: number
}

let toastId = 0

export const useToast = () => {
  const toasts = ref<ToastMessage[]>([])

  const showToast = (message: string, options: { type?: ToastType; duration?: number } = {}) => {
    const id = ++toastId
    const toast: ToastMessage = {
      id,
      message,
      type: options.type ?? 'info',
      duration: options.duration ?? 4000
    }
    toasts.value.push(toast)
    return id
  }

  const removeToast = (id: number | string) => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}
