# 大连理工大学区块链组前端

Vue 3 + Vite + TypeScript 构建的单页站点，包含门户（成员、项目、会议、博客、联系我们等）与管理员后台（CRUD、日志、文件管理）。

## 技术栈
- Vue 3（`<script setup lang="ts">`）
- Vite + TypeScript + ESLint + Tailwind CSS
- Pinia（`src/store`）负责全局状态（loading、adminMode 等）
- Axios 二次封装（`src/api/client.ts`）+ `src/api/*` 服务模块
- Lucide 图标、Markdown-It、Chart.js 等

## 快速开始
```bash
npm install
npm run dev # 默认 3000 端口
npm run build
npm run preview
```

> 需要 Node.js ≥ 18。通过 `VITE_API_BASE_URL` 配置后端地址；未设置时默认访问 `https://api.example.com`。

## Mock / 接口降级策略
- `src/api/client.ts` 内置拦截器，若请求失败会按 URL 自动降级至 `src/common_value` 中的 mock 数据。
- 现已覆盖：成员、项目、文章、会议、管理员日志以及公共信息（站点统计、Hero Banner、联系表单）。
- `src/api/public.ts` 暴露 `getSiteStats / getHeroBanners / submitContactMessage`，供首页、联系我们等页面使用；即使后端未启动也能正常展示/提交。

## 目录速览
- `src/views/`：门户页面（例如 `MembersPage.vue`、`ProjectsPage.vue`、`ContactPage.vue`）。
- `src/components/`：按领域划分；通用组件存放在 `common/`，后台组件在 `admin/`。
- `src/api/`：所有 HTTP 服务。每个文件负责一个实体的 CRUD（返回解包后的数据对象）。
- `src/common_value/`：Mock 数据源，供 API 降级或 Storybook/离线场景使用。
- `docs/`：
  - `improvement-plan.md`：当前迭代的待办与优先级。
  - `backend-api.md`：前端所需的后端接口说明。

## 管理员入口
- `/admin` 路由承载后台界面，通过本地 token（`adminToken`）判断权限。
- 快捷键/全局事件由 `src/utils/adminEvents.ts` 触发；登录弹窗组件位于 `components/admin/AdminLogin.vue`。
- 后台的操作日志统一由 `useAdminLogs` 写入 `api/adminLog.ts`，并在请求失败时自动回退到本地存储。

## 文档 & 下一步
- 使用/参考 `docs/backend-api.md` 对接服务端实现。
- 参考 `docs/improvement-plan.md` 了解尚未完成的页面接入、守卫、测试等任务。

欢迎通过 `Contact` 页面提交合作/咨询信息：表单会调用 `/api/public/contact` 并在失败时自动生成本地工单编号。