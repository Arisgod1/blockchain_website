<template>
  <div class="admin-page editor-page">
    <BaseCard class="editor-card">
      <div class="page-header">
        <div>
          <h2>{{ isCreate ? '新建项目' : '编辑项目' }}</h2>
          <p class="page-subtitle">
            填写项目信息后保存，保存成功会返回项目列表
          </p>
        </div>
        <BaseButton
          variant="secondary"
          @click="goBack"
        >
          返回列表
        </BaseButton>
      </div>

      <div
        v-if="loading"
        class="loading-row"
      >
        <LoadingSpinner />
        <span>加载中...</span>
      </div>

      <form
        v-else
        class="form-grid"
        @submit.prevent="handleSubmit"
      >
        <label class="form-field">
          <span>项目名称</span>
          <input
            v-model="form.name"
            required
            class="text-input"
            placeholder="请输入项目名称"
          >
        </label>

        <label class="form-field">
          <span>描述</span>
          <textarea
            v-model="form.description"
            class="text-area"
            rows="4"
            placeholder="补充项目亮点"
          />
        </label>

        <div class="two-col">
          <label class="form-field">
            <span>分类</span>
            <select
              v-model="form.category"
              class="text-input"
            >
              <option value="DEVELOPMENT">开发</option>
              <option value="RESEARCH">研究</option>
              <option value="COMPETITION">竞赛</option>
              <option value="COLLABORATION">合作</option>
              <option value="EDUCATION">教学</option>
            </select>
          </label>

          <label class="form-field">
            <span>状态</span>
            <select
              v-model="form.status"
              class="text-input"
            >
              <option value="PLANNING">规划中</option>
              <option value="ONGOING">进行中</option>
              <option value="COMPLETED">已完成</option>
              <option value="ON_HOLD">搁置</option>
            </select>
          </label>
        </div>

        <div class="two-col">
          <label class="form-field">
            <span>进度 (%)</span>
            <input
              v-model.number="form.progress"
              type="number"
              min="0"
              max="100"
              class="text-input"
            >
          </label>

          <label class="form-field">
            <span>展示链接</span>
            <input
              v-model="form.link"
              type="url"
              class="text-input"
              placeholder="Demo 或官网地址"
            >
          </label>
        </div>

        <label class="form-field">
          <span>仓库地址</span>
          <input
            v-model="form.repoUrl"
            type="url"
            class="text-input"
            placeholder="GitHub 或 Gitee 链接"
          >
        </label>

        <div class="form-actions">
          <BaseButton
            type="button"
            variant="secondary"
            @click="goBack"
          >
            取消
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            :loading="saving"
          >
            {{ isCreate ? '创建' : '保存' }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { getProject, createProject, updateProject } from '@/api/project'
import { Category, Status, type Project, type AdminAction, type ProjectStatusValue } from '@/types/entities'
import { recordAdminOperation } from '@/composables/useAdminLogs'

const route = useRoute()
const router = useRouter()

const id = route.params.id as string | undefined
const isCreate = !id
const loading = ref(false)
const saving = ref(false)

const getStringField = (obj: unknown, key: string): string | undefined => {
  if (obj && typeof obj === 'object' && key in obj) {
    const value = (obj as Record<string, unknown>)[key]
    return typeof value === 'string' ? value : undefined
  }
  return undefined
}

type ProjectFormState = {
  name: string
  description: string
  category: Project['category']
  status: ProjectStatusValue | undefined
  progress: number
  repoUrl: string
  link: string
}

const form = reactive<ProjectFormState>({
  name: '',
  description: '',
  category: Category.Development,
  status: Status.Planning,
  progress: 0,
  repoUrl: '',
  link: ''
})

const logProjectAction = (action: AdminAction, message: string, result: 'success' | 'failure' = 'success', targetId?: string | number) => {
  recordAdminOperation({
    entity: 'projects',
    action,
    message,
    targetId,
    result
  }).catch((err) => console.warn('记录项目操作日志失败', err))
}

const normalizeProject = (project: Project) => {
  form.name = project.name ?? project.title ?? ''
  form.description = project.description ?? project.summary ?? project.shortDescription ?? ''
  form.category = project.category ?? Category.Development
  const normalizedStatus = (project.status as ProjectStatusValue | undefined) ?? Status.Planning
  form.status = normalizedStatus
  form.progress = project.progress ?? 0
  const repo = typeof project.repositoryUrl === 'string'
    ? project.repositoryUrl
    : getStringField(project, 'repoUrl') ?? ''
  const link = typeof project.link === 'string'
    ? project.link
    : getStringField(project, 'demoUrl') ?? ''
  form.repoUrl = repo
  form.link = link
}

onMounted(async () => {
  if (!isCreate && id) {
    loading.value = true
    try {
      const project = await getProject(id)
      if (project) {
        normalizeProject(project)
      }
      logProjectAction('refresh', `加载项目 ${id}`)
    } catch (error) {
      console.error('加载项目失败', error)
      logProjectAction('refresh', `加载项目 ${id} 失败`, 'failure', id)
    } finally {
      loading.value = false
    }
  }
})

const handleSubmit = async () => {
  saving.value = true
  const payload: Partial<Project> = {
    name: form.name,
    description: form.description,
    category: form.category,
    status: form.status,
    progress: Number(form.progress) || 0,
    repositoryUrl: form.repoUrl,
    link: form.link
  }

  // 更新时附带 id，保证请求体完整
  if (!isCreate && id) {
    payload.id = id
  }

  try {
    if (isCreate) {
      const created = await createProject(payload)
      logProjectAction('create', `创建项目「${created.name ?? form.name}」`, 'success', created.id)
    } else if (id) {
      const updated = await updateProject(id, payload)
      logProjectAction('update', `更新项目「${updated.name ?? form.name}」`, 'success', id)
    }
    goBack()
  } catch (error) {
    console.error('保存项目失败', error)
    const action: 'create' | 'update' = isCreate ? 'create' : 'update'
    logProjectAction(action, `保存项目「${form.name || '未命名项目'}」失败`, 'failure', id)
    alert('保存失败，请稍后再试')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push({ name: 'AdminProjects' })
}
</script>

<style scoped>
.admin-page.editor-page {
  padding: 1.5rem;
}

.editor-card {
  max-width: 960px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.page-subtitle {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.loading-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.text-input,
.text-area,
select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.65rem 0.75rem;
  font-size: 1rem;
}

.text-area {
  resize: vertical;
}

.two-col {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
