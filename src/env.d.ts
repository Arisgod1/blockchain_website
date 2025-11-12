/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'chart.js' {
  export interface ChartConfiguration {
    type?: string
    data?: any
    options?: any
    plugins?: any[]
  }
}

declare global {
  interface Window {
    adminKeySequence: number[]
    adminMode: boolean
  }
}