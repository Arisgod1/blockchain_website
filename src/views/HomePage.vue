<template>
  <div class="home-shell">
    <section class="home-grid">
      <article class="info-pane">
        <p class="info-pane__eyebrow">
          DUT Blockchain Research Graph
        </p>
        <h1>
          进入区块链组的
          <span>研究网络</span>
        </h1>
        <p class="info-pane__lede">
          从成员、项目、例会到技术文章，每个节点都记录团队如何学习、验证和推进区块链方向的真实问题。
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
            sub-label="PROJECT GRAPH"
            icon="◇"
            theme-color="#67e8f9"
            @click="goProjects"
          />
          <button
            type="button"
            class="ghost-action"
            @click="goContact"
          >
            共创
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
    subtitle: 'TEAM',
    description: '团队使命·发展脉络',
    icon: '👥',
    route: '/about',
    themeColor: '#facc15',
    orbit: 1,
    angle: -10
  },
  {
    id: 'members',
    title: '成员档案',
    subtitle: 'PEOPLE',
    description: '跨学科研发小组',
    icon: '👨‍💻',
    route: '/members',
    themeColor: '#5eead4',
    orbit: 0,
    angle: 40
  },
  {
    id: 'projects',
    title: '项目矩阵',
    subtitle: 'WORK',
    description: '科研成果与产业共创',
    icon: '📊',
    route: '/projects',
    themeColor: '#a78bfa',
    orbit: 1,
    angle: 100
  },
  {
    id: 'blog',
    title: '知识星图',
    subtitle: 'NOTES',
    description: '研究分享与技术洞察',
    icon: '📚',
    route: '/blog',
    themeColor: '#67e8f9',
    orbit: 1,
    angle: 170
  },
  {
    id: 'meetings',
    title: '例会纪要',
    subtitle: 'LOG',
    description: '周更学习与评审',
    icon: '📝',
    route: '/meetings',
    themeColor: '#93c5fd',
    orbit: 0,
    angle: 230
  },
  {
    id: 'contact',
    title: '联系我们',
    subtitle: 'JOIN',
    description: '合作咨询·加入社群',
    icon: '📧',
    route: '/contact',
    themeColor: '#fb7185',
    orbit: 1,
    angle: 280
  }
]

const stats = [
  { label: '科研合作', value: '5+' },
  { label: '在研项目', value: '19' },
  { label: '核心成员', value: '15' }
]

const goProjects = () => router.push('/projects')
const goContact = () => router.push('/contact')

useHead({
  title: '大连理工大学区块链组',
  meta: [
    {
      name: 'description',
  content: '大连理工大学区块链组官方网站，展示成员、项目、例会和研究文章。'
    }
  ]
})
</script>

<style scoped>
.home-shell {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.08), transparent 55%),
    radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.16), transparent 45%),
    #02030a;
  color: #f8fafc;
}

.home-grid {
  display: grid;
  grid-template-columns: minmax(0, 38.2%) minmax(0, 61.8%);
  min-height: 100vh;
}

.info-pane {
  padding: clamp(2rem, 4vw, 4rem);
  background: linear-gradient(180deg, rgba(3, 7, 18, 0.94), rgba(12, 22, 36, 0.92));
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
  background: radial-gradient(circle, rgba(103, 232, 249, 0.2), transparent 60%);
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
  color: #67e8f9;
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
    padding: 2rem 1.25rem 1.5rem;
    border-right: none;
    border-bottom: 1px solid rgba(148, 163, 184, 0.2);
    gap: 1.1rem;
    /* 为右上角浮动汉堡菜单按钮让出空间 */
    padding-right: clamp(3.75rem, 14vw, 5.5rem);
  }
  .info-pane h1 {
    font-size: clamp(1.75rem, 7vw, 2.75rem);
  }
  .info-pane__lede {
    font-size: 0.95rem;
    line-height: 1.7;
  }
  .info-pane__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.65rem;
  }
  .stat-card {
    padding: 0.85rem 0.75rem;
    border-radius: 0.9rem;
  }
  .stat-card strong {
    font-size: 1.35rem;
  }
  .stat-card span {
    font-size: 0.65rem;
    letter-spacing: 0.12em;
  }
  .interactive-pane {
    min-height: 420px;
    padding: 0;
  }
}

@media (max-width: 640px) {
  .home-shell {
    min-height: auto;
  }
  .info-pane {
    padding: 1.5rem 1rem 1.25rem;
    padding-right: clamp(3.75rem, 15vw, 5rem);
    gap: 1rem;
    min-height: auto;
  }
  .info-pane__eyebrow {
    font-size: 0.7rem;
    letter-spacing: 0.25em;
  }
  .info-pane__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
  }
  .stat-card {
    padding: 0.7rem 0.55rem;
    text-align: center;
  }
  .stat-card strong {
    font-size: 1.15rem;
    text-align: center;
  }
  .stat-card span {
    display: block;
    text-align: center;
    font-size: 0.6rem;
    letter-spacing: 0.1em;
  }
  .info-pane__actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.85rem;
  }
  .ghost-action {
    justify-content: center;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(148, 163, 184, 0.35);
    border-radius: 0.75rem;
  }
  .interactive-pane {
    min-height: 360px;
    padding: 0;
  }
}

@media (max-width: 380px) {
  .info-pane__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .stat-card strong {
    font-size: 1rem;
  }
  .interactive-pane {
    min-height: 320px;
  }
}
</style>
