<template>
  <div class="admin-project-manager">
    <div class="manager-header">
      <h2>项目管理</h2>
      <div class="header-actions">
        <BaseButton
          variant="primary"
          @click="handleCreate"
        >
          + 新建项目
        </BaseButton>
        <BaseButton
          variant="secondary"
          @click="handleRefresh"
        >
          刷新
        </BaseButton>
      </div>
    </div>

    <!-- 搜索与筛选 -->
    <div
      class="filter-bar"
      style="display:flex;gap:1rem;align-items:center;margin-bottom:1rem"
    >
      <input
        v-model="filters.search"
        class="form-input"
        style="max-width:220px"
        placeholder="搜索项目名称/分类"
        @keyup.enter="handleFilterChange"
      >
      <select
        v-model="filters.category"
        class="form-select"
        style="max-width:140px"
        @change="handleFilterChange"
      >
        <option value="">
          全部分类
        </option>
        <option
          v-for="cat in categoryOptions"
          :key="cat"
          :value="cat"
        >
          {{ cat }}
        </option>
      </select>
      <BaseButton
        variant="primary"
        @click="handleFilterChange"
      >
        搜索
      </BaseButton>
      <BaseButton
        variant="secondary"
        @click="resetFilters"
      >
        重置
      </BaseButton>
    </div>
    <div class="projects-section">
      <BaseCard class="content-card">
        <div
          v-if="loading"
          class="loading-container"
        >
          <LoadingSpinner />
        </div>
        <div
          v-else-if="filteredProjects.length === 0"
          class="empty-state"
        >
          <p>暂无项目数据</p>
        </div>
        <div
          v-else
          class="projects-table-container"
        >
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>项目名称</th>
                <th>分类</th>
                <th>开始时间</th>
                <th>状态</th>
                <th>进度</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="project in paginatedProjects"
                :key="project.id"
              >
                <td>{{ project.id }}</td>
                <td>{{ project.name }}</td>
                <td>{{ project.category }}</td>
                <td>{{ formatDate(project.startDate) }}</td>
                <td>
                  <span :class="['status-badge', String(project.status ?? 'planning').toLowerCase()]">
                    {{ project.status || '未设置' }}
                  </span>
                </td>
                <td>{{ project.progress }}%</td>
                <td class="actions-cell">
                  <button
                    class="action-btn edit"
                    @click="handleEdit(project)"
                  >
                    编辑
                  </button>
                  <button
                    class="action-btn delete"
                    @click="handleDelete(project)"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 分页 -->
        <div
          v-if="filteredProjects.length > pageSize"
          class="pagination-container"
        >
          <BasePagination
            :current="currentPage"
            :page-size="pageSize"
            :total="filteredProjects.length"
            @page-change="handlePageChange"
            @update:page-size="handlePageSizeChange"
          />
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProjects, deleteProject } from '@/api/project'
import { type Project } from '@/types/entities'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { onAdminRefresh } from '@/utils/adminEvents'
import { recordAdminOperation } from '@/composables/useAdminLogs'

const projects = ref<Project[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const filters = ref({ search: '', category: '' })
const cleanupFns: Array<() => void> = []
const router = useRouter()

const categoryOptions = computed(() => {
  const set = new Set<string>()
  projects.value.forEach(p => { if (p.category) set.add(p.category) })
  return Array.from(set)
})

const filteredProjects = computed(() => {
  const keyword = filters.value.search.trim().toLowerCase()
  let list = [...projects.value]

  if (keyword) {
    list = list.filter(p =>
      (p.name && p.name.toLowerCase().includes(keyword)) ||
      (p.category && p.category.toLowerCase().includes(keyword))
    )
  }

  if (filters.value.category) {
    list = list.filter(p => p.category === filters.value.category)
  }

  return list
})

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredProjects.value.slice(start, start + pageSize.value)
})

const formatDate = (dateInput?: string | Date) => {
  if (!dateInput) return '未设置'
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
    return date.toISOString().slice(0, 10)
  } catch {
    return typeof dateInput === 'string' ? dateInput : '未设置'
  }
}

watch(
  () => filteredProjects.value.length,
  (length) => {
    const maxPage = Math.max(1, Math.ceil(length / pageSize.value) || 1)
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage
    }
  }
)

type ProjectLogAction = 'create' | 'update' | 'delete' | 'refresh'
const logProjectAction = (action: ProjectLogAction, message: string, result: 'success' | 'failure' = 'success', targetId?: string | number) => {
  recordAdminOperation({
    entity: 'projects',
    action,
    message,
    targetId,
    result
  }).catch((error) => {
    console.warn('记录项目操作日志失败:', error)
  })
}

const buildQueryParams = () => {
  const params: Record<string, unknown> = {
    page: 0,
    size: 500
  }
  if (filters.value.search) params.keyword = filters.value.search
  if (filters.value.category) params.category = filters.value.category
  return params
}

const fetchProjects = async () => {
  loading.value = true
  try {
    const res = await getProjects(buildQueryParams())
    projects.value = res.content || []
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    projects.value = []
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
  fetchProjects()
  logProjectAction('refresh', '手动刷新项目列表')
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleFilterChange = () => {
  currentPage.value = 1
  fetchProjects()
}

const resetFilters = () => {
  filters.value = { search: '', category: '' }
  currentPage.value = 1
  fetchProjects()
}

const handleCreate = () => {
  router.push({ name: 'AdminProjectCreate' })
}

const handleEdit = (project: Project) => {
  if (!project?.id) return
  router.push({ name: 'AdminProjectEdit', params: { id: project.id } })
}

const handleDelete = async (project: Project) => {
  if (!confirm(`确定要删除项目 "${project.name}" 吗？`)) return
  try {
    await deleteProject(project.id!)
    fetchProjects()
    logProjectAction('delete', `删除项目「${project.name}」`, 'success', project.id)
  } catch (error) {
    alert('删除失败')
    logProjectAction('delete', `删除项目「${project.name}」失败`, 'failure', project.id)
  }
}

onMounted(() => {
  fetchProjects()
  const stopRefresh = onAdminRefresh((detail) => {
    if (detail.entity === 'all' || detail.entity === 'projects') {
      fetchProjects()
      logProjectAction('refresh', `全局触发 ${detail.action ?? 'refresh'} 同步项目数据`)
    }
  })
  cleanupFns.push(stopRefresh)
})

onUnmounted(() => {
  cleanupFns.forEach((stop) => stop())
})
</script>

<style scoped>
.admin-project-manager {
  padding: 1.5rem;
}
.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.header-actions {
  display: flex;
  gap: 1rem;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th, .data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}
.status-badge.planning { background-color: #DBEAFE; color: #1E40AF; }
.status-badge.ongoing { background-color: #FEF3C7; color: #92400E; }
.status-badge.completed { background-color: #D1FAE5; color: #065F46; }
.actions-cell {
  display: flex;
  gap: 0.5rem;
}
.action-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}
.action-btn.edit { color: #2563EB; }
.action-btn.delete { color: #DC2626; }
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
}
.form-textarea {
  min-height: 100px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
