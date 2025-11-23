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

    <div class="files-section">
      <BaseCard class="content-card">
        <div
          v-if="loading"
          class="loading-container"
        >
          <LoadingSpinner />
        </div>
        
        <div
          v-else-if="files.length === 0"
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
                v-for="file in files"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getFiles, uploadFile, deleteFile, downloadFile, type FileInfo } from '@/api/file'
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
const totalPages = ref(1)
const totalElements = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)
const cleanupFns: Array<() => void> = []

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
  try {
    const res = await getFiles({ page: currentPage.value - 1, size: pageSize.value })
    if (Array.isArray(res)) {
      files.value = res
      totalPages.value = 1
      totalElements.value = res.length
    } else {
      files.value = res.content || []
      totalPages.value = res.totalPages || 1
      totalElements.value = res.totalElements || 0
    }
  } catch (error) {
    console.error('Failed to fetch files:', error)
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
  fetchFiles()
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
