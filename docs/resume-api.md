# 简历投递接口文档

> 适用前端页面：src/views/ResumeApplyPage.vue
> 
> 适用前端封装：src/api/public.ts -> submitResumeApplication(formData)

## 1. 目标与范围

用于接收候选人的简历投递信息，包含文本字段与两个文件：个人照片、PDF 简历。

## 2. 接口总览

| 方法 | 路径 | 认证 | Content-Type | 说明 |
| --- | --- | --- | --- | --- |
| POST | /api/public/resume/apply | 否 | multipart/form-data | 提交简历投递 |
| GET | /api/admin/resume-applications | 是（管理员） | application/json | 后台分页查询简历列表（建议） |
| GET | /api/admin/resume-applications/{id} | 是（管理员） | application/json | 后台查看简历详情（建议） |
| PATCH | /api/admin/resume-applications/{id}/status | 是（管理员） | application/json | 更新处理状态（建议） |

## 3. 提交简历

### 3.1 请求

- Method: POST
- URL: /api/public/resume/apply
- Header:
  - Content-Type: multipart/form-data

### 3.2 FormData 字段定义

| 字段名 | 类型 | 必填 | 约束 | 说明 |
| --- | --- | --- | --- | --- |
| name | string | 是 | 1-50 字符 | 姓名 |
| studentId | string | 是 | 建议 6-32 字符 | 学号 |
| contact | string | 是 | 1-100 字符 | 联系方式（手机号/微信/邮箱） |
| techStack | string | 是 | 建议 <= 2000 字符 | 技术栈描述 |
| projectExperience | string | 是 | 建议 <= 5000 字符 | 项目经历 |
| campusExperience | string | 是 | 建议 <= 5000 字符 | 在校经历 |
| extraNote | string | 否 | 建议 <= 2000 字符 | 补充说明 |
| photo | file | 是 | image/jpeg, image/png, image/webp; <= 5MB | 个人照片 |
| resumePdf | file | 是 | application/pdf; <= 10MB | PDF 简历 |

### 3.3 成功响应

前端当前适配的响应外层结构为：

- code: number
- message?: string
- data?: T
- timestamp: number

示例：

```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "applicationId": "RESUME-20260420-0001",
    "status": "received"
  },
  "timestamp": 1776666666666
}
```

data 字段定义：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| applicationId | string | 投递回执编号 |
| status | string | received 或 processing |

### 3.4 失败响应

```json
{
  "code": 422,
  "message": "简历文件格式错误，仅支持 PDF",
  "timestamp": 1776666666666
}
```

## 4. 后台查询简历列表（建议）

### 4.1 请求

- Method: GET
- URL: /api/admin/resume-applications
- Header:
  - Authorization: Bearer <adminToken>

Query 参数建议：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| page | number | 否 | 页码，默认 1 |
| size | number | 否 | 每页条数，默认 10 |
| keyword | string | 否 | 按姓名/学号/联系方式模糊搜索 |
| status | string | 否 | received/processing/interview/rejected/accepted |
| startDate | string | 否 | 创建时间起始，ISO-8601 |
| endDate | string | 否 | 创建时间结束，ISO-8601 |

### 4.2 响应示例

```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "content": [
      {
        "id": "ra_01",
        "name": "张三",
        "studentId": "2020123456",
        "contact": "18800000000",
        "status": "received",
        "createdAt": "2026-04-20T09:00:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "page": 1,
    "size": 10
  },
  "timestamp": 1776666666666
}
```

## 5. 后台查看简历详情（建议）

### 5.1 请求

- Method: GET
- URL: /api/admin/resume-applications/{id}
- Header:
  - Authorization: Bearer <adminToken>

### 5.2 响应示例

```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "id": "ra_01",
    "name": "张三",
    "studentId": "2020123456",
    "contact": "18800000000",
    "techStack": "Java, Vue, MySQL",
    "projectExperience": "...",
    "campusExperience": "...",
    "extraNote": "每周可投入 20 小时",
    "photoUrl": "https://example.com/uploads/photos/ra_01.webp",
    "resumePdfUrl": "https://example.com/uploads/resume/ra_01.pdf",
    "status": "received",
    "reviewComment": "",
    "createdAt": "2026-04-20T09:00:00Z",
    "updatedAt": "2026-04-20T09:00:00Z"
  },
  "timestamp": 1776666666666
}
```

## 6. 后台更新处理状态（建议）

### 6.1 请求

- Method: PATCH
- URL: /api/admin/resume-applications/{id}/status
- Header:
  - Authorization: Bearer <adminToken>
  - Content-Type: application/json

Body:

```json
{
  "status": "interview",
  "reviewComment": "已通过初筛，安排面试"
}
```

status 建议枚举：

- received
- processing
- interview
- rejected
- accepted

### 6.2 响应示例

```json
{
  "code": 200,
  "message": "状态更新成功",
  "data": {
    "id": "ra_01",
    "status": "interview",
    "reviewComment": "已通过初筛，安排面试",
    "updatedAt": "2026-04-20T10:00:00Z"
  },
  "timestamp": 1776666666666
}
```

## 7. 错误码建议

| code | 含义 | 场景 |
| --- | --- | --- |
| 400 | BAD_REQUEST | 缺少必要参数 |
| 401 | UNAUTHORIZED | 后台接口未登录 |
| 403 | FORBIDDEN | 无管理员权限 |
| 404 | NOT_FOUND | 投递记录不存在 |
| 413 | PAYLOAD_TOO_LARGE | 文件超限 |
| 415 | UNSUPPORTED_MEDIA_TYPE | 文件类型不支持 |
| 422 | VALIDATION_ERROR | 字段校验失败 |
| 500 | SERVER_ERROR | 服务内部错误 |

## 8. 存储与安全建议

- 文件存储建议分离：
  - photo -> /uploads/resume/photos/
  - resumePdf -> /uploads/resume/pdfs/
- 文件名建议重命名为 UUID，避免路径注入。
- 下载地址建议使用受控签名 URL 或鉴权下载。
- 对上传文件执行 MIME + 后缀双校验，并限制大小。
- 对文本字段进行 XSS 过滤与长度限制。

## 9. 与前端对齐说明

前端当前提交字段名固定如下：

- name
- studentId
- contact
- techStack
- projectExperience
- campusExperience
- extraNote
- photo
- resumePdf

如后端字段名需要调整，请同步修改 src/views/ResumeApplyPage.vue 中 handleSubmit 的 FormData append 键名。