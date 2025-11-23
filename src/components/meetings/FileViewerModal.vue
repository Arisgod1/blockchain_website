<template>
  <Teleport to="body">
    <div 
      class="file-viewer-modal"
      :class="{ 'is-open': isOpen }"
      @click="handleBackdropClick"
    >
      <div 
        class="modal-content"
        role="dialog"
        aria-labelledby="viewer-title"
        aria-modal="true"
        @click.stop
      >
        <!-- 模态框头部 -->
        <div class="modal-header">
          <div class="header-content">
            <h2
              id="viewer-title"
              class="modal-title"
            >
              会议文件
            </h2>
            <div
              v-if="files && files.length > 0"
              class="file-count"
            >
              共 {{ files.length }} 个文件
            </div>
          </div>
          
          <!-- 关闭按钮 -->
          <button 
            class="modal-close"
            aria-label="关闭文件查看器"
            @click="handleClose"
          >
            <svg
              class="close-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <!-- 文件列表 -->
        <div class="modal-body">
          <!-- 空状态 -->
          <div
            v-if="!files || files.length === 0"
            class="empty-state"
          >
            <div class="empty-icon">
              📄
            </div>
            <h3 class="empty-title">
              没有会议文件
            </h3>
            <p class="empty-description">
              该会议暂未上传相关文件
            </p>
          </div>

          <!-- 文件网格 -->
          <div
            v-else
            class="files-grid"
          >
            <div 
              v-for="file in files" 
              :key="file.id"
              class="file-card"
              :class="`file-type-${file.type}`"
              @click="handleFileClick(file)"
            >
              <!-- 文件图标和预览 -->
              <div class="file-preview">
                <div
                  v-if="file.type === 'pdf'"
                  class="file-icon pdf-icon"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                
                <div
                  v-else-if="file.type === 'docx'"
                  class="file-icon docx-icon"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                
                <div
                  v-else-if="file.type === 'pptx'"
                  class="file-icon pptx-icon"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3,13H21V11H3M3,17H21V15H3M3,9H21V7H3V9Z" />
                  </svg>
                </div>
                
                <div
                  v-else-if="file.type === 'xlsx'"
                  class="file-icon xlsx-icon"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3,3H21V21H3V3M6.5,6H8V8H6.5V6M6.5,10H8V12H6.5V10M6.5,14H8V16H6.5V14M9.5,6H11V8H9.5V6M9.5,10H11V12H9.5V10M9.5,14H11V16H9.5V14M12.5,6H14V8H12.5V6M12.5,10H14V12H12.5V10M12.5,14H14V16H12.5V14M15.5,6H17V8H15.5V6M15.5,10H17V12H15.5V10M15.5,14H17V16H15.5V14Z" />
                  </svg>
                </div>
                
                <div
                  v-else-if="file.type === 'zip'"
                  class="file-icon zip-icon"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                
                <div
                  v-else-if="file.type === 'mp4'"
                  class="file-icon video-icon"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
                  </svg>
                </div>
                
                <div
                  v-else-if="file.type === 'mp3'"
                  class="file-icon audio-icon"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12,3V13.55C11.41,13.21 10.73,13 10,13C7.79,13 6,14.79 6,17S7.79,21 10,21 14,19.21 14,17V7H18V3H12Z" />
                  </svg>
                </div>
                
                <div
                  v-else
                  class="file-icon default-icon"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>

                <!-- 文件类型标签 -->
                <div class="file-type-badge">
                  {{ getFileTypeText(file.type) }}
                </div>
              </div>

              <!-- 文件信息 -->
              <div class="file-info">
                <div
                  class="file-name"
                  :title="file.name"
                >
                  {{ file.name }}
                </div>
                <div class="file-meta">
                  <span class="file-size">{{ file.size }}</span>
                  <span class="file-extension">{{ getFileExtension(file.name) }}</span>
                </div>
              </div>

              <!-- 文件操作 -->
              <div class="file-actions">
                <button 
                  class="action-btn download-btn"
                  title="下载文件"
                  @click.stop="handleDownload(file)"
                >
                  <svg
                    class="action-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                  </svg>
                </button>
                
                <button 
                  class="action-btn preview-btn"
                  title="预览文件"
                  @click.stop="handlePreview(file)"
                >
                  <svg
                    class="action-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 模态框底部 -->
        <div
          v-if="files && files.length > 0"
          class="modal-footer"
        >
          <div class="footer-actions">
            <!-- 批量下载 -->
            <button 
              class="action-btn action-secondary"
              :disabled="downloadingFiles.size > 0"
              @click="handleBulkDownload"
            >
              <svg
                class="btn-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
              </svg>
              <span v-if="downloadingFiles.size === 0">批量下载 ({{ files.length }})</span>
              <span v-else>下载中... ({{ downloadingFiles.size }})</span>
            </button>

            <!-- 刷新文件 -->
            <button 
              class="action-btn action-secondary"
              @click="handleRefresh"
            >
              <svg
                class="btn-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
              </svg>
              刷新列表
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface File {
  id: string
  name: string
  type: string
  size: string
  url: string
}

interface Props {
  files: File[] | null
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  files: null,
  isOpen: false
})

const emit = defineEmits<Emits>()

// 响应式数据
const downloadingFiles = ref<Set<string>>(new Set())

// 方法
const handleClose = () => {
  emit('close')
}

const handleBackdropClick = () => {
  emit('close')
}

const handleFileClick = (file: File) => {
  // 单击预览文件
  handlePreview(file)
}

const handleDownload = async (file: File) => {
  downloadingFiles.value.add(file.id)
  
  try {
    // 模拟下载过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 创建下载链接
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('下载失败:', error)
  } finally {
    downloadingFiles.value.delete(file.id)
  }
}

const handlePreview = (file: File) => {
  // 根据文件类型选择预览方式
  if (file.type === 'mp4' || file.type === 'mp3') {
    // 对于视频/音频文件，可以打开新的播放器窗口
    window.open(file.url, '_blank', 'width=800,height=600')
  } else {
    // 对于其他文件，可以在新窗口中打开
    window.open(file.url, '_blank')
  }
}

const handleBulkDownload = async () => {
  if (!props.files) return

  downloadingFiles.value.clear()
  
  try {
    // 批量下载（这里只是模拟，实际应用中可能需要打包）
    for (const file of props.files) {
      if (!downloadingFiles.value.has(file.id)) {
        downloadingFiles.value.add(file.id)
        await handleDownload(file)
        downloadingFiles.value.delete(file.id)
      }
    }
  } catch (error) {
    console.error('批量下载失败:', error)
  }
}

const handleRefresh = () => {
  // 刷新文件列表
  window.location.reload()
}

const getFileTypeText = (type: string): string => {
  const typeMap = {
    'pdf': 'PDF',
    'docx': 'Word',
    'pptx': 'PowerPoint',
    'xlsx': 'Excel',
    'zip': '压缩包',
    'mp4': '视频',
    'mp3': '音频',
    'jpg': '图片',
    'png': '图片',
    'gif': '图片'
  }
  return typeMap[type as keyof typeof typeMap] || type.toUpperCase()
}

const getFileExtension = (fileName: string): string => {
  const extension = fileName.split('.').pop()
  return extension ? extension.toUpperCase() : ''
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// 监听窗口大小变化
const handleOpenChange = () => {
  if (props.isOpen) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
}

// 监听 isOpen 变化
watch(() => props.isOpen, handleOpenChange)

// 初始化时检查
handleOpenChange()
</script>

<style scoped lang="postcss">
/* 模态框基础样式 */
.file-viewer-modal {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4
         bg-black bg-opacity-50 opacity-0 pointer-events-none
         transition-all duration-300;
}

.file-viewer-modal.is-open {
  @apply opacity-100 pointer-events-auto;
}

/* 模态框内容 */
.modal-content {
  @apply bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh]
         flex flex-col transform scale-95 transition-all duration-300;
}

.file-viewer-modal.is-open .modal-content {
  @apply scale-100;
}

.modal-header {
  @apply flex items-start justify-between p-6 border-b border-gray-200;
}

.header-content {
  @apply flex-1;
}

.modal-title {
  @apply text-2xl font-bold text-gray-900 mb-1;
}

.file-count {
  @apply text-sm text-gray-600;
}

/* 关闭按钮 */
.modal-close {
  @apply p-2 text-gray-400 hover:text-gray-600 rounded-lg
         hover:bg-gray-100 transition-colors duration-200;
}

.close-icon {
  @apply w-6 h-6;
}

/* 模态框主体 */
.modal-body {
  @apply flex-1 overflow-y-auto p-6;
}

/* 空状态 */
.empty-state {
  @apply flex flex-col items-center justify-center py-20 text-center;
}

.empty-icon {
  @apply text-6xl mb-4;
}

.empty-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.empty-description {
  @apply text-gray-600;
}

/* 文件网格 */
.files-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}

/* 文件卡片 */
.file-card {
  @apply relative bg-white border border-gray-200 rounded-lg p-4
         cursor-pointer transition-all duration-200 hover:shadow-lg
         hover:border-blue-300 hover:-translate-y-1;
}

.file-card:hover {
  @apply shadow-xl;
}

/* 文件预览 */
.file-preview {
  @apply relative mb-3;
}

.file-icon {
  @apply w-16 h-16 mx-auto flex items-center justify-center
         rounded-lg mb-2;
}

/* 不同文件类型的图标样式 */
.file-type-pdf .file-icon {
  @apply bg-red-100 text-red-600;
}

.file-type-docx .file-icon {
  @apply bg-blue-100 text-blue-600;
}

.file-type-pptx .file-icon {
  @apply bg-orange-100 text-orange-600;
}

.file-type-xlsx .file-icon {
  @apply bg-green-100 text-green-600;
}

.file-type-zip .file-icon {
  @apply bg-purple-100 text-purple-600;
}

.file-type-mp4 .file-icon,
.file-type-mp3 .file-icon {
  @apply bg-gray-100 text-gray-600;
}

.file-type-default .file-icon {
  @apply bg-gray-100 text-gray-600;
}

.file-icon svg {
  @apply w-8 h-8;
}

.file-type-badge {
  @apply absolute top-0 right-0 px-2 py-1 bg-white bg-opacity-90
         text-xs font-medium text-gray-700 rounded-bl;
  font-size: 10px;
}

/* 文件信息 */
.file-info {
  @apply mb-3;
}

.file-name {
  @apply text-sm font-medium text-gray-900 mb-1 truncate;
  line-height: 1.3;
}

.file-meta {
  @apply flex items-center justify-between text-xs text-gray-600;
}

.file-size {
  @apply px-2 py-0.5 bg-gray-100 rounded;
}

.file-extension {
  @apply text-gray-500 uppercase;
}

/* 文件操作 */
.file-actions {
  @apply flex space-x-2 opacity-0 transition-opacity duration-200;
}

.file-card:hover .file-actions {
  @apply opacity-100;
}

.action-btn {
  @apply flex-1 flex items-center justify-center p-2 text-sm
         rounded-lg transition-colors duration-200;
}

.download-btn {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.preview-btn {
  @apply bg-gray-100 text-gray-600 hover:bg-gray-200;
}

.action-icon {
  @apply w-4 h-4;
}

/* 模态框底部 */
.modal-footer {
  @apply flex items-center justify-end space-x-3 p-6 border-t border-gray-200;
}

.footer-actions {
  @apply flex flex-wrap gap-3;
}

.action-btn {
  @apply flex items-center space-x-2 px-4 py-2 rounded-lg
         font-medium transition-colors duration-200;
}

.action-secondary {
  @apply border border-gray-300 text-gray-700 hover:bg-gray-50;
}

.btn-icon {
  @apply w-4 h-4;
}

/* 下载状态 */
.action-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-viewer-modal {
    @apply p-2;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    @apply p-4;
  }
  
  .modal-title {
    @apply text-xl;
  }
  
  .files-grid {
    @apply grid-cols-1;
  }
  
  .footer-actions {
    @apply flex-col space-y-2;
  }
  
  .action-btn {
    @apply w-full justify-center;
  }
  
  .file-actions {
    @apply opacity-100;
  }
}

/* 暗色主题 */
@media (prefers-color-scheme: dark) {
  .file-viewer-modal {
    @apply bg-black bg-opacity-70;
  }
  
  .modal-content {
    @apply bg-gray-800;
  }
  
  .modal-header,
  .modal-footer {
    @apply border-gray-700;
  }
  
  .modal-title {
    @apply text-white;
  }
  
  .file-count {
    @apply text-gray-300;
  }
  
  .file-card {
    @apply bg-gray-700 border-gray-600 hover:border-blue-500;
  }
  
  .file-name {
    @apply text-white;
  }
  
  .file-meta,
  .file-extension {
    @apply text-gray-300;
  }
  
  .file-size {
    @apply bg-gray-600 text-gray-300;
  }
  
  .preview-btn {
    @apply bg-gray-600 text-gray-300 hover:bg-gray-500;
  }
  
  .file-type-badge {
    @apply bg-gray-700 text-gray-300;
  }
  
  .empty-title {
    @apply text-white;
  }
  
  .empty-description {
    @apply text-gray-300;
  }
  
  .action-secondary {
    @apply border-gray-600 text-gray-300 hover:bg-gray-700;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .modal-content {
    @apply border-2 border-gray-800;
  }
  
  .file-card {
    @apply border-2;
  }
  
  .file-card:hover {
    @apply border-4;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .file-viewer-modal,
  .modal-content,
  .file-card {
    @apply transition-none;
  }
  
  .file-card:hover {
    @apply transform-none;
  }
}

/* 文件类型特定颜色 */
.file-type-pdf .file-icon { @apply bg-red-500/10 text-red-600; }
.file-type-docx .file-icon { @apply bg-blue-500/10 text-blue-600; }
.file-type-pptx .file-icon { @apply bg-orange-500/10 text-orange-600; }
.file-type-xlsx .file-icon { @apply bg-green-500/10 text-green-600; }
.file-type-zip .file-icon { @apply bg-purple-500/10 text-purple-600; }
.file-type-mp4 .file-icon,
.file-type-mp3 .file-icon { @apply bg-pink-500/10 text-pink-600; }
.file-type-jpg .file-icon,
.file-type-png .file-icon,
.file-type-gif .file-icon { @apply bg-yellow-500/10 text-yellow-600; }
</style>