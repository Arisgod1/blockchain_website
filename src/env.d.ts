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