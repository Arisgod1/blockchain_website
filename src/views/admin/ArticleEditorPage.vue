<template>
  <div class="admin-page editor-page">
    <BaseCard class="editor-card">
      <div class="page-header">
        <div>
          <h2>{{ isCreate ? '新建文章' : '编辑文章' }}</h2>
          <p class="page-subtitle">
            支持草稿保存，提交后返回文章列表
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
          <span>标题</span>
          <input
            v-model="form.title"
            required
            class="text-input"
            placeholder="请输入文章标题"
          >
        </label>

        <label class="form-field">
          <span>分类</span>
          <input
            v-model="form.category"
            class="text-input"
            placeholder="如：技术分享 / 团队动态"
          >
        </label>

        <label class="form-field">
          <span>摘要</span>
          <textarea
            v-model="form.summary"
            rows="3"
            class="text-area"
            placeholder="简要概述文章内容"
          />
        </label>

        <label class="form-field">
          <span>正文</span>
          <textarea
            v-model="form.content"
            rows="10"
            class="text-area"
            placeholder="支持 Markdown 内容"
          />
        </label>

        <div class="two-col">
          <label class="form-field">
            <span>发布时间</span>
            <input
              v-model="form.publishDate"
              type="date"
              class="text-input"
            >
          </label>
          <label class="form-field">
            <span>阅读时长（分钟）</span>
            <input
              v-model.number="form.readTime"
              type="number"
              min="1"
              class="text-input"
            >
          </label>
        </div>

        <label class="form-field">
          <span>标签（逗号分隔）</span>
          <input
            v-model="form.tagsText"
            class="text-input"
            placeholder="web3, solidity"
          >
        </label>

        <label class="form-field">
          <span>作者</span>
          <input
            v-model="form.author"
            class="text-input"
            placeholder="请输入作者名"
          >
        </label>

        <label class="form-field">
          <span>封面图片 URL</span>
          <input
            v-model="form.coverImage"
            class="text-input"
            placeholder="https://example.com/cover.jpg"
          >
        </label>

        <label class="form-field checkbox-row">
          <input
            id="isPublished"
            v-model="form.isPublished"
            type="checkbox"
          >
          <span>立即发布</span>
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
import { getArticle, createArticle, updateArticle } from '@/api/article'
import type { Article, AdminAction } from '@/types/entities'
import { recordAdminOperation } from '@/composables/useAdminLogs'

const route = useRoute()
const router = useRouter()

const id = route.params.id as string | undefined
const isCreate = !id
const loading = ref(false)
const saving = ref(false)

const today = () => new Date().toISOString().slice(0, 10)

const form = reactive({
  title: '',
  summary: '',
  content: '',
  category: '',
  publishDate: today(),
  isPublished: false,
  tagsText: '',
  readTime: 3,
  author: '',
  coverImage: ''
})

const logArticleAction = (action: AdminAction, message: string, result: 'success' | 'failure' = 'success', targetId?: string | number) => {
  recordAdminOperation({
    entity: 'articles',
    action,
    message,
    targetId,
    result
  }).catch((err) => console.warn('记录文章操作日志失败', err))
}

const normalizeArticle = (article: Article) => {
  form.title = article.title ?? ''
  form.summary = article.summary ?? article.excerpt ?? ''
  form.content = article.content ?? ''
  form.category = article.category ?? ''
  form.publishDate = article.publishDate || article.updateDate || today()
  form.isPublished = article.isPublished ?? false
  form.tagsText = Array.isArray(article.tags) ? article.tags.join(', ') : ''
  form.readTime = article.readTime ?? 3
  form.author = typeof article.author === 'string' ? article.author : (article.author?.name ?? '')
  form.coverImage = article.coverImage || article.image || ''
}

onMounted(async () => {
  if (!isCreate && id) {
    loading.value = true
    try {
      const article = await getArticle(id)
      if (article) {
        normalizeArticle(article)
      }
      logArticleAction('refresh', `加载文章 ${id}`)
    } catch (error) {
      console.error('加载文章失败', error)
      logArticleAction('refresh', `加载文章 ${id} 失败`, 'failure', id)
    } finally {
      loading.value = false
    }
  }
})

// 仅用于 /api/articles 文章接口的创建和更新
const handleSubmit = async () => {
  saving.value = true
  const tags = form.tagsText
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  const payload = {
    title: form.title,
    summary: form.summary,
    content: form.content,
    category: form.category || '默认',
    publishDate: form.publishDate || today(),
    updateDate: new Date().toISOString(),
    isPublished: form.isPublished,
    readTime: form.readTime ?? 3,
    tags,
    views: 0,
    likes: 0,
    author: { name: (form.author && form.author.trim()) ? form.author.trim() : '匿名' },
    coverImage: form.coverImage || undefined,
    image: form.coverImage || undefined
  } as Partial<Article>

  // 更新时附带 id，保证请求体完整
  if (!isCreate && id) {
    payload.id = id
  }

  try {
    if (isCreate) {
      
      const created = await createArticle(payload)
      logArticleAction('create', `创建文章「${created.title ?? form.title}」`, 'success', created.id)
    } else if (id) {
      
      const updated = await updateArticle(id, payload)
      logArticleAction('update', `更新文章「${updated.title ?? form.title}」`, 'success', id)
    }
    goBack()
  } catch (error) {
    console.error('保存文章失败', error)
    const action: 'create' | 'update' = isCreate ? 'create' : 'update'
    logArticleAction(action, `保存文章「${form.title || '未命名文章'}」失败`, 'failure', id)
    alert('保存失败，请稍后再试')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push({ name: 'AdminArticles' })
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
select,
textarea {
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

.checkbox-row {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
