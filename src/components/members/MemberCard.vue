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
          <BaseAvatar
            :src="member.avatar"
            :alt="member.name"
            :fallback-text="member.name"
            size="96"
            ring
          />
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
          <div class="stat">
            <ProjectIcon class="stat-icon" />
            <span class="stat-text">{{ member.projectCount ?? 0 }}个项目</span>
          </div>
        </div>
      </div>
      
      <!-- 背面 -->
      <div class="card-back">
        <h3 class="member-name">
          {{ member.name }}
        </h3>
        <p class="member-bio">
          {{ member.bio || '暂无个人简介' }}
        </p>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Member } from '@/types/entities'
import { GithubIcon, EmailIcon, LinkedInIcon, CalendarIcon, ProjectIcon } from '@/components/icons'
import { BaseAvatar } from '@/components/common'

interface Props {
  member: Member
}

defineProps<Props>()

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

defineExpose({
  isFlipped
})
</script>

<style scoped>
.member-card-container {
  @apply relative w-72 h-96 mx-auto cursor-pointer perspective-1000;
}

.card-inner {
  @apply relative w-full h-full transition-transform duration-700 transform-style-preserve-3d;
}

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

.member-avatar {
  @apply relative mb-4;
}

.member-avatar :deep(.base-avatar) {
  @apply w-24 h-24 sm:w-20 sm:h-20;
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

.card-back .member-name {
  @apply mb-3;
}

.member-bio {
  @apply text-sm text-gray-600 text-center mb-4 leading-relaxed;
}

.member-links {
  @apply flex gap-3 mb-4;
}

.link-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors;
}

.member-skills-full {
  @apply flex flex-wrap gap-1 justify-center;
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
    @apply w-80 h-80;
  }
  
  .member-avatar img {
    @apply w-16 h-16;
  }
  
  .member-name {
    @apply text-lg;
  }
}
</style>