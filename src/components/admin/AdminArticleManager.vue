<template>
  <div class="admin-article-manager">
    <div class="manager-header">
      <h2>文章管理</h2>
      <div class="header-actions">
        <BaseButton
          variant="primary"
          @click="handleCreate"
        >
          + 新建文章
        </BaseButton>
        <BaseButton
          variant="secondary"
          @click="handleRefresh"
        >
          刷新
        </BaseButton>
      </div>
    </div>

    <div class="articles-section">
      <BaseCard class="content-card">
        <div
          v-if="loading"
          class="loading-container"
        >
          <LoadingSpinner />
        </div>
        
        <div
          v-else-if="articles.length === 0"
          class="empty-state"
        >
          <p>暂无文章数据</p>
        </div>

        <div
          v-else
          class="articles-table-container"
        >
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>标题</th>
                <th>作者</th>
                <th>分类</th>
                <th>发布时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="article in articles"
                :key="article.id"
              >
                <td>{{ article.id }}</td>
                <td>{{ article.title }}</td>
                <td>{{ article.author?.name || '未知' }}</td>
                <td>{{ article.category }}</td>
                <td>{{ article.publishDate }}</td>
                <td>
                  <span :class="['status-badge', article.isPublished ? 'published' : 'draft']">
                    {{ article.isPublished ? '已发布' : '草稿' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button
                    class="action-btn edit"
                    @click="handleEdit(article)"
                  >
                    编辑
                  </button>
                  <button
                    class="action-btn delete"
                    @click="handleDelete(article)"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div
          v-if="totalPages > 1"
          class="pagination-container"
        >
          <BasePagination 
            :current="currentPage" 
            :total="totalElements"
            :page-size="pageSize"
            @change="handlePageChange" 
          />
        </div>
      </BaseCard>
    </div>

    <BaseModal
      v-model:show="showEditModal"
      :title="editingArticle ? '编辑文章' : '新建文章'"
    >
      <form
        class="edit-form"
        @submit.prevent="saveArticle"
      >
        <div class="form-group">
          <label>标题</label>
          <input
            v-model="formData.title"
            type="text"
            required
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label>摘要</label>
          <textarea
            v-model="formData.summary"
            class="form-textarea"
          />
        </div>
        <div class="form-group">
          <label>内容</label>
          <textarea
            v-model="formData.content"
            class="form-textarea content-editor"
          />
        </div>
        <div class="form-group">
          <label>分类</label>
          <input
            v-model="formData.category"
            type="text"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label>状态</label>
          <div class="checkbox-group">
            <input
              id="isPublished"
              v-model="formData.isPublished"
              type="checkbox"
            >
            <label for="isPublished">发布</label>
          </div>
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
import { getArticles, createArticle, updateArticle, deleteArticle } from '@/api/article'
import type { Article } from '@/types/entities'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { onAdminRefresh } from '@/utils/adminEvents'
import { recordAdminOperation } from '@/composables/useAdminLogs'

const articles = ref<Article[]>([])
const loading = ref(false)
const saving = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const totalElements = ref(0)
const showEditModal = ref(false)
const editingArticle = ref<Article | null>(null)
const cleanupFns: Array<() => void> = []

type ArticleLogAction = 'create' | 'update' | 'delete' | 'refresh'

const logArticleAction = (action: ArticleLogAction, message: string, result: 'success' | 'failure' = 'success', targetId?: string | number) => {
  recordAdminOperation({
    entity: 'articles',
    action,
    message,
    targetId,
    result
  }).catch((error) => {
    console.warn('记录文章操作日志失败:', error)
  })
}

const formData = reactive<Partial<Article>>({
  title: '',
  summary: '',
  content: '',
  category: '',
  isPublished: false
})

const fetchArticles = async () => {
  loading.value = true
  try {
    const res = await getArticles({ page: currentPage.value - 1, size: pageSize.value })
    if (Array.isArray(res)) {
      articles.value = res
      totalPages.value = 1
      totalElements.value = res.length
    } else {
      articles.value = res.content || []
      totalPages.value = res.totalPages || 1
      totalElements.value = res.totalElements || 0
    }
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
  fetchArticles()
  logArticleAction('refresh', '手动刷新文章列表')
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchArticles()
}

const handleCreate = () => {
  editingArticle.value = null
  Object.assign(formData, {
    title: '',
    summary: '',
    content: '',
    category: '',
    isPublished: false
  })
  showEditModal.value = true
}

const handleEdit = (article: Article) => {
  editingArticle.value = article
  Object.assign(formData, article)
  showEditModal.value = true
}

const handleDelete = async (article: Article) => {
  if (!confirm(`确定要删除文章 "${article.title}" 吗？`)) return
  try {
    await deleteArticle(article.id)
    fetchArticles()
    logArticleAction('delete', `删除文章「${article.title}」`, 'success', article.id)
  } catch (error) {
    alert('删除失败')
    logArticleAction('delete', `删除文章「${article.title}」失败`, 'failure', article.id)
  }
}

const saveArticle = async () => {
  saving.value = true
  try {
    if (editingArticle.value) {
      const updated = await updateArticle(editingArticle.value.id, formData)
      logArticleAction('update', `更新文章「${updated.title ?? editingArticle.value.title}」`, 'success', editingArticle.value.id)
    } else {
      const created = await createArticle(formData)
      logArticleAction('create', `创建文章「${created.title ?? formData.title}」`, 'success', created.id)
    }
    showEditModal.value = false
    fetchArticles()
  } catch (error) {
    alert('保存失败')
    const action: ArticleLogAction = editingArticle.value ? 'update' : 'create'
    logArticleAction(action, `保存文章「${formData.title || '未命名文章'}」失败`, 'failure', editingArticle.value?.id)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchArticles()
  const stopRefresh = onAdminRefresh((detail) => {
    if (detail.entity === 'all' || detail.entity === 'articles') {
      fetchArticles()
      logArticleAction('refresh', `全局触发 ${detail.action ?? 'refresh'} 同步文章数据`)
    }
  })
  cleanupFns.push(stopRefresh)
})

onUnmounted(() => {
  cleanupFns.forEach((stop) => stop())
})
</script>

<style scoped>
.admin-article-manager {
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
.status-badge.published { background-color: #D1FAE5; color: #065F46; }
.status-badge.draft { background-color: #F3F4F6; color: #374151; }
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
.content-editor {
  min-height: 300px;
  font-family: monospace;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.checkbox-group input {
  width: auto;
}
.checkbox-group label {
  margin-bottom: 0;
}
</style>
