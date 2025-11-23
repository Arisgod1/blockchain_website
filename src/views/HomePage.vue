<template>
  <div class="home-shell">
    <section class="home-grid">
      <article class="info-pane">
        <p class="info-pane__eyebrow">
          DUT Blockchain · Since 2018
        </p>
        <h1>
          链接未来的
          <span>科研与创新</span>
        </h1>
        <p class="info-pane__lede">
          我们聚焦时代前沿技术、跨链互操作与现实世界资产映射，
          将学院实验室的突破，转化为可落地的创新方案。
        </p>

        <div class="info-pane__stats">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="stat-card"
          >
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>

        <div class="info-pane__actions">
          <HexBladeButton
            label="查看项目"
            sub-label="PROJECTS"
            icon="🚀"
            theme-color="#60a5fa"
            @click="goProjects"
          />
          <button
            type="button"
            class="ghost-action"
            @click="goContact"
          >
            预约共创
            <span>→</span>
          </button>
        </div>
      </article>

      <section class="interactive-pane">
        <OrbitalField :items="navigationItems" />
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useRouter } from 'vue-router'
import OrbitalField, { type OrbitNavItem } from '@/components/home/OrbitalField.vue'
import HexBladeButton from '@/components/home/HexBladeButton.vue'

const router = useRouter()

const navigationItems: OrbitNavItem[] = [
  {
    id: 'about',
    title: '关于我们',
    subtitle: 'ABOUT',
    description: '团队使命·发展脉络',
    icon: '👥',
    route: '/about',
    themeColor: '#38bdf8',
    orbit: 1,
    angle: -10
  },
  {
    id: 'members',
    title: '成员档案',
    subtitle: 'MEMBERS',
    description: '跨学科研发小组',
    icon: '👨‍💻',
    route: '/members',
    themeColor: '#f59e0b',
    orbit: 0,
    angle: 40
  },
  {
    id: 'projects',
    title: '项目矩阵',
    subtitle: 'PROJECTS',
    description: '科研成果与产业共创',
    icon: '📊',
    route: '/projects',
    themeColor: '#818cf8',
    orbit: 1,
    angle: 100
  },
  {
    id: 'blog',
    title: '知识星图',
    subtitle: 'BLOG',
    description: '研究分享与技术洞察',
    icon: '📚',
    route: '/blog',
    themeColor: '#34d399',
    orbit: 1,
    angle: 170
  },
  {
    id: 'meetings',
    title: '例会纪要',
    subtitle: 'MEETINGS',
    description: '周更学习与评审',
    icon: '📝',
    route: '/meetings',
    themeColor: '#f97316',
    orbit: 0,
    angle: 230
  },
  {
    id: 'contact',
    title: '联系我们',
    subtitle: 'CONTACT',
    description: '合作咨询·加入社群',
    icon: '📧',
    route: '/contact',
    themeColor: '#c084fc',
    orbit: 1,
    angle: 280
  }
]

const stats = [
  { label: '科研合作', value: '38+' },
  { label: '在研项目', value: '15' },
  { label: '核心成员', value: '28' }
]

const goProjects = () => router.push('/projects')
const goContact = () => router.push('/contact')

useHead({
  title: '大连理工大学区块链组',
  meta: [
    {
      name: 'description',
      content: '区块链底层研究、跨链互操作与产业孵化，链接科研与行业。'
    }
  ]
})
</script>

<style scoped>
.home-shell {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.08), transparent 55%),
    radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.12), transparent 45%),
    #02030a;
  color: #f8fafc;
}

.home-grid {
  display: grid;
  grid-template-columns: minmax(320px, 38.2%) minmax(0, 61.8%);
  min-height: 100vh;
}

.info-pane {
  padding: clamp(2rem, 4vw, 4rem);
  background: linear-gradient(180deg, rgba(3, 7, 18, 0.9), rgba(15, 23, 42, 0.9));
  border-right: 1px solid rgba(148, 163, 184, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
}

.info-pane::after {
  content: '';
  position: absolute;
  inset: 30% -40% -30% -40%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 60%);
  filter: blur(80px);
  opacity: 0.6;
}

.info-pane > * {
  position: relative;
  z-index: 1;
}

.info-pane__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.9);
}

.info-pane h1 {
  font-size: clamp(2.5rem, 4vw, 3.8rem);
  line-height: 1.1;
  font-weight: 600;
}

.info-pane h1 span {
  display: block;
  color: #60a5fa;
}

.info-pane__lede {
  color: rgba(226, 232, 240, 0.9);
  line-height: 1.8;
  max-width: 40ch;
}

.info-pane__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.stat-card {
  padding: 1.25rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 1.25rem;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(12px);
  text-align: left;
}

.stat-card strong {
  display: block;
  font-size: 2rem;
  font-weight: 600;
}

.stat-card span {
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.85);
}

.info-pane__actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.ghost-action {
  color: #f8fafc;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.4);
  transition: color 0.3s ease, border-color 0.3s ease;
}

.ghost-action:hover {
  color: #60a5fa;
  border-color: #60a5fa;
}

.interactive-pane {
  position: relative;
  padding: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
}

@media (max-width: 962px) {
  .home-grid {
    grid-template-columns: 1fr;
  }
  .info-pane {
    border-right: none;
    border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  }
  .info-pane__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .interactive-pane {
    min-height: 520px;
    padding: 0;
  }
}

@media (max-width: 640px) {
  .info-pane__stats {
    grid-template-columns: 1fr;
  }
  .info-pane__actions {
    flex-direction: column;
    align-items: flex-start;
  }
  .interactive-pane {
    min-height: unset;
    padding: 0;
  }
}
</style>