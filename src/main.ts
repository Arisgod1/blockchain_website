import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'
import './style.css'

// 创建Vue应用实例
const app = createApp(App)

// 安装插件
app.use(createPinia())
app.use(router)
app.use(createHead())

// 挂载应用
app.mount('#app')