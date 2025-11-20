import type { AdminOperationLog } from '@/types/entities'

export const MOCK_ADMIN_LOGS: AdminOperationLog[] = [
  {
    id: 'log-1001',
    entity: 'meetings',
    action: 'create',
    targetId: 'MTG-001',
    operator: 'super-admin',
    result: 'success',
    message: '创建例会「周例会」',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    metadata: {
      attendees: 12
    }
  },
  {
    id: 'log-1002',
    entity: 'projects',
    action: 'update',
    targetId: 'PRJ-204',
    operator: 'admin',
    result: 'success',
    message: '更新项目进度至 70%',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    metadata: {
      progress: 70
    }
  },
  {
    id: 'log-1003',
    entity: 'members',
    action: 'delete',
    targetId: 'MEM-877',
    operator: 'admin',
    result: 'failure',
    message: '删除成员失败：数据校验错误',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  }
]
