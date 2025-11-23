# 项目完善功能清单

> 本清单基于 `main` 分支 2025-11-23 代码状态，列出前端当前缺失或需增强的能力，方便逐项跟进。引用到的文件已在 `src/` 中实现基础结构。

## 全局任务
| 模块 | 任务 | 现状 | 优先级 | 关联文件 |
| --- | --- | --- | --- | --- |
| API 层 | 为 `ApiService` 的 POST/PUT/DELETE 提供 Mock 降级策略，并统一错误对象结构 | 仅 GET 根据 URL fallback，其他方法直接抛错 | 高 | `src/api/client.ts` |
| 状态管理 | 复用 `useAppStore` 管控 loading/error，全局 toast 与重试 | Page 级组件内各自处理，体验不一致 | 中 | `src/store/app.ts`, `src/composables/useToast.ts` |
| 路由守卫 | 管理员守卫需接入真实 `auth` 接口，token 续期/失效处理 | 仅凭 `localStorage.adminToken` 判断 | 高 | `src/router/index.ts`, `src/api/auth.ts` |
| UI 基础 | 补齐空态、骨架、错误占位；`Base*` 组件库需要 loading/empty 组件 | 多数页面缺省提示 | 中 | `src/components/common` |
| 文档 & 测试 | README、部署说明、接口文档、最小组件测试 | 当前缺失 | 中 | `README.md` (待建) |

## 页面级任务
### Home / Landing
- 汇总各子模块统计：项目总数、成员、文章等，调用即将实现的 `public` 接口或批量请求。
- 英雄区 CTA 需跳转到管理后台/招新链接，并在移动端适配。

### About
- 利用 `common_value/members.ts` & `projects.ts` 生成时间轴；引入图表（已安装 `chart.js`）。

### Members (`MembersPage.vue`)
- 分页 + 筛选（年级、方向、标签）；与 `AdminMemberManager` 共用 schema。
- 详情弹窗 `MemberDetailModal` 接入 API，支持一键复制联系方式。

### Projects (`ProjectsPage.vue`)
- 目前将全部项目存入 `totalProjects`；需改为分页数据源 + 搜索/排序。
- 新建/编辑弹窗 `ProjectCreateModal` 缺少 form 校验与 API 接入。
- 统计卡片与筛选栏数据应来自后端聚合字段，提供 skeleton。

### Blog (`BlogPage.vue`)
- 接入 `getArticles` 分页、标签过滤；`ArticleDetailModal` 显示 markdown (`markdown-it` 已安装)。
- 点赞入口已下线，保留浏览量与点赞数的只读展示，并在文案中提示数据来自后端统计。

### Meetings & Events
- `MeetingsPage` 需对接 `MeetingDetailModal` + `FileViewerModal`，支持附件下载（`api/file.ts`）。
- `EventsPage` 使用 `meetings.ts` mock，需要真实 API 或 `public/events` 接口。

### Contact
- 新建 `ContactForm` 组件，校验姓名/邮箱/内容，提交到 `/api/public/contact` 并提供反馈状态。

## 管理员后台任务
1. **登录流程**：`AdminLogin.vue` 使用 `api/auth.ts`，成功后写入 token、user，并触发 Pinia store；失败展示 `BaseToast`。
2. **导航与权限**：`AdminLayout.vue` 根据角色显示不同模块（成员/项目/文章/会议/文件/日志）。
3. **CRUD 一致性**：所有管理组件复用 `useToast`、`useAdminLogs`，在成功/失败时记录日志。
4. **文件管理**：实现上传（含进度条）、下载、删除，多选批量操作。
5. **操作日志**：`AdminLogViewer.vue` 接入 `api/adminLog.ts`，支持过滤操作人、实体、时间区间。

## 支撑任务
- `src/api/public.ts`：实现 `getSiteStats`, `getHeroBanners`, `submitContactMessage` 等公共接口封装。
- `src/utils/adminEvents.ts`：梳理键盘快捷键与焦点状态，保证后台入口可配置。
- 测试建议：引入 `vitest` + `@vue/test-utils`，对核心组件（如 `MemberCard`, `ProjectCard`）编写快照与交互测试。

> 建议创建 Issue 或迭代计划，将以上任务拆分为可在 1-2 日内完成的 Story，逐一关闭。