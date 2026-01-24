<template>
  <div class="admin-file-manager">
    <div class="manager-header">
      <h2>文件管理</h2>
      <div class="header-actions">
        <input 
          ref="fileInput" 
          type="file" 
          style="display: none" 
          @change="handleFileChange"
        >
        <BaseButton
          variant="primary"
          @click="triggerUpload"
        >
          + 上传文件
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
        placeholder="搜索文件名/类型"
        @keyup.enter="applySearch"
      >
      <select
        v-model="selectedType"
        class="form-select"
        style="max-width:140px"
      >
        <option value="">
          全部类型
        </option>
        <option
          v-for="type in typeOptions"
          :key="type"
          :value="type"
        >
          {{ type }}
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
    <div class="files-section">
      <BaseCard class="content-card">
        <div
          v-if="loading"
          class="loading-container"
        >
          <LoadingSpinner />
        </div>
        <div
          v-else-if="filteredFiles.length === 0"
          class="empty-state"
        >
          <p>暂无文件数据</p>
        </div>
        <div
          v-else
          class="files-table-container"
        >
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>文件名</th>
                <th>大小</th>
                <th>类型</th>
                <th>上传时间</th>
                <th>下载次数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="file in paginatedFiles"
                :key="file.id"
              >
                <td>{{ file.id }}</td>
                <td>{{ file.originalName }}</td>
                <td>{{ formatSize(file.fileSize) }}</td>
                <td>{{ file.fileType }}</td>
                <td>{{ file.uploadTime }}</td>
                <td>{{ file.downloadCount }}</td>
                <td class="actions-cell">
                  <button
                    class="action-btn download"
                    @click="handleDownload(file)"
                  >
                    下载
                  </button>
                  <button
                    class="action-btn delete"
                    @click="handleDelete(file)"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="filteredFiles.length > pageSize"
          class="pagination-container"
        >
          <BasePagination
            v-model:current="currentPage"
            :page-size="pageSize"
            :total="filteredFiles.length"
            @page-change="handlePageChange"
            @update:page-size="handlePageSizeChange"
          />
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getFiles, uploadFile, deleteFile, downloadFile, type FileInfo } from '@/api/file'
import { MOCK_FILES } from '@/common_value/files'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { onAdminRefresh } from '@/utils/adminEvents'
import { recordAdminOperation } from '@/composables/useAdminLogs'

const files = ref<FileInfo[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const selectedType = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const cleanupFns: Array<() => void> = []

const typeOptions = computed(() => {
  const set = new Set<string>()
  files.value.forEach(f => { if (f.fileType) set.add(f.fileType) })
  return Array.from(set)
})

const filteredFiles = computed(() => {
  let result = [...files.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(f =>
      (f.originalName && f.originalName.toLowerCase().includes(q)) ||
      (f.fileType && f.fileType.toLowerCase().includes(q))
    )
  }
  if (selectedType.value) {
    result = result.filter(f => f.fileType === selectedType.value)
  }
  return result
})

const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredFiles.value.slice(start, start + pageSize.value)
})

watch(filteredFiles, (list) => {
  const maxPage = Math.max(1, Math.ceil(list.length / pageSize.value) || 1)
  if (currentPage.value > maxPage) currentPage.value = maxPage
})

watch(pageSize, () => {
  currentPage.value = 1
})

type FileLogAction = 'create' | 'delete' | 'refresh' | 'export'
const logFileAction = (action: FileLogAction, message: string, result: 'success' | 'failure' = 'success', targetId?: string | number) => {
  recordAdminOperation({
    entity: 'files',
    action,
    message,
    targetId,
    result
  }).catch((error) => {
    console.warn('记录文件操作日志失败:', error)
  })
}

const fetchFiles = async () => {
  loading.value = true
  let finished = false
  const timeoutId = window.setTimeout(() => {
    if (!finished) {
      files.value = [...MOCK_FILES]
      loading.value = false
    }
  }, 8000)

  try {
    const res = await getFiles({ page: 0, size: 500 }) // 拉取较大页，前端分页
    finished = true
    window.clearTimeout(timeoutId)
    files.value = res.content || []
  } catch (error) {
    finished = true
    window.clearTimeout(timeoutId)
    console.error('Failed to fetch files:', error)
    files.value = [...MOCK_FILES]
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
  fetchFiles()
  logFileAction('refresh', '手动刷新文件列表')
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    try {
      await uploadFile(file)
      alert('上传成功')
      fetchFiles()
      logFileAction('create', `上传文件「${file.name}」`, 'success')
    } catch (error) {
      alert('上传失败')
      logFileAction('create', `上传文件「${file.name}」失败`, 'failure')
    } finally {
      target.value = '' // Reset input
    }
  }
}

const handleDownload = async (file: FileInfo) => {
  try {
    await downloadFile(file.id, file.originalName)
    logFileAction('export', `下载文件「${file.originalName}」`, 'success', file.id)
  } catch (error) {
    alert('下载失败')
    logFileAction('export', `下载文件「${file.originalName}」失败`, 'failure', file.id)
  }
}

const handleDelete = async (file: FileInfo) => {
  if (!confirm(`确定要删除文件 "${file.originalName}" 吗？`)) return
  try {
    await deleteFile(file.id)
    fetchFiles()
    logFileAction('delete', `删除文件「${file.originalName}」`, 'success', file.id)
  } catch (error) {
    alert('删除失败')
    logFileAction('delete', `删除文件「${file.originalName}」失败`, 'failure', file.id)
  }
}

const applySearch = () => {
  currentPage.value = 1
}
const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  currentPage.value = 1
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

onMounted(() => {
  fetchFiles()
  const stopRefresh = onAdminRefresh((detail) => {
    if (detail.entity === 'all' || detail.entity === 'files') {
      fetchFiles()
      logFileAction('refresh', `全局触发 ${detail.action ?? 'refresh'} 同步文件数据`)
    }
  })
  cleanupFns.push(stopRefresh)
})

onUnmounted(() => {
  cleanupFns.forEach((stop) => stop())
})
</script>

<style scoped>
.admin-file-manager {
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
.action-btn.download { color: #2563EB; }
.action-btn.delete { color: #DC2626; }
</style>
