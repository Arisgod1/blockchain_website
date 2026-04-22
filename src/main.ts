import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import './style.css'

// 创建Vue应用实例
const app = createApp(App)

// 安装插件		
app.use(createPinia())
app.use(router)
app.use(createHead())
app.use(MotionPlugin)

// 挂载应用
// 全局错误捕获，便于诊断生产环境未捕获的错误
window.addEventListener('error', (ev) => {
	// eslint-disable-next-line no-console
	console.error('[global error]', ev.error || ev.message, ev)
})

window.addEventListener('unhandledrejection', (ev) => {
	// eslint-disable-next-line no-console
	console.error('[unhandled rejection]', ev.reason)
})

app.mount('#app')