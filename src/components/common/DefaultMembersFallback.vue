<template>
  <section class="fallback-container">
    <div class="fallback-hero">
      <h1>团队成员</h1>
     
    </div>

    <div class="fallback-grid">
      <article v-for="n in 8" :key="n" class="fallback-card">
        <div class="card-top">
          <img :src="defaultAvatar" alt="默认头像" class="member-avatar" />
          <h2 class="member-name">成员姓名</h2>
          <p class="member-role">前端 / 后端 / 区块链</p>
        </div>
        <div class="card-body">
          <div class="tech-stack">
            <span class="tech-label">技术专长:</span>
            <p class="tech-description">示例：Vue.js, Node.js, Solidity</p>
          </div>
          <div class="contact-methods">
            <button class="contact-icon" disabled title="示例 GitHub">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.76.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.18a11.09 11.09 0 0 1 2.9-.39c.99 0 1.99.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.57.24 2.73.12 3.02.74.82 1.19 1.85 1.19 3.1 0 4.42-2.71 5.39-5.29 5.67.42.36.8 1.07.8 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
            </button>
            <button class="contact-icon" disabled title="示例 邮箱">
              @
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import defaultAvatar from '@/assets/zhaoshuyang.png'
</script>

<style scoped>
.fallback-container {
  padding: 3rem 1rem;
  max-width: 72rem;
  margin: 0 auto;
}
.fallback-hero {
  text-align: center;
  margin-bottom: 2rem;
}
.fallback-hero h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #60a5fa;
  margin-bottom: 0.5rem;
}
.fallback-hero p {
  color: #6b7280;
}
.fallback-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}
.fallback-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid rgba(255,255,255,0.1);
}
.card-top {
  text-align: center;
  margin-bottom: 1rem;
}
.member-avatar {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
  object-fit: cover;
  border: 4px solid #bfdbfe;
}
.member-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #93c5fd;
  margin-top: 0.75rem;
}
.member-role {
  font-size: 0.875rem;
  color: #9ca3af;
}
.tech-label {
  color: #93c5fd;
  font-weight: 500;
}
.tech-description {
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 0.5rem;
}
.contact-methods {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
}
.contact-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: rgba(255,255,255,0.06);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #e5e7eb;
}

</style>
