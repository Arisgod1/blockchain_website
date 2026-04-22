<template>
  <div
    class="member-card-container"
    @mouseenter="isFlipped = true"
    @mouseleave="isFlipped = false"
  >
    <div
      class="card-inner"
      :class="{ 'is-flipped': isFlipped }"
    >
      <!-- 正面 -->
      <div class="card-front">
        <div class="member-avatar">
          <img 
            :src="member.avatar || defaultAvatar" 
            :alt="member.name" 
            @error="handleImageError"
          >
          <div
            class="member-role-badge"
            :class="`role-${getRoleClass(member.role)}`"
          >
            {{ member.role }}
          </div>
        </div>
        <h3 class="member-name">
          {{ member.name }}
        </h3>
        <p
          v-if="member.grade && member.major"
          class="member-grade"
        >
          {{ member.grade }} • {{ member.major }}
        </p>
        <div class="member-skills">
          <span 
            v-for="skill in member.skills.slice(0, 3)" 
            :key="skill" 
            class="skill-tag"
          >
            {{ skill }}
          </span>
        </div>
        <div class="member-stats">
          <div class="stat">
            <CalendarIcon class="stat-icon" />
            <span class="stat-text">{{ formatJoinDate(member.joinDate) }}</span>
          </div>
          
        </div>
      </div>
      
      <!-- 背面 -->
      <div class="card-back">
        <h3 class="member-name">
          {{ member.name }}
        </h3>
        <p
          class="member-bio"
          :title="member.bio || '暂无个人简介'"
        >
          {{ member.bio || '暂无个人简介' }}
        </p>
        <button
          v-if="isBioTruncated"
          type="button"
          class="bio-more-hint"
          @click.stop="emit('view', member)"
        >
          点击查看完整介绍 →
        </button>
        <div class="member-links">
          <a 
            v-if="member.github" 
            :href="member.github" 
            target="_blank" 
            class="link-btn"
            @click.stop
          >
            <GithubIcon />
          </a>
          <a 
            v-if="member.email" 
            :href="`mailto:${member.email}`" 
            class="link-btn"
            @click.stop
          >
            <EmailIcon />
          </a>
          <a 
            v-if="member.linkedin" 
            :href="member.linkedin" 
            target="_blank" 
            class="link-btn"
            @click.stop
          >
            <LinkedInIcon />
          </a>
        </div>
        <div class="member-skills-full">
          <span 
            v-for="skill in member.skills" 
            :key="skill" 
            class="skill-tag"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="showActions"
      class="card-actions"
    >
      <button
        class="action-btn view-btn"
        title="查看详情"
        @click.stop="emit('view', member)"
      >
        👁️
      </button>
      <button
        class="action-btn edit-btn"
        title="编辑"
        @click.stop="emit('edit', member)"
      >
        ✏️
      </button>
      <button
        class="action-btn toggle-btn"
        :title="member.isActive ? '设为非活跃' : '设为活跃'"
        @click.stop="emit('toggle-status', member)"
      >
        {{ member.isActive ? '⏸️' : '▶️' }}
      </button>
      <button
        class="action-btn delete-btn"
        title="删除"
        @click.stop="emit('delete', member)"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import defaultAvatar from '@/assets/BLOCKCHAINNexus.png'
import type { Member } from '@/types/entities'
import { GithubIcon, EmailIcon, LinkedInIcon, CalendarIcon } from '@/components/icons'

interface Props {
  member: Member
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false
})

// 粗略判断 bio 是否会被截断（5 行 * ~18 字/行 ≈ 90 字符）
// 用字符数估算避免依赖 DOM measurement，轻量且足够准确
const isBioTruncated = computed(() => {
  const bio = props.member.bio
  return typeof bio === 'string' && bio.length > 90
})

const emit = defineEmits<{
  (e: 'view', member: Member): void
  (e: 'edit', member: Member): void
  (e: 'delete', member: Member): void
  (e: 'toggle-status', member: Member): void
}>()

const isFlipped = ref(false)

// 获取角色样式类
const getRoleClass = (role: string) => {
  const roleMap: Record<string, string> = {
    '组长': 'leader',
    '技术负责人': 'tech-lead', 
    '前端开发': 'frontend',
    '后端开发': 'backend',
    '区块链开发': 'blockchain',
    '开发成员': 'developer',
    '研究员': 'researcher'
  }
  return roleMap[role] || 'default'
}

// 格式化加入时间
const formatJoinDate = (dateString: string) => {
  if (!dateString) return '未知'
  
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return `${year}年${month}月加入`
  } catch {
    return dateString
  }
}

// 处理头像加载失败
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultAvatar
}

defineExpose({
  isFlipped
})
</script>

<style scoped lang="postcss">
.member-card-container {
  @apply relative w-full max-w-xs mx-auto cursor-pointer perspective-1000 flex flex-col items-stretch gap-3;
}

.card-inner {
  @apply relative w-full transition-transform duration-700 transform-style-preserve-3d;
  height: 22rem;
}

.card-actions {
  @apply w-full flex flex-wrap items-center justify-center gap-2;
}

.action-btn {
  @apply px-3 py-2 rounded-md text-sm border border-gray-200 bg-white shadow-sm hover:shadow transition;
}

.view-btn { @apply text-blue-600; }
.edit-btn { @apply text-amber-600; }
.toggle-btn { @apply text-indigo-600; }
.delete-btn { @apply text-red-600; }

.card-inner.is-flipped {
  @apply rotate-y-180;
}

.card-front,
.card-back {
  @apply absolute inset-0 w-full h-full backface-hidden rounded-xl bg-white shadow-lg border border-gray-200 p-6 flex flex-col items-center justify-center;
}

.card-back {
  @apply rotate-y-180;
}

/* 关键：翻转状态下切换两面的 pointer-events，防止背对的一面拦截点击 */
.card-inner:not(.is-flipped) .card-back {
  pointer-events: none;
}

.card-inner.is-flipped .card-front {
  pointer-events: none;
}

.member-avatar {
  @apply relative mb-4;
}

.member-avatar img {
  @apply w-20 h-20 rounded-full object-cover border-4 border-blue-100;
}

.member-role-badge {
  @apply absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium text-white;
}

.role-leader {
  @apply bg-red-500;
}

.role-tech-lead {
  @apply bg-orange-500;
}

.role-frontend {
  @apply bg-blue-500;
}

.role-backend {
  @apply bg-green-500;
}

.role-blockchain {
  @apply bg-purple-500;
}

.role-developer {
  @apply bg-gray-500;
}

.role-researcher {
  @apply bg-indigo-500;
}

.role-default {
  @apply bg-gray-400;
}

.member-name {
  @apply text-xl font-bold text-gray-800 text-center mb-2;
}

.member-grade {
  @apply text-sm text-gray-600 text-center mb-4;
}

.member-skills {
  @apply flex flex-wrap gap-1 justify-center mb-4;
}

.skill-tag {
  @apply px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full;
}

.member-stats {
  @apply flex flex-col gap-2 w-full;
}

.stat {
  @apply flex items-center gap-2 text-sm text-gray-600;
}

.stat-icon {
  @apply w-4 h-4;
}

.card-back {
  justify-content: flex-start;
  gap: 0.5rem;
}

.card-back .member-name {
  @apply mb-1;
  flex-shrink: 0;
}

.member-bio {
  @apply text-sm text-gray-600 text-center leading-relaxed w-full;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1 1 auto;
  min-height: 0;
  margin: 0;
}

.bio-more-hint {
  @apply text-xs text-blue-500 text-center bg-transparent border-0 cursor-pointer px-2 py-1 rounded hover:text-blue-700 hover:bg-blue-50 transition-colors;
  flex-shrink: 0;
}

.member-links {
  @apply flex gap-3 mt-1;
  flex-shrink: 0;
}

.link-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors;
}

.member-skills-full {
  @apply flex flex-wrap gap-1 justify-center w-full;
  flex-shrink: 0;
  max-height: 4.5rem;
  overflow-y: auto;
  scrollbar-width: thin;
}

.member-skills-full::-webkit-scrollbar {
  width: 4px;
}

.member-skills-full::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.5);
  border-radius: 2px;
}

.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .member-card-container {
    @apply w-full max-w-sm;
  }

  .card-inner {
    height: 20rem;
  }

  .card-front,
  .card-back {
    @apply p-5;
  }

  .member-avatar img {
    @apply w-16 h-16;
  }

  .member-name {
    @apply text-lg;
  }

  .member-bio {
    -webkit-line-clamp: 4;
  }

  .member-skills-full {
    max-height: 3.5rem;
  }
}

@media (max-width: 480px) {
  .card-inner {
    height: 19rem;
  }

  .member-bio {
    -webkit-line-clamp: 3;
  }
}
</style>