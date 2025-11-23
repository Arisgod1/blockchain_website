# 后端接口文档

> 依据前端 `src/api/*.ts` 当前实现整理，所有接口默认返回包裹结构 `{ success: boolean; message?: string; data?: T }`。管理员接口需在 Header 中携带 `Authorization: Bearer <token>`。

## 1. 认证模块 (`src/api/auth.ts`)
| 方法 | 路径 | 描述 | 请求体 | 响应 `data` |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/login` | 管理员登录 | `{ username: string, password: string }` | `{ token: string, user: AdminUser }` |
| POST | `/api/auth/logout` | 退出登录 | 无 | `null` |
| GET | `/api/auth/check` | 校验登录态 | 无 | `AdminUser` |

## 2. 成员模块 (`src/api/member.ts`)
| 方法 | 路径 | 描述 | Query/Body | 响应 |
| --- | --- | --- | --- | --- |
| GET | `/api/members` | 成员分页列表 | `page`, `size`, `keyword`, `role`, `grade` | `PageMember` |
| GET | `/api/members/{id}` | 单个成员详情 | - | `Member` |
| POST | `/api/members` | 创建成员 | `Partial<Member>` | `Member` |
| PUT | `/api/members/{id}` | 更新成员 | `Partial<Member>` | `Member` |
| DELETE | `/api/members/{id}` | 删除成员 | - | `null` |

## 3. 项目模块 (`src/api/project.ts`)
| 方法 | 路径 | 描述 | 参数 | 响应 |
| --- | --- | --- | --- | --- |
| GET | `/api/projects` | 项目分页 | `page`, `size`, `keyword`, `status`, `tag` | `PageProject` |
| GET | `/api/projects/{id}` | 项目详情 | - | `Project` |
| POST | `/api/projects` | 创建项目 | `Partial<Project>` | `Project` |
| PUT | `/api/projects/{id}` | 更新项目 | `Partial<Project>` | `Project` |
| DELETE | `/api/projects/{id}` | 删除项目 | - | `null` |
| GET | `/api/projects/status/{status}` | 按状态列出（无分页） | `status: string` | `Project[]` |
| GET | `/api/projects/search` | 条件搜索 | `keyword`, `techStack`, `status`, `tag` | `Project[]` |
| PATCH | `/api/projects/{id}/status` | 更新状态 | Query: `status` | `Project` |
| PATCH | `/api/projects/{id}/progress` | 更新进度 | Query: `progress` (0-100) | `Project` |
| PATCH | `/api/projects/{id}/display-order` | 更新顺序 | Query: `displayOrder` | `null` |

## 4. 文章/博客模块 (`src/api/article.ts`)
| 方法 | 路径 | 描述 | 参数 | 响应 |
| --- | --- | --- | --- | --- |
| GET | `/api/posts` | 文章分页列表 | `page`, `size`, `category`, `tag`, `keyword` | `PageArticle` |
| GET | `/api/posts/{id}` | 文章详情 | - | `Article` |
| POST | `/api/posts` | 发布文章 | `Partial<Article>` | `Article` |
| PUT | `/api/posts/{id}` | 更新文章 | `Partial<Article>` | `Article` |
| DELETE | `/api/posts/{id}` | 删除文章 | - | `null` |

## 5. 会议 / 例会模块 (`src/api/meeting.ts`)
| 方法 | 路径 | 描述 | 参数 | 响应 |
| --- | --- | --- | --- | --- |
| GET | `/api/meetings` | 会议分页 | `page`, `size`, `topic`, `type`, `dateRange` | `PageMeeting` |
| GET | `/api/meetings/{id}` | 会议详情 | - | `Meeting` |
| POST | `/api/meetings` | 创建会议 | `Partial<Meeting>` | `Meeting` |
| PUT | `/api/meetings/{id}` | 更新会议 | `Partial<Meeting>` | `Meeting` |
| DELETE | `/api/meetings/{id}` | 删除会议 | - | `null` |

## 6. 文件模块 (`src/api/file.ts`)
| 方法 | 路径 | 描述 | 参数 | 响应 |
| --- | --- | --- | --- | --- |
| GET | `/api/files` | 文件分页列表 | `page`, `size`, `type`, `uploader` | `PageFile` |
| POST | `/api/files/upload` | 上传文件 | FormData: `file` | `FileInfo` |
| DELETE | `/api/files/{id}` | 删除文件 | - | `null` |
| GET | `/api/files/download/{id}` | 下载文件 | Query: `fileName`(可选) | Binary |

## 7. 管理员操作日志 (`src/api/adminLog.ts`)
| 方法 | 路径 | 描述 | 参数 | 响应 |
| --- | --- | --- | --- | --- |
| GET | `/api/admin/logs` | 获取操作日志 | `entity`, `operator`, `dateRange` (建议) | `AdminOperationLog[]` |
| POST | `/api/admin/logs` | 写入日志 | `AdminLogPayload` | `AdminOperationLog` |
| DELETE | `/api/admin/logs` | 清空日志 | - | `null` |

## 8. 公共模块（建议）
> `src/api/public.ts` 目前空，可在后端提供以下接口以支撑门户页面：

| 方法 | 路径 | 描述 | 请求 | 响应 |
| --- | --- | --- | --- | --- |
| GET | `/api/public/stats` | 首页 & Contact 页统计 | - | `SiteStats`（含 `totalMembers/totalProjects/totalArticles/totalMeetings/successfulCollaborations/averageResponseHours/globalPartners`） |
| GET | `/api/public/hero-banners` | 首页大图 & CTA 配置 | - | `HeroBanner[]` |
| POST | `/api/public/contact` | 联系我们表单 | `{ name, email, message }` | `{ ticketId: string }` |
| GET | `/api/public/events` | 公开活动列表 | `page`, `size`, `category` | `PageEvent` |

> 目前 `ContactPage.vue` 已接入 `getSiteStats` 与 `submitContactMessage`，即使后端未启动也会通过 Mock 数据/工单编号保证体验一致。Hero Banner 接口可供首页、About 等模块共用。

## 9. 通用错误码 & Mock 降级
- 服务端应返回 `success=false` 并附带 `message`。前端在 `ApiService` 中捕获后会：
  1. 若为 GET 且匹配 `projects/members/articles/meetings/admin/logs`，降级到 `src/common_value` mock；
  2. 其它情况展示 toast 并抛出异常。
- 建议后端提供标准化错误码：`AUTH_401`, `VALIDATION_422`, `NOT_FOUND_404`, `SERVER_500`，便于前端精细化提示。

> 如需扩展，请同步更新 `src/api` 中的封装与本文件，保持代码与文档一致。