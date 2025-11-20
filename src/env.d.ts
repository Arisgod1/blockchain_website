/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module 'chart.js' {
  export interface ChartConfiguration {
    type?: string
    data?: Record<string, unknown>
    options?: Record<string, unknown>
    plugins?: Array<Record<string, unknown>>
  }
}

declare global {
  interface Window {
    adminKeySequence: number[]
    adminMode: boolean
    __routerHooks?: {
      routerHook?: () => void
      afterRouterHook?: () => void
    }
  }
}

export {}