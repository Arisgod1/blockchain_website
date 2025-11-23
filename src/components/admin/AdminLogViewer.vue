<template>
  <div class="admin-log-viewer">
    <div class="viewer-header">
      <div>
        <h2>操作日志</h2>
        <p class="subtext">
          实时追踪管理员在后台的所有关键操作
        </p>
      </div>
      <div class="header-actions">
        <BaseButton
          variant="secondary"
          :loading="loading"
          @click="loadLogs"
        >
          刷新
        </BaseButton>
        <BaseButton
          variant="danger"
          :disabled="logs.length === 0"
          @click="handleClear"
        >
          清空日志
        </BaseButton>
      </div>
    </div>

    <div class="log-stats">
      <BaseCard class="stat-card">
        <div class="stat-label">
          日志总数
        </div>
        <div class="stat-value">
          {{ totalLogs }}
        </div>
      </BaseCard>
      <BaseCard class="stat-card">
        <div class="stat-label">
          最近一条
        </div>
        <div class="stat-value">
          {{ lastLog ? formatDate(lastLog.timestamp) : '-' }}
        </div>
      </BaseCard>
      <BaseCard class="stat-card">
        <div class="stat-label">
          筛选结果
        </div>
        <div class="stat-value">
          {{ filteredLogs.length }}
        </div>
      </BaseCard>
    </div>

    <BaseCard>
      <div class="filters">
        <input
          v-model="filters.search"
          class="filter-input"
          placeholder="搜索描述或操作人"
        >
        <select v-model="filters.entity">
          <option value="all">
            全部实体
          </option>
          <option
            v-for="entity in entityOptions"
            :key="entity.value"
            :value="entity.value"
          >
            {{ entity.label }}
          </option>
        </select>
        <select v-model="filters.action">
          <option value="all">
            全部动作
          </option>
          <option
            v-for="action in actionOptions"
            :key="action.value"
            :value="action.value"
          >
            {{ action.label }}
          </option>
        </select>
        <select v-model="filters.result">
          <option value="all">
            全部结果
          </option>
          <option value="success">
            成功
          </option>
          <option value="failure">
            失败
          </option>
        </select>
      </div>

      <div
        v-if="loading"
        class="loading-state"
      >
        <LoadingSpinner />
        <p>加载日志中...</p>
      </div>

      <div
        v-else-if="pagedLogs.length === 0"
        class="empty-state"
      >
        <p>暂无符合条件的日志记录</p>
      </div>

      <div
        v-else
        class="table-wrapper"
      >
        <table class="log-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>实体</th>
              <th>操作</th>
              <th>描述</th>
              <th>操作人</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in pagedLogs"
              :key="log.id"
            >
              <td>{{ formatDate(log.timestamp) }}</td>
              <td>
                <span class="pill">{{ entityLabel(log.entity) }}</span>
              </td>
              <td>{{ actionLabel(log.action) }}</td>
              <td>
                <div class="message">
                  {{ log.message }}
                </div>
                <small
                  v-if="log.metadata"
                  class="metadata"
                >
                  {{ stringifyMeta(log.metadata) }}
                </small>
              </td>
              <td>{{ log.operator || '系统' }}</td>
              <td>
                <span
                  class="result-pill"
                  :class="log.result"
                >
                  {{ log.result === 'success' ? '成功' : '失败' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="filteredLogs.length > pagination.pageSize"
        class="pagination"
      >
        <BasePagination
          :current="pagination.current"
           :pageSize="pagination.pageSize"
          :total="filteredLogs.length"
          @change="handlePageChange"
        />
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted, watch } from 'vue'
import { useAdminLogs } from '@/composables/useAdminLogs'
import { BaseButton, BaseCard, BasePagination, LoadingSpinner } from '@/components/common'
import type { AdminAction, AdminEntity } from '@/types/entities'

const { logs, loading, totalLogs, lastLog, loadLogs, removeAllLogs } = useAdminLogs()

const filters = reactive({
  search: '',
  entity: 'all' as AdminEntity | 'all',
  action: 'all' as AdminAction | 'all',
  result: 'all' as 'success' | 'failure' | 'all'
})

const pagination = reactive({
  current: 1,
  pageSize: 10
})

const entityOptions: Array<{ label: string; value: AdminEntity }> = [
  { label: '例会', value: 'meetings' },
  { label: '成员', value: 'members' },
  { label: '项目', value: 'projects' },
  { label: '文章', value: 'articles' },
  { label: '文件', value: 'files' },
  { label: '日志', value: 'logs' },
  { label: '看板', value: 'dashboard' }
]

const actionOptions: Array<{ label: string; value: AdminAction }> = [
  { label: '创建', value: 'create' },
  { label: '更新', value: 'update' },
  { label: '删除', value: 'delete' },
  { label: '刷新', value: 'refresh' },
  { label: '复制', value: 'duplicate' },
  { label: '导入', value: 'import' },
  { label: '导出', value: 'export' },
  { label: '登录', value: 'login' },
  { label: '退出', value: 'logout' }
]

const filteredLogs = computed(() => {
  return logs.value.filter((log) => {
    const matchesEntity = filters.entity === 'all' || log.entity === filters.entity
    const matchesAction = filters.action === 'all' || log.action === filters.action
    const matchesResult = filters.result === 'all' || log.result === filters.result
    const keyword = filters.search.trim().toLowerCase()
    const matchesKeyword = keyword
      ? log.message.toLowerCase().includes(keyword) ||
        (log.operator || '').toLowerCase().includes(keyword)
      : true

    return matchesEntity && matchesAction && matchesResult && matchesKeyword
  })
})

const pagedLogs = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredLogs.value.slice(start, end)
})

const handlePageChange = (page: number) => {
  pagination.current = page
}

const handleClear = async () => {
  if (logs.value.length === 0) return
  if (!confirm('确认清空所有管理员操作日志吗？此操作不可恢复。')) return
  await removeAllLogs()
}

const entityLabel = (entity: AdminEntity) => {
  const found = entityOptions.find((option) => option.value === entity)
  return found?.label ?? entity
}

const actionLabel = (action: AdminAction) => {
  const found = actionOptions.find((option) => option.value === action)
  return found?.label ?? action
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', { hour12: false })
}

const stringifyMeta = (metadata: Record<string, unknown>) => {
  try {
    return Object.entries(metadata)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ')
  } catch (error) {
    return ''
  }
}

watch(() => [filters.search, filters.entity, filters.action, filters.result], () => {
  pagination.current = 1
})

onMounted(() => {
  loadLogs()
})
</script>

<style scoped>
.admin-log-viewer {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.viewer-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}
.subtext {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}
.header-actions {
  display: flex;
  gap: 0.75rem;
}
.log-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
.stat-card {
  padding: 1rem;
}
.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 0.25rem;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.filter-input,
select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  min-width: 160px;
}
.table-wrapper {
  overflow-x: auto;
}
.log-table {
  width: 100%;
  border-collapse: collapse;
}
.log-table th,
.log-table td {
  padding: 0.75rem 0.5rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: top;
}
.pill {
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 0.75rem;
  font-weight: 600;
}
.result-pill {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.result-pill.success {
  background: #dcfce7;
  color: #166534;
}
.result-pill.failure {
  background: #fee2e2;
  color: #991b1b;
}
.message {
  font-weight: 500;
}
.metadata {
  color: #6b7280;
}
.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #6b7280;
}
.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
@media (max-width: 768px) {
  .viewer-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .filters {
    flex-direction: column;
  }
  .filter-input,
  select {
    width: 100%;
  }
}
</style>
