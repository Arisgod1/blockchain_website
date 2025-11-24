<template>
  <div
    ref="fieldRef"
    class="orbital-field relative w-full h-full overflow-hidden"
  >
    <div
      class="orbital-field__content"
      :style="contentStyle"
    >
      <div class="orbital-field__aurora" />

      <div
        class="orbital-field__core"
        :class="coreBoosted && 'is-reactive'"
      >
        <div class="core__halo" />
        <div class="core__ring" />
        <div class="core__seed" />
        <transition
          name="core-pulse"
          mode="out-in"
        >
          <div
            v-if="pulseVisible"
            :key="corePulseKey"
            class="core__shockwave"
          />
        </transition>
      </div>

      <svg
        v-if="linkLine.visible"
        class="orbital-field__link"
        :viewBox="`0 0 ${fieldSize.width} ${fieldSize.height}`"
      >
        <line
          :x1="linkLine.start.x"
          :y1="linkLine.start.y"
          :x2="linkLine.end.x"
          :y2="linkLine.end.y"
        />
      </svg>

      <div
        v-for="(orbit, index) in orbitStyles"
        :key="orbit.id"
        class="orbit-ring"
        :style="orbit.style"
      >
        <span
          v-for="(angle, asteroidIndex) in asteroidAngles[index]"
          :key="`${orbit.id}-asteroid-${asteroidIndex}`"
          class="orbit-asteroid"
          :class="{
            'is-active': activeAsteroid.orbit === index && activeAsteroid.index === asteroidIndex
          }"
          :style="{
            '--asteroid-angle': `${angle}deg`
          }"
        />
      </div>

      <div
        v-for="item in positionedItems"
        :key="item.id"
        :ref="(el) => setButtonRef(item.id, el as HTMLElement | null)"
        class="orbit-item"
        :style="{
          left: `${item.position.x}px`,
          top: `${item.position.y}px`
        }"
      >
        <HexBladeButton
          :label="item.title"
          :sub-label="item.subtitle"
          :icon="item.icon"
          :theme-color="item.themeColor"
          @hover="(event) => handleHover(item, event)"
          @leave="(event) => handleLeave(item, event)"
          @focus="() => handleHover(item)"
          @blur="() => handleLeave(item)"
          @click="() => handleClick(item)"
        />
        <p class="orbit-item__desc">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useElementSize } from '@vueuse/core'
import { useSpring, type MotionProperties, type PermissiveMotionProperties, type SpringControls } from '@vueuse/motion'
import HexBladeButton from './HexBladeButton.vue'

export interface OrbitNavItem {
  id: string
  title: string
  subtitle: string
  description?: string
  icon?: string
  route: string
  themeColor: string
  orbit?: number
  angle: number
}

type PositionedItem = OrbitNavItem & {
  orbitIndex: number
  position: { x: number; y: number }
}

interface MotionValueLike<T = number> {
  get: () => T
}

const props = defineProps<{ items: OrbitNavItem[] }>()

const router = useRouter()
const fieldRef = ref<HTMLElement | null>(null)
const { width, height } = useElementSize(fieldRef, { width: 720, height: 720 })

const fieldSize = computed(() => ({
  width: width.value || 720,
  height: height.value || 720
}))

const referenceSize = 680

const MIN_LAYOUT_SCALE = 0.45

const layoutScale = computed(() => {
  const minSide = Math.min(fieldSize.value.width, fieldSize.value.height)
  if (!Number.isFinite(minSide) || minSide <= 0) return 1
  const normalized = minSide / referenceSize
  return Math.min(1, Math.max(MIN_LAYOUT_SCALE, normalized))
})

const contentStyle = computed(() => ({
  transform: `translate(-50%, -50%) scale(${layoutScale.value})`
}))

const center = computed(() => ({
  x: fieldSize.value.width / 2,
  y: fieldSize.value.height / 2
}))

const orbitConfig = [
  { id: 'inner', radius: 190, accent: 'rgba(99,102,241,0.35)', asteroidCount: 8 },
  { id: 'outer', radius: 280, accent: 'rgba(56,189,248,0.25)', asteroidCount: 10 }
] as const

const springOptions = {
  stiffness: 300,
  damping: 20,
  mass: 1
}

const scaledDiameters = computed(() => orbitConfig.map((orbit) => orbit.radius * 2))

const orbitSprings = orbitConfig.map((_orbit, index) =>
  useSpring({ width: scaledDiameters.value[index] } as Partial<PermissiveMotionProperties>, springOptions)
)

const applyOrbitWidth = (index: number, multiplier = 1) => {
  const base = scaledDiameters.value[index] ?? orbitConfig[index].radius * 2
  orbitSprings[index].set({ width: base * multiplier } as MotionProperties)
}

const readSpringWidth = (controls: SpringControls, fallback: number) => {
  const record = controls.values as Record<string, unknown>
  const widthSource = record.width
  if (typeof widthSource === 'number') {
    return widthSource
  }
  if (widthSource && typeof widthSource === 'object' && 'get' in widthSource) {
    return (widthSource as MotionValueLike<number>).get()
  }
  return fallback
}

const getOrbitDiameter = (index: number) => {
  const base = orbitConfig[index].radius * 2
  return readSpringWidth(orbitSprings[index], base)
}

const getOrbitRadius = (index: number) => getOrbitDiameter(index) / 2

const orbitStyles = computed(() => orbitConfig.map((orbit, index) => {
  const radius = getOrbitRadius(index)
  const diameter = radius * 2
  return {
    id: orbit.id,
    style: {
      width: `${diameter}px`,
      height: `${diameter}px`,
      marginLeft: `-${radius}px`,
      marginTop: `-${radius}px`,
      borderColor: orbit.accent,
      '--orbit-diameter': `${diameter}px`
    }
  }
}))

const asteroidAngles = orbitConfig.map((orbit) => (
  Array.from({ length: orbit.asteroidCount }, (_, idx) => Math.round((idx / orbit.asteroidCount) * 360))
))

const hoveredItemId = ref<string | null>(null)
const activeOrbitIndex = ref<number | null>(null)
const buttonRefs = new Map<string, HTMLElement>()
const linkLine = reactive({
  visible: false,
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 }
})

const coreBoosted = ref(false)
const corePulseKey = ref(0)
const pulseVisible = ref(false)
const activeAsteroid = reactive({ orbit: -1, index: -1, token: 0 })

const positionedItems = computed<PositionedItem[]>(() => {
  return props.items.map((item) => {
    const orbitIndex = item.orbit ?? 0
    const radius = getOrbitRadius(orbitIndex)
    const angle = (item.angle - 90) * (Math.PI / 180)
    const x = center.value.x + Math.cos(angle) * radius
    const y = center.value.y + Math.sin(angle) * radius
    return {
      ...item,
      orbitIndex,
      position: { x, y }
    }
  })
})


function setButtonRef(id: string, el: HTMLElement | null) {
  if (!el) {
    buttonRefs.delete(id)
    return
  }
  buttonRefs.set(id, el)
}

function updateLinkPosition(id: string) {
  const btn = buttonRefs.get(id)
  const field = fieldRef.value
  if (!btn || !field) return

  const fieldRect = field.getBoundingClientRect()
  const btnRect = btn.getBoundingClientRect()

  linkLine.start.x = fieldRect.width / 2
  linkLine.start.y = fieldRect.height / 2
  linkLine.end.x = btnRect.left - fieldRect.left + btnRect.width / 2
  linkLine.end.y = btnRect.top - fieldRect.top + btnRect.height / 2
  linkLine.visible = true
}

function resetLink() {
  linkLine.visible = false
}

function stretchOrbit(orbitIndex: number) {
  applyOrbitWidth(orbitIndex, 1.08)
}

function relaxOrbit(orbitIndex: number) {
  applyOrbitWidth(orbitIndex)
}

function handleHover(item: PositionedItem, _event?: MouseEvent) {
  if (hoveredItemId.value !== item.id) {
    hoveredItemId.value = item.id
    coreBoosted.value = true
  }
  activeOrbitIndex.value = item.orbitIndex
  stretchOrbit(item.orbitIndex)
  updateLinkPosition(item.id)
}

function handleLeave(item: PositionedItem, _event?: MouseEvent) {
  if (hoveredItemId.value === item.id) {
    hoveredItemId.value = null
    coreBoosted.value = false
    resetLink()
  }
  if (activeOrbitIndex.value === item.orbitIndex) {
    activeOrbitIndex.value = null
  }
  relaxOrbit(item.orbitIndex)
}

function triggerAsteroid(orbitIndex: number, angle: number) {
  const angles = asteroidAngles[orbitIndex]
  const closestIndex = angles.reduce((closest, currentAngle, currentIndex) => {
    const bestDiff = Math.abs(angles[closest] - angle)
    const currentDiff = Math.abs(currentAngle - angle)
    return currentDiff < bestDiff ? currentIndex : closest
  }, 0)

  activeAsteroid.orbit = orbitIndex
  activeAsteroid.index = closestIndex
  activeAsteroid.token++

  window.setTimeout(() => {
    activeAsteroid.orbit = -1
    activeAsteroid.index = -1
  }, 400)
}

function triggerPulse() {
  pulseVisible.value = false
  const nextKey = Date.now()
  window.requestAnimationFrame(() => {
    corePulseKey.value = nextKey
    pulseVisible.value = true
    window.setTimeout(() => {
      pulseVisible.value = false
    }, 350)
  })
}

async function handleClick(item: PositionedItem) {
  triggerPulse()
  triggerAsteroid(item.orbitIndex, item.angle)
  try {
    await router.push(item.route)
  } catch (error) {
    console.error('导航失败', error)
  }
}

watch([() => fieldSize.value.width, () => fieldSize.value.height], () => {
  if (hoveredItemId.value) {
    updateLinkPosition(hoveredItemId.value)
  }
})

watch([scaledDiameters, activeOrbitIndex], () => {
  scaledDiameters.value.forEach((_diameter, index) => {
    const multiplier = activeOrbitIndex.value === index ? 1.08 : 1
    applyOrbitWidth(index, multiplier)
  })
})
</script>

<style scoped>
.orbital-field {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 20%, rgba(56, 189, 248, 0.15), transparent 55%),
    radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.2), transparent 50%),
    #050508;
  min-height: 560px;
}

.orbital-field__content {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform-origin: center;
}

.orbital-field__aurora {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.2), transparent 60%);
  filter: blur(80px);
  opacity: 0.6;
}

.orbital-field__core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120px;
  height: 120px;
  margin-left: -60px;
  margin-top: -60px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  z-index: 10;
}

.core__halo {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05), transparent 70%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  animation: haloSpin 18s linear infinite;
}

.core__ring {
  position: absolute;
  width: 110px;
  height: 110px;
  border-radius: 999px;
  border: 2px dashed rgba(125, 211, 252, 0.6);
  animation: ringRotate 8s linear infinite;
}

.core__seed {
  position: absolute;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.9), rgba(15, 23, 42, 0.9));
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.8);
  animation: coreBreath 3s ease-in-out infinite;
}

.core__shockwave {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 1px solid rgba(125, 211, 252, 0.6);
  animation: shockwave 0.5s ease-out forwards;
}

.core-pulse-enter-active {
  animation: shockwave 0.5s ease-out forwards;
}

.orbital-field__core.is-reactive .core__ring {
  animation-duration: 4s;
}

.orbital-field__core.is-reactive .core__halo {
  animation-duration: 9s;
}

@keyframes haloSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes ringRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

@keyframes coreBreath {
  0%, 100% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes shockwave {
  0% {
    transform: scale(0.9);
    opacity: 0.9;
  }
  100% {
    transform: scale(3.2);
    opacity: 0;
  }
}

.orbital-field__link {
  position: absolute;
  inset: 0;
  z-index: 5;
}

.orbital-field__link line {
  stroke: rgba(224, 242, 254, 0.65);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 1 12;
  animation: dataFlow 1.2s linear infinite;
}

@keyframes dataFlow {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 240;
  }
}

.orbit-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  transition: border 0.3s ease;
  pointer-events: none;
}

.orbit-asteroid {
  position: absolute;
  left: calc(50% - 4px);
  top: calc(50% - 4px);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(226, 232, 240, 0.35);
  transform-origin: 4px calc(var(--orbit-diameter) / 2);
  transform: rotate(var(--asteroid-angle)) translateY(calc(-1 * var(--orbit-diameter) / 2)) rotate(calc(-1 * var(--asteroid-angle)));
  transition: background 0.2s ease, transform 0.2s ease;
}

.orbit-asteroid.is-active {
  background: rgba(59, 130, 246, 0.95);
  transform: rotate(var(--asteroid-angle)) translateY(calc(-1 * var(--orbit-diameter) / 2 - 20px)) rotate(calc(-1 * var(--asteroid-angle)));
}

.orbit-item {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 15;
}

.orbit-item__desc {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(226, 232, 240, 0.7);
}

@media (max-width: 1024px) {
  .orbital-field {
    min-height: 480px;
  }
}

@media (max-width: 768px) {
  .orbital-field {
    min-height: clamp(420px, 90vw, 520px);
    padding: 1.5rem 0;
  }
}
</style>
