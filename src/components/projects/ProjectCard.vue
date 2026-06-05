<template>
  <div 
    class="project-card" 
    @mouseenter="showDetails = true" 
    @mouseleave="showDetails = false"
    @click="$emit('select', project)"
  >
    <div class="project-image">
      <img 
        :src="project.images?.[0] || withDefaults" 
        :alt="project.title || project.name || '项目封面'"
        @error="handleImageError"
      >
      <div
        class="status-badge"
        :class="`status-${statusClass}`"
      >
        {{ getStatusText(project.status) }}
      </div>
      <div
        v-show="showDetails"
        class="project-overlay"
      >
        <div class="tech-stack">
          <span 
            v-for="tech in (project.techStack ?? []).slice(0, 4)" 
            :key="tech" 
            class="tech-tag"
          >
            {{ tech }}
          </span>
          <span
            v-if="(project.techStack?.length ?? 0) > 4"
            class="tech-tag"
          >
            +{{ (project.techStack?.length ?? 0) - 4 }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="project-content">
      <div class="project-header">
        <h3 class="project-title">
          {{ project.title || project.name }}
        </h3>
        <span class="project-category">{{ project.category }}</span>
      </div>
      
      <p class="project-description">
        {{ project.shortDescription || project.description }}
      </p>
      
      <div
        v-if="statusClass !== 'completed'"
        class="project-progress"
      >
        <div class="progress-info">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${project.progress ?? 0}%` }"
            />
          </div>
          <span class="progress-text">{{ project.progress ?? 0 }}% 完成</span>
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
          {{ project.teamSize || '1-5' }}人团队
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
            {{ project.likes ?? 0 }}
          </button>
          <span class="stat-item">
            <EyeIcon class="stat-icon" />
            {{ project.views ?? 0 }}
          </span>
        </div>
        
        <div class="project-links">
          <a 
            v-if="project.githubUrl || project.repositoryUrl" 
            :href="project.githubUrl || project.repositoryUrl" 
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
            v-if="project.documentation || project.documentationUrl"
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
import  withDefaults  from '@/assets/logo-circle.png'
import defaultProjectImage from '@/assets/BLOCKCHAINNexus.png'
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
const statusClass = computed(() => String(props.project.status ?? 'planning').toLowerCase())

// 获取状态文本
const getStatusText = (status?: string) => {
  const statusMap: Record<string, string> = {
    'planning': '规划中',
    'in-progress': '开发中',
    'completed': '已完成',
    'paused': '已暂停'
  }
  const normalized = String(status ?? 'planning').toLowerCase().replace(/_/g, '-')
  return statusMap[normalized] || status || '规划中'
}

// 格式化日期
const formatDate = (dateInput?: string | Date) => {
  if (!dateInput) return '未知'
  
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
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
  img.onerror = null
  img.src = defaultProjectImage
}

// 切换点赞状态
const toggleLike = () => {
  const nextState = !(props.project.isLiked ?? false)
  const currentLikes = props.project.likes ?? 0
  emit('like', {
    ...props.project,
    isLiked: nextState,
    likes: nextState ? currentLikes + 1 : Math.max(0, currentLikes - 1)
  })
}

// 显示文档
const showDocumentation = () => {
  emit('documentation', props.project)
}

const project = computed(() => props.project)
</script>

<style scoped>
.project-card {
  @apply bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
}

.project-card:hover {
  @apply border-cyan-300;
  transform: translateY(-2px);
}

.project-image {
  @apply relative h-48 overflow-hidden;
  background: #f8fafc;
}

.project-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.02);
}

.status-badge {
  @apply absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold;
  color: #0f172a;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.status-badge::before {
  content: '';
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: currentColor;
}

.status-planning {
  @apply text-amber-700;
}

.status-in-progress {
  @apply text-cyan-700;
}

.status-completed {
  @apply text-emerald-700;
}

.status-paused {
  @apply text-slate-600;
}

.project-overlay {
  @apply absolute inset-0 flex items-center justify-center p-4;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.72));
}

.tech-stack {
  @apply flex flex-wrap gap-2 justify-center;
}

.tech-tag {
  @apply px-2.5 py-1 bg-white text-slate-900 text-xs rounded-full;
}

.project-content {
  @apply p-6 space-y-4;
}

.project-header {
  @apply flex items-start justify-between;
}

.project-title {
  @apply text-xl font-bold text-slate-950 line-clamp-2;
  text-wrap: balance;
}

.project-category {
  @apply px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full flex-shrink-0 ml-2;
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
  @apply flex-1 h-2 bg-slate-100 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-cyan-600 rounded-full transition-all duration-500;
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
  @apply w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-950 hover:text-white transition-colors;
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
