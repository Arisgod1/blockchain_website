<template>
  <div 
    class="project-card" 
    @mouseenter="showDetails = true" 
    @mouseleave="showDetails = false"
    @click="$emit('select', project)"
  >
    <div class="project-image">
      <img 
        :src="project.images?.[0] || '/images/default-project.png'" 
        :alt="project.title"
        @error="handleImageError"
      />
      <div class="status-badge" :class="`status-${project.status}`">
        {{ getStatusText(project.status) }}
      </div>
      <div class="project-overlay" v-show="showDetails">
        <div class="tech-stack">
          <span 
            v-for="tech in project.techStack.slice(0, 4)" 
            :key="tech" 
            class="tech-tag"
          >
            {{ tech }}
          </span>
          <span v-if="project.techStack.length > 4" class="tech-tag">
            +{{ project.techStack.length - 4 }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="project-content">
      <div class="project-header">
        <h3 class="project-title">{{ project.title }}</h3>
        <span class="project-category">{{ project.category }}</span>
      </div>
      
      <p class="project-description">{{ project.shortDescription || project.description }}</p>
      
      <div class="project-progress" v-if="project.status !== 'completed'">
        <div class="progress-info">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${project.progress}%` }"></div>
          </div>
          <span class="progress-text">{{ project.progress }}% 完成</span>
        </div>
      </div>
      
      <div class="project-meta">
        <div class="project-dates">
          <span class="date-item">
            <CalendarIcon class="meta-icon" />
            {{ formatDate(project.startDate) }}
          </span>
          <span v-if="project.endDate" class="date-item">
            <CalendarCheckIcon class="meta-icon" />
            {{ formatDate(project.endDate) }}
          </span>
        </div>
        <div class="project-team">
          <UsersIcon class="meta-icon" />
          {{ project.teamSize || '1-5'}}人团队
        </div>
      </div>
      
      <div class="project-footer">
        <div class="project-stats">
          <button 
            class="stat-btn" 
            :class="{ liked: project.isLiked }"
            @click.stop="toggleLike"
          >
            <HeartIcon class="stat-icon" />
            {{ project.likes || 0 }}
          </button>
          <span class="stat-item">
            <EyeIcon class="stat-icon" />
            {{ project.views || 0 }}
          </span>
        </div>
        
        <div class="project-links">
          <a 
            v-if="project.githubUrl" 
            :href="project.githubUrl" 
            target="_blank" 
            class="link-btn"
            @click.stop
            :title="'GitHub 仓库'"
          >
            <GithubIcon />
          </a>
          <a 
            v-if="project.demoUrl" 
            :href="project.demoUrl" 
            target="_blank" 
            class="link-btn"
            @click.stop
            :title="'在线演示'"
          >
            <ExternalLinkIcon />
          </a>
          <button 
            v-if="project.documentation"
            class="link-btn"
            @click.stop="showDocumentation"
            title="技术文档"
          >
            <FileTextIcon />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from '@/types/entities'
import { 
  GithubIcon, 
  ExternalLinkIcon, 
  FileTextIcon, 
  HeartIcon, 
  EyeIcon,
  CalendarIcon,
  CalendarCheckIcon,
  UsersIcon
} from '@/components/icons'

interface Props {
  project: Project
}

interface Emits {
  select: [project: Project]
  like: [project: Project]
  documentation: [project: Project]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showDetails = ref(false)

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'planning': '规划中',
    'in-progress': '开发中',
    'completed': '已完成',
    'paused': '已暂停'
  }
  return statusMap[status] || status
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return `${year}年${month}月`
  } catch {
    return dateString
  }
}

// 处理图片加载失败
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/default-project.png'
}

// 切换点赞状态
const toggleLike = () => {
  project.isLiked = !project.isLiked
  if (project.isLiked) {
    project.likes = (project.likes || 0) + 1
  } else {
    project.likes = Math.max(0, (project.likes || 0) - 1)
  }
  emit('like', props.project)
}

// 显示文档
const showDocumentation = () => {
  emit('documentation', props.project)
}

// 创建响应式的 project 引用
const project = props.project
</script>

<style scoped>
.project-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1;
}

.project-image {
  @apply relative h-48 overflow-hidden;
}

.project-image img {
  @apply w-full h-full object-cover transition-transform duration-300;
}

.project-card:hover .project-image img {
  @apply scale-110;
}

.status-badge {
  @apply absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white;
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

.project-overlay {
  @apply absolute inset-0 bg-black/60 flex items-center justify-center p-4;
}

.tech-stack {
  @apply flex flex-wrap gap-2 justify-center;
}

.tech-tag {
  @apply px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full;
}

.project-content {
  @apply p-6 space-y-4;
}

.project-header {
  @apply flex items-start justify-between;
}

.project-title {
  @apply text-xl font-bold text-gray-900 line-clamp-2;
}

.project-category {
  @apply px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex-shrink-0 ml-2;
}

.project-description {
  @apply text-gray-600 line-clamp-3 leading-relaxed;
}

.project-progress {
  @apply space-y-2;
}

.progress-info {
  @apply flex items-center gap-3;
}

.progress-bar {
  @apply flex-1 h-2 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500;
}

.progress-text {
  @apply text-sm text-gray-600 whitespace-nowrap;
}

.project-meta {
  @apply flex items-center justify-between text-sm text-gray-500;
}

.project-dates {
  @apply flex items-center gap-4;
}

.date-item {
  @apply flex items-center gap-1;
}

.project-team {
  @apply flex items-center gap-1;
}

.project-footer {
  @apply flex items-center justify-between pt-4 border-t border-gray-100;
}

.project-stats {
  @apply flex items-center gap-4;
}

.stat-btn {
  @apply flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors;
}

.stat-btn.liked {
  @apply text-red-500;
}

.stat-item {
  @apply flex items-center gap-1 text-sm text-gray-600;
}

.stat-icon {
  @apply w-4 h-4;
}

.project-links {
  @apply flex items-center gap-2;
}

.link-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .project-card {
    @apply mx-2;
  }
  
  .project-content {
    @apply p-4 space-y-3;
  }
  
  .project-header {
    @apply flex-col items-start;
  }
  
  .project-category {
    @apply mt-2 ml-0;
  }
  
  .project-meta {
    @apply flex-col items-start gap-2;
  }
  
  .project-dates {
    @apply flex-col gap-1;
  }
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>