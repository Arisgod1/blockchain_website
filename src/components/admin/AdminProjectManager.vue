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

    <!-- 项目列表 -->
    <div class="projects-section">
      <BaseCard class="content-card">
        <div
          v-if="loading"
          class="loading-container"
        >
          <LoadingSpinner />
        </div>
        
        <div
          v-else-if="projects.length === 0"
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
                <th>状态</th>
                <th>进度</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="project in projects"
                :key="project.id"
              >
                <td>{{ project.id }}</td>
                <td>{{ project.name }}</td>
                <td>{{ project.category }}</td>
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
          v-if="totalPages > 1"
          class="pagination-container"
        >
          <BasePagination 
            :current="currentPage" 
            :pageSize="pageSize"
            :total="totalItems" 
            @change="handlePageChange" 
          />
        </div>
      </BaseCard>
    </div>

    <!-- 编辑/新建弹窗 -->
    <BaseModal
      v-model:show="showEditModal"
      :title="editingProject ? '编辑项目' : '新建项目'"
    >
      <form
        class="edit-form"
        @submit.prevent="saveProject"
      >
        <div class="form-group">
          <label>项目名称</label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label>描述</label>
          <textarea
            v-model="formData.description"
            class="form-textarea"
          />
        </div>
        <div class="form-group">
          <label>分类</label>
          <select
            v-model="formData.category"
            class="form-select"
          >
            <option value="DEVELOPMENT">
              开发
            </option>
            <option value="RESEARCH">
              研究
            </option>
            <option value="COMPETITION">
              竞赛
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>状态</label>
          <select
            v-model="formData.status"
            class="form-select"
          >
            <option value="PLANNING">
              规划中
            </option>
            <option value="ONGOING">
              进行中
            </option>
            <option value="COMPLETED">
              已完成
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>进度 (%)</label>
          <input
            v-model.number="formData.progress"
            type="number"
            min="0"
            max="100"
            class="form-input"
          >
        </div>
        <div class="form-actions">
          <BaseButton
            type="button"
            variant="secondary"
            @click="showEditModal = false"
          >
            取消
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            :loading="saving"
          >
            保存
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { getProjects, createProject, updateProject, deleteProject } from '@/api/project'
import { Category, Status, type Project } from '@/types/entities'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { onAdminRefresh } from '@/utils/adminEvents'
import { recordAdminOperation } from '@/composables/useAdminLogs'

const projects = ref<Project[]>([])
const loading = ref(false)
const saving = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const pageSize = ref(10)
const showEditModal = ref(false)
const editingProject = ref<Project | null>(null)
const cleanupFns: Array<() => void> = []

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

const formData = reactive<Partial<Project>>({
  name: '',
  description: '',
  category: Category.Development,
  status: Status.Planning,
  progress: 0
})

const fetchProjects = async () => {
  loading.value = true
  try {
  const res = await getProjects({ page: currentPage.value - 1, size: pageSize.value })
    // 适配 Mock 数据结构（如果是数组直接返回，如果是分页对象取 content）
    if (Array.isArray(res)) {
      projects.value = res
      totalPages.value = 1
      totalItems.value = res.length
    } else {
      projects.value = res.content || []
      totalPages.value = res.totalPages || 1
      totalItems.value = res.totalElements || projects.value.length
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error)
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
  fetchProjects()
}

const handleCreate = () => {
  editingProject.value = null
  Object.assign(formData, {
    name: '',
    description: '',
    category: Category.Development,
    status: Status.Planning,
    progress: 0
  })
  showEditModal.value = true
}

const handleEdit = (project: Project) => {
  editingProject.value = project
  Object.assign(formData, project)
  showEditModal.value = true
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

const saveProject = async () => {
  saving.value = true
  try {
    if (editingProject.value) {
      const updated = await updateProject(editingProject.value.id!, formData)
      logProjectAction('update', `更新项目「${updated.name ?? editingProject.value.name}」`, 'success', editingProject.value.id)
    } else {
      const created = await createProject(formData)
      logProjectAction('create', `创建项目「${created.name ?? formData.name}」`, 'success', created.id)
    }
    showEditModal.value = false
    fetchProjects()
  } catch (error) {
    alert('保存失败')
    const action: ProjectLogAction = editingProject.value ? 'update' : 'create'
    logProjectAction(action, `保存项目「${formData.name || '未命名项目'}」失败`, 'failure', editingProject.value?.id)
  } finally {
    saving.value = false
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
