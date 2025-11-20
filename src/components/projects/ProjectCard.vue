<template>
  <div 
    class="project-card" 
    @mouseenter="showDetails = true" 
    @mouseleave="showDetails = false"
    @click="$emit('select', project)"
  >
    <div class="project-image">
      <img 
        :src="coverImage" 
        :alt="projectTitle"
        @error="handleImageError"
      >
      <div
        class="status-badge"
        :class="`status-${statusClass}`"
      >
        {{ getStatusText(statusClass) }}
      </div>
      <div
        v-show="showDetails && techStack.length"
        class="project-overlay"
      >
        <div class="tech-stack">
          <span 
            v-for="tech in techStack.slice(0, 4)" 
            :key="tech" 
            class="tech-tag"
          >
            {{ tech }}
          </span>
          <span
            v-if="techStack.length > 4"
            class="tech-tag"
          >
            +{{ techStack.length - 4 }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="project-content">
      <div class="project-header">
        <h3 class="project-title">
          {{ projectTitle }}
        </h3>
        <span class="project-category">{{ categoryLabel }}</span>
      </div>
      
      <p class="project-description">
        {{ projectDescription }}
      </p>
      
      <div
        v-if="statusClass !== 'completed'"
        class="project-progress"
      >
        <div class="progress-info">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${progressValue}%` }"
            />
          </div>
          <span class="progress-text">{{ progressValue }}% 完成</span>
        </div>
      </div>
      
      <div class="project-meta">
        <div class="project-dates">
          <span class="date-item">
            <CalendarIcon class="meta-icon" />
            {{ formatDate(project.startDate) }}
          </span>
          <span
            v-if="project.endDate"
            class="date-item"
          >
            <CalendarCheckIcon class="meta-icon" />
            {{ formatDate(project.endDate) }}
          </span>
        </div>
        <div class="project-team">
          <UsersIcon class="meta-icon" />
          {{ teamSizeLabel }}人团队
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
            :title="'GitHub 仓库'"
            @click.stop
          >
            <GithubIcon />
          </a>
          <a 
            v-if="project.demoUrl" 
            :href="project.demoUrl" 
            target="_blank" 
            class="link-btn"
            :title="'在线演示'"
            @click.stop
          >
            <ExternalLinkIcon />
          </a>
          <button 
            v-if="documentationLink"
            class="link-btn"
            title="技术文档"
            @click.stop="showDocumentation"
          >
            <FileTextIcon />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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

const coverImage = computed(() => {
  return props.project.images?.[0]
    || props.project.imageUrl
    || props.project.coverImage
    || '/images/default-project.png'
})

const projectTitle = computed(() => {
  return props.project.title || props.project.name || '未命名项目'
})

const projectDescription = computed(() => {
  return props.project.shortDescription
    || props.project.summary
    || props.project.description
    || '暂无项目简介'
})

const techStack = computed(() => {
  return Array.isArray(props.project.techStack) ? props.project.techStack : []
})

const normalizeStatus = (status: string | undefined): string => {
  if (!status) return 'planning'
  const key = status.toLowerCase()
  if (key.includes('progress')) return 'in-progress'
  if (key.includes('complete')) return 'completed'
  if (key.includes('pause') || key.includes('hold')) return 'paused'
  if (key.includes('ongoing')) return 'ongoing'
  if (key.includes('plan')) return 'planning'
  return key
}

const statusClass = computed(() => normalizeStatus(props.project.status as string))

const categoryLabel = computed(() => {
  const category = props.project.category
  if (!category) return '未分类'
  const lookup: Record<string, string> = {
    collaboration: '协作项目',
    competition: '竞赛项目',
    development: '开发项目',
    education: '教育项目',
    research: '研究项目'
  }
  const key = category.toString().toLowerCase()
  return lookup[key] || category.toString()
})

const progressValue = computed(() => {
  const value = Number(props.project.progress ?? 0)
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, Math.round(value)))
})

const teamSizeLabel = computed(() => {
  if (props.project.teamSize) return String(props.project.teamSize)
  if (Array.isArray(props.project.contributors) && props.project.contributors.length) {
    return String(props.project.contributors.length)
  }
  return '1-5'
})

const documentationLink = computed(() => {
  return props.project.documentation || props.project.documentationUrl || null
})

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'planning': '规划中',
    'in-progress': '开发中',
    'completed': '已完成',
    'paused': '已暂停',
    'ongoing': '进行中'
  }
  return statusMap[status] || props.project.status || status
}

// 格式化日期
const formatDate = (dateInput?: string | Date) => {
  if (!dateInput) return '未知'
  
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
    if (Number.isNaN(date.getTime())) return '未知'
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return `${year}年${month}月`
  } catch {
    return typeof dateInput === 'string' ? dateInput : '未知'
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