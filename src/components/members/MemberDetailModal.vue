<template>
  <BaseModal 
    :show="show" 
    :title="member?.name + ' - 详细信息'"
    size="lg"
    @close="$emit('close')"
  >
    <div
      v-if="member"
      class="member-detail-content"
    >
      <!-- 基本信息 -->
      <div class="detail-section">
        <h3 class="section-title">
          基本信息
        </h3>
        <div class="info-grid">
          <div class="info-item">
            <label>姓名：</label>
            <span>{{ member.name }}</span>
          </div>
          <div class="info-item">
            <label>职位：</label>
            <span>{{ member.role }}</span>
          </div>
          <div class="info-item">
            <label>年级：</label>
            <span>{{ member.grade }}</span>
          </div>
          <div class="info-item">
            <label>加入时间：</label>
            <span>{{ formatDate(member.joinDate) }}</span>
          </div>
          <div class="info-item">
            <label>邮箱：</label>
            <a :href="`mailto:${member.email}`">{{ member.email }}</a>
          </div>
          <div class="info-item">
            <label>状态：</label>
            <span 
              class="status-badge"
              :class="member.isActive ? 'active' : 'inactive'"
            >
              {{ member.isActive ? '活跃' : '非活跃' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 个人简介 -->
      <div
        v-if="member.bio"
        class="detail-section"
      >
        <h3 class="section-title">
          个人简介
        </h3>
        <p class="bio-text">
          {{ member.bio }}
        </p>
      </div>

      <!-- 技能 -->
      <div class="detail-section">
        <h3 class="section-title">
          技能特长
        </h3>
        <div class="skills-container">
          <span 
            v-for="skill in member.skills" 
            :key="skill"
            class="skill-tag"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- 社交链接 -->
      <div
        v-if="member.github || member.linkedin"
        class="detail-section"
      >
        <h3 class="section-title">
          社交链接
        </h3>
        <div class="social-links">
          <a 
            v-if="member.github"
            :href="member.github" 
            target="_blank"
            class="social-link github-link"
          >
            <span class="social-icon">🐙</span>
            GitHub
          </a>
          <a 
            v-if="member.linkedin"
            :href="member.linkedin" 
            target="_blank"
            class="social-link linkedin-link"
          >
            <span class="social-icon">💼</span>
            LinkedIn
          </a>
        </div>
      </div>

      <!-- 头像 -->
      <div
        v-if="member"
        class="detail-section"
      >
        <h3 class="section-title">
          头像
        </h3>
        <div class="avatar-container">
          <img 
            :src="avatarSrc" 
            :alt="member.name"
            class="detail-avatar"
            @error="handleAvatarError"
          >
        </div>
      </div>
    </div>

    <template #footer>
      <BaseButton 
        variant="secondary"
        @click="$emit('close')"
      >
        关闭
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BaseModal, BaseButton } from '@/components/common'
import type { Member } from '@/types/entities'
import defaultAvatar from '@/assets/BLOCKCHAINNexus.png'

interface Props {
  show: boolean
  member: Member | null
}

interface Emits {
  (e: 'close'): void
  (e: 'update:show', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 双向绑定
const show = computed({
  get: () => props.show,
  set: (value: boolean) => emit('update:show', value)
})

const avatarSrc = computed(() => props.member?.avatar || defaultAvatar)

const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultAvatar
}
</script>

<style scoped>
.member-detail-content {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-item span,
.info-item a {
  font-size: 0.875rem;
  color: #1f2937;
}

.info-item a:hover {
  color: #3b82f6;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.bio-text {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
}

.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.github-link {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.github-link:hover {
  background: #e5e7eb;
  color: #111827;
}

.linkedin-link {
  background: #dbeafe;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.linkedin-link:hover {
  background: #bfdbfe;
  color: #1e40af;
}

.social-icon {
  font-size: 1rem;
}

.avatar-container {
  display: flex;
  justify-content: center;
}

.detail-avatar {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f3f4f6;
}

/* 滚动条样式 */
.member-detail-content::-webkit-scrollbar {
  width: 6px;
}

.member-detail-content::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.member-detail-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.member-detail-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .social-links {
    flex-direction: column;
  }
  
  .detail-avatar {
    width: 6rem;
    height: 6rem;
  }
}
</style>