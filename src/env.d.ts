/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  type ComponentProps = Record<string, unknown>
  type ComponentEmits = Record<string, unknown>
  const component: DefineComponent<ComponentProps, ComponentEmits, unknown>
  export default component
}

declare module 'chart.js' {
  export interface ChartConfiguration {
    type?: string
    data?: Record<string, unknown>
    options?: Record<string, unknown>
    plugins?: unknown[]
  }
}

interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID?: string
  readonly VITE_EMAILJS_TEMPLATE_ID?: string
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    adminKeySequence: number[]
    adminMode: boolean
    __routerHooks?: {
      removeBeforeEach?: () => void
      removeAfterEach?: () => void
    }
  }
}