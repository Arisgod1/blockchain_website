<template>
  <div class="project-detail-modal" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- 模态框头部 -->
      <div class="modal-header">
        <div class="header-info">
          <h2 class="project-title">{{ project.title }}</h2>
          <div class="project-badges">
            <span class="status-badge" :class="`status-${project.status}`">
              {{ getStatusText(project.status) }}
            </span>
            <span class="category-badge">{{ project.category }}</span>
          </div>
        </div>
        <button @click="$emit('close')" class="close-btn">
          <XIcon />
        </button>
      </div>

      <!-- 模态框内容 -->
      <div class="modal-body">
        <div class="content-grid">
          <!-- 左侧内容 -->
          <div class="left-content">
            <!-- 项目图片轮播 -->
            <div class="project-gallery" v-if="project.images && project.images.length > 0">
              <div class="main-image">
                <img 
                  :src="currentImage" 
                  :alt="project.title"
                  @error="handleImageError"
                />
                <button 
                  v-if="project.images.length > 1"
                  @click="previousImage"
                  class="nav-btn prev-btn"
                >
                  <ChevronLeftIcon />
                </button>
                <button 
                  v-if="project.images.length > 1"
                  @click="nextImage"
                  class="nav-btn next-btn"
                >
                  <ChevronRightIcon />
                </button>
              </div>
              <div v-if="project.images.length > 1" class="image-thumbnails">
                <button
                  v-for="(image, index) in project.images"
                  :key="index"
                  @click="currentImageIndex = index"
                  :class="['thumbnail', { active: index === currentImageIndex }]"
                >
                  <img :src="image" :alt="`项目截图 ${index + 1}`" />
                </button>
              </div>
            </div>

            <!-- 项目描述 -->
            <div class="project-description">
              <h3 class="section-title">项目描述</h3>
              <p class="description-text">{{ project.description }}</p>
            </div>

            <!-- 技术栈 -->
            <div class="tech-stack-section">
              <h3 class="section-title">技术栈</h3>
              <div class="tech-tags">
                <span 
                  v-for="tech in project.techStack" 
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- 项目进度 -->
            <div v-if="project.status !== 'completed'" class="project-progress-section">
              <h3 class="section-title">开发进度</h3>
              <div class="progress-info">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${project.progress}%` }"></div>
                </div>
                <span class="progress-text">{{ project.progress }}% 完成</span>
              </div>
            </div>
          </div>

          <!-- 右侧内容 -->
          <div class="right-content">
            <!-- 项目统计 -->
            <div class="project-stats">
              <h3 class="section-title">项目统计</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <HeartIcon class="stat-icon" />
                  <div class="stat-content">
                    <div class="stat-value">{{ project.likes || 0 }}</div>
                    <div class="stat-label">点赞数</div>
                  </div>
                </div>
                <div class="stat-item">
                  <EyeIcon class="stat-icon" />
                  <div class="stat-content">
                    <div class="stat-value">{{ project.views || 0 }}</div>
                    <div class="stat-label">查看数</div>
                  </div>
                </div>
                <div class="stat-item">
                  <UsersIcon class="stat-icon" />
                  <div class="stat-content">
                    <div class="stat-value">{{ project.teamSize || '未知' }}</div>
                    <div class="stat-label">团队规模</div>
                  </div>
                </div>
                <div class="stat-item">
                  <ClockIcon class="stat-icon" />
                  <div class="stat-content">
                    <div class="stat-value">{{ getDuration() }}</div>
                    <div class="stat-label">开发周期</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 项目信息 -->
            <div class="project-info">
              <h3 class="section-title">项目信息</h3>
              <div class="info-list">
                <div class="info-item">
                  <CalendarIcon class="info-icon" />
                  <div class="info-content">
                    <div class="info-label">开始时间</div>
                    <div class="info-value">{{ formatDate(project.startDate) }}</div>
                  </div>
                </div>
                <div v-if="project.endDate" class="info-item">
                  <CalendarCheckIcon class="info-icon" />
                  <div class="info-content">
                    <div class="info-label">预计完成</div>
                    <div class="info-value">{{ formatDate(project.endDate) }}</div>
                  </div>
                </div>
                <div class="info-item">
                  <TagIcon class="info-icon" />
                  <div class="info-content">
                    <div class="info-label">项目分类</div>
                    <div class="info-value">{{ project.category }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 贡献者 -->
            <div v-if="project.contributors && project.contributors.length > 0" class="contributors-section">
              <h3 class="section-title">团队成员</h3>
              <div class="contributors-list">
                <span 
                  v-for="contributor in project.contributors" 
                  :key="contributor"
                  class="contributor-tag"
                >
                  {{ contributor }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 模态框底部 -->
      <div class="modal-footer">
        <div class="footer-actions">
          <button 
            @click="toggleLike"
            class="action-btn like-btn"
            :class="{ liked: project.isLiked }"
          >
            <HeartIcon class="action-icon" />
            {{ project.isLiked ? '已点赞' : '点赞' }}
          </button>
          
          <div class="link-buttons">
            <a 
              v-if="project.githubUrl"
              :href="project.githubUrl"
              target="_blank"
              class="action-btn link-btn"
            >
              <GithubIcon class="action-icon" />
              GitHub
            </a>
            <a 
              v-if="project.demoUrl"
              :href="project.demoUrl"
              target="_blank"
              class="action-btn link-btn"
            >
              <ExternalLinkIcon class="action-icon" />
              在线演示
            </a>
            <button 
              v-if="project.documentation"
              @click="showDocumentation"
              class="action-btn link-btn"
            >
              <FileTextIcon class="action-icon" />
              技术文档
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Project } from '@/types/entities'

interface Props {
  project: Project
}

interface Emits {
  close: []
  like: [project: Project]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentImageIndex = ref(0)

// 计算属性
const currentImage = computed(() => {
  const images = props.project.images || []
  return images[currentImageIndex.value] || '/images/default-project.png'
})

// 监听项目变化，重置图片索引
watch(() => props.project.id, () => {
  currentImageIndex.value = 0
})

// 方法
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'planning': '规划中',
    'in-progress': '开发中', 
    'completed': '已完成',
    'paused': '已暂停'
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}年${month}月${day}日`
  } catch {
    return dateString
  }
}

const getDuration = () => {
  const start = new Date(props.project.startDate)
  const end = props.project.endDate ? new Date(props.project.endDate) : new Date()
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 30) {
    return `${diffDays}天`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months}个月`
  } else {
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    return months > 0 ? `${years}年${months}个月` : `${years}年`
  }
}

const nextImage = () => {
  const images = props.project.images || []
  if (images.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length
  }
}

const previousImage = () => {
  const images = props.project.images || []
  if (images.length > 0) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? images.length - 1 
      : currentImageIndex.value - 1
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/default-project.png'
}

const toggleLike = () => {
  props.project.isLiked = !props.project.isLiked
  if (props.project.isLiked) {
    props.project.likes = (props.project.likes || 0) + 1
  } else {
    props.project.likes = Math.max(0, (props.project.likes || 0) - 1)
  }
  emit('like', props.project)
}

const showDocumentation = () => {
  if (props.project.documentation) {
    window.open(props.project.documentation, '_blank')
  }
}

// 图标组件
const XIcon = () => import('@/components/icons').then(m => m.XIcon)
const ChevronLeftIcon = () => import('@/components/icons').then(m => m.ChevronLeftIcon)
const ChevronRightIcon = () => import('@/components/icons').then(m => m.ChevronRightIcon)
const HeartIcon = () => import('@/components/icons').then(m => m.HeartIcon)
const EyeIcon = () => import('@/components/icons').then(m => m.EyeIcon)
const UsersIcon = () => import('@/components/icons').then(m => m.UsersIcon)
const ClockIcon = () => import('@/components/icons').then(m => m.ClockIcon)
const CalendarIcon = () => import('@/components/icons').then(m => m.CalendarIcon)
const CalendarCheckIcon = () => import('@/components/icons').then(m => m.CalendarCheckIcon)
const TagIcon = () => import('@/components/icons').then(m => m.TagIcon)
const GithubIcon = () => import('@/components/icons').then(m => m.GithubIcon)
const ExternalLinkIcon = () => import('@/components/icons').then(m => m.ExternalLinkIcon)
const FileTextIcon = () => import('@/components/icons').then(m => m.FileTextIcon)
</script>

<style scoped>
.project-detail-modal {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4;
}

.modal-content {
  @apply bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.modal-header {
  @apply flex items-start justify-between p-6 border-b border-gray-200;
}

.header-info {
  @apply flex-1;
}

.project-title {
  @apply text-2xl font-bold text-gray-900 mb-3;
}

.project-badges {
  @apply flex items-center gap-3;
}

.status-badge {
  @apply px-3 py-1 rounded-full text-sm font-medium text-white;
}

.status-planning {
  @apply bg-yellow-500;
}

.status-in-progress {
  @apply bg-blue-500;
}

.status-completed {
  @apply bg-green-500;
}

.status-paused {
  @apply bg-gray-500;
}

.category-badge {
  @apply px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium;
}

.close-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors;
}

.modal-body {
  @apply overflow-y-auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

.left-content {
  @apply space-y-6;
}

.right-content {
  @apply space-y-6;
}

.project-gallery {
  @apply space-y-4;
}

.main-image {
  @apply relative aspect-video bg-gray-100 rounded-lg overflow-hidden;
}

.main-image img {
  @apply w-full h-full object-cover;
}

.nav-btn {
  @apply absolute top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all;
}

.prev-btn {
  @apply left-4;
}

.next-btn {
  @apply right-4;
}

.image-thumbnails {
  @apply flex gap-2 overflow-x-auto;
}

.thumbnail {
  @apply w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent cursor-pointer flex-shrink-0;
}

.thumbnail.active {
  @apply border-blue-500;
}

.thumbnail img {
  @apply w-full h-full object-cover;
}

.section-title {
  @apply text-lg font-semibold text-gray-900 mb-3;
}

.description-text {
  @apply text-gray-600 leading-relaxed;
}

.tech-tags {
  @apply flex flex-wrap gap-2;
}

.tech-tag {
  @apply px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium;
}

.progress-info {
  @apply space-y-2;
}

.progress-bar {
  @apply h-3 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500;
}

.progress-text {
  @apply text-sm font-medium text-gray-700;
}

.stats-grid {
  @apply grid grid-cols-2 gap-4;
}

.stat-item {
  @apply flex items-center gap-3 p-3 bg-gray-50 rounded-lg;
}

.stat-icon {
  @apply w-5 h-5 text-gray-600;
}

.stat-content {
  @apply flex-1;
}

.stat-value {
  @apply text-lg font-semibold text-gray-900;
}

.stat-label {
  @apply text-xs text-gray-600;
}

.info-list {
  @apply space-y-3;
}

.info-item {
  @apply flex items-start gap-3;
}

.info-icon {
  @apply w-5 h-5 text-gray-600 mt-1 flex-shrink-0;
}

.info-content {
  @apply flex-1;
}

.info-label {
  @apply text-xs text-gray-600 mb-1;
}

.info-value {
  @apply text-sm font-medium text-gray-900;
}

.contributors-list {
  @apply flex flex-wrap gap-2;
}

.contributor-tag {
  @apply px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm;
}

.modal-footer {
  @apply border-t border-gray-200 p-6;
}

.footer-actions {
  @apply flex items-center justify-between;
}

.like-btn {
  @apply flex items-center gap-2 px-6 py-3 rounded-lg transition-colors;
}

.like-btn:not(.liked) {
  @apply bg-red-500 text-white hover:bg-red-600;
}

.like-btn.liked {
  @apply bg-gray-100 text-red-500 hover:bg-gray-200;
}

.link-buttons {
  @apply flex items-center gap-3;
}

.action-btn {
  @apply flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors;
}

.link-btn {
  @apply bg-gray-900 text-white border-gray-900 hover:bg-gray-800;
}

.action-icon {
  @apply w-4 h-4;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .modal-content {
    @apply max-w-none h-full max-h-none rounded-none;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1rem;
  }
  
  .modal-header {
    @apply p-4;
  }
  
  .project-title {
    @apply text-xl;
  }
  
  .footer-actions {
    @apply flex-col gap-4;
  }
  
  .link-buttons {
    @apply w-full;
  }
  
  .link-btn {
    @apply flex-1 justify-center;
  }
}
</style>