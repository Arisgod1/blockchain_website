<template>
  <header
    class="public-graph-hero"
    :class="`tone-${tone}`"
  >
    <div class="graph-backdrop" aria-hidden="true">
      <svg
        class="graph-map"
        viewBox="0 0 1200 420"
        preserveAspectRatio="none"
      >
        <path
          v-for="edge in edges"
          :key="edge"
          :d="edge"
          class="graph-edge"
        />
        <circle
          v-for="node in nodes"
          :key="node.id"
          :cx="node.x"
          :cy="node.y"
          :r="node.r"
          class="graph-node"
        />
      </svg>
      <div class="graph-core" />
    </div>

    <div class="hero-inner graph-hero-inner">
      <div class="hero-copy">
        <span class="graph-kicker">{{ eyebrow }}</span>
        <h1 class="graph-title">
          {{ title }}
          <span v-if="accent">{{ accent }}</span>
        </h1>
        <p class="graph-subtitle">
          {{ subtitle }}
        </p>
      </div>

      <div
        v-if="stats.length"
        class="graph-stats"
        :aria-label="`${title} 数据概览`"
      >
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="graph-stat"
        >
          <span class="graph-stat__value">{{ stat.value }}</span>
          <span class="graph-stat__label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
export interface GraphHeroStat {
  label: string
  value: string | number
}

withDefaults(defineProps<{
  eyebrow: string
  title: string
  accent?: string
  subtitle: string
  stats?: GraphHeroStat[]
  tone?: 'cyan' | 'green' | 'amber' | 'rose' | 'violet' | 'blue'
}>(), {
  accent: '',
  stats: () => [],
  tone: 'cyan'
})

const edges = [
  'M28 330 C180 210 270 360 420 230 S680 110 820 230 S1030 380 1180 170',
  'M80 120 C250 260 360 80 530 150 S790 310 940 120 S1090 90 1200 260',
  'M0 260 C190 280 280 150 430 170 S640 290 790 180 S1030 110 1160 320'
]

const nodes = [
  { id: 'n1', x: 90, y: 118, r: 5 },
  { id: 'n2', x: 228, y: 246, r: 4 },
  { id: 'n3', x: 410, y: 230, r: 7 },
  { id: 'n4', x: 540, y: 150, r: 4 },
  { id: 'n5', x: 706, y: 286, r: 5 },
  { id: 'n6', x: 828, y: 228, r: 7 },
  { id: 'n7', x: 958, y: 124, r: 4 },
  { id: 'n8', x: 1100, y: 300, r: 5 }
]
</script>

<style scoped>
.public-graph-hero {
  --hero-accent: #67e8f9;
  --hero-accent-strong: #22d3ee;
  position: relative;
  overflow: hidden;
  min-height: clamp(320px, 42vw, 460px);
  display: flex;
  align-items: end;
  color: #f8fafc;
  background:
    radial-gradient(circle at 18% 18%, color-mix(in srgb, var(--hero-accent) 22%, transparent), transparent 32%),
    linear-gradient(135deg, #040712 0%, #0c1725 46%, #101827 100%);
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.tone-green {
  --hero-accent: #5eead4;
  --hero-accent-strong: #14b8a6;
}

.tone-amber {
  --hero-accent: #facc15;
  --hero-accent-strong: #d97706;
}

.tone-rose {
  --hero-accent: #fb7185;
  --hero-accent-strong: #e11d48;
}

.tone-violet {
  --hero-accent: #a78bfa;
  --hero-accent-strong: #7c3aed;
}

.tone-blue {
  --hero-accent: #93c5fd;
  --hero-accent-strong: #2563eb;
}

.graph-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.graph-map {
  position: absolute;
  inset: auto 0 0;
  width: 100%;
  height: 78%;
  opacity: 0.72;
}

.graph-edge {
  fill: none;
  stroke: color-mix(in srgb, var(--hero-accent) 52%, transparent);
  stroke-width: 1.4;
  stroke-dasharray: 8 16;
  animation: graphFlow 10s linear infinite;
}

.graph-node {
  fill: var(--hero-accent);
  filter: drop-shadow(0 0 10px color-mix(in srgb, var(--hero-accent) 70%, transparent));
}

.graph-core {
  position: absolute;
  right: clamp(1.5rem, 8vw, 8rem);
  bottom: clamp(2rem, 8vw, 5rem);
  width: clamp(140px, 22vw, 260px);
  aspect-ratio: 1;
  border-radius: 999px;
  background:
    radial-gradient(circle, color-mix(in srgb, var(--hero-accent) 44%, transparent) 0 18%, transparent 19%),
    conic-gradient(from 40deg, transparent, color-mix(in srgb, var(--hero-accent) 45%, transparent), transparent 35%, rgba(255,255,255,0.08), transparent 74%);
  opacity: 0.62;
  mask-image: radial-gradient(circle, transparent 0 36%, #000 37% 58%, transparent 59%);
  -webkit-mask-image: radial-gradient(circle, transparent 0 36%, #000 37% 58%, transparent 59%);
  animation: graphOrbit 18s linear infinite;
}

.graph-hero-inner {
  position: relative;
  z-index: 1;
  width: min(100%, 1440px);
  margin-inline: auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: end;
  padding-left: clamp(1rem, 4vw, 4rem);
  padding-right: clamp(1rem, 4vw, 4rem);
  padding-top: clamp(4rem, 9vw, 7rem);
  padding-bottom: clamp(2rem, 6vw, 4.5rem);
}

.hero-copy {
  max-width: 780px;
}

.graph-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: color-mix(in srgb, var(--hero-accent) 86%, #ffffff);
  font-size: 0.82rem;
  font-weight: 650;
}

.graph-kicker::before {
  content: '';
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  background: var(--hero-accent);
  box-shadow: 0 0 18px var(--hero-accent);
}

.graph-title {
  margin-top: 1rem;
  font-size: clamp(2.2rem, 6vw, 5.2rem);
  line-height: 1.03;
  font-weight: 750;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.graph-title span {
  display: block;
  color: var(--hero-accent);
}

.graph-subtitle {
  margin-top: 1.25rem;
  max-width: 62ch;
  color: rgba(226, 232, 240, 0.84);
  font-size: clamp(1rem, 2vw, 1.18rem);
  line-height: 1.85;
  text-wrap: pretty;
}

.graph-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.graph-stat {
  min-height: 88px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.16);
  background: rgba(8, 13, 24, 0.66);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.graph-stat__value {
  color: #ffffff;
  font-size: clamp(1.35rem, 3vw, 2.15rem);
  font-weight: 750;
  line-height: 1;
}

.graph-stat__label {
  margin-top: 0.5rem;
  color: rgba(203, 213, 225, 0.78);
  font-size: 0.82rem;
}

@keyframes graphFlow {
  to {
    stroke-dashoffset: -240;
  }
}

@keyframes graphOrbit {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .graph-hero-inner {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding-right: clamp(4.25rem, 12vw, 5.5rem);
  }

  .graph-stats {
    max-width: 520px;
  }
}

@media (max-width: 560px) {
  .public-graph-hero {
    min-height: 420px;
  }

  .graph-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .graph-stat {
    min-height: 74px;
    padding: 0.85rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .graph-edge,
  .graph-core {
    animation: none;
  }
}
</style>
