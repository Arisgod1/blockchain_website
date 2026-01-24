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

    <!-- 搜索与筛选 -->
    <div
      class="filter-bar"
      style="display:flex;gap:1rem;align-items:center;margin-bottom:1rem"
    >
      <input
        v-model="searchQuery"
        class="form-input"
        style="max-width:220px"
        placeholder="搜索标题/作者/分类"
        @keyup.enter="applySearch"
      >
      <select
        v-model="selectedCategory"
        class="form-select"
        style="max-width:140px"
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
        @click="applySearch"
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
    <div class="articles-section">
      <BaseCard class="content-card">
        <div
          v-if="loading"
          class="loading-container"
        >
          <LoadingSpinner />
        </div>
        <div
          v-else-if="filteredArticles.length === 0"
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
                v-for="article in paginatedArticles"
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
          v-if="sortedArticles.length > pageSize"
          class="pagination-container"
        >
          <BasePagination
            :current="currentPage"
            :page-size="pageSize"
            :total="sortedArticles.length"
            @page-change="handlePageChange"
            @update:page-size="handlePageSizeChange"
          />
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticles, deleteArticle } from '@/api/article'
import type { Article } from '@/types/entities'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { onAdminRefresh } from '@/utils/adminEvents'
import { recordAdminOperation } from '@/composables/useAdminLogs'

const articles = ref<Article[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const selectedCategory = ref('')
const cleanupFns: Array<() => void> = []
const router = useRouter()

const categoryOptions = computed(() => {
  const set = new Set<string>()
  articles.value.forEach(a => { if (a.category) set.add(a.category) })
  return Array.from(set)
})

const filteredArticles = computed(() => {
  let result = [...articles.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      (a.title && a.title.toLowerCase().includes(q)) ||
      ((typeof a.author === 'string' ? a.author : a.author?.name || '').toLowerCase().includes(q)) ||
      (a.category && a.category.toLowerCase().includes(q))
    )
  }
  if (selectedCategory.value) {
    result = result.filter(a => a.category === selectedCategory.value)
  }
  return result
})

const sortedArticles = computed(() => {
  return [...filteredArticles.value].sort((a, b) => {
    const aNum = Number(a.id)
    const bNum = Number(b.id)
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum
    return String(a.id ?? '').localeCompare(String(b.id ?? ''))
  })
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedArticles.value.slice(start, start + pageSize.value)
})

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

const fetchArticles = async () => {
  loading.value = true
  try {
    const res = await getArticles({ page: 0, size: 100 }) // 拉取全部，前端分页
    articles.value = res.content || []
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
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCreate = () => {
  router.push({ name: 'AdminArticleCreate' })
}

const handleEdit = (article: Article) => {
  if (!article?.id) return
  router.push({ name: 'AdminArticleEdit', params: { id: article.id } })
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

const applySearch = () => {
  currentPage.value = 1
}
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
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
