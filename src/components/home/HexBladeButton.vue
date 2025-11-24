<template>
  <button
    ref="buttonRef"
    type="button"
    :class="[
      rootClass,
      disabled && 'is-disabled',
      isHovered && !disabled && 'is-hovered',
      isActive && !disabled && 'is-active'
    ]"
    :style="buttonStyle"
    :disabled="disabled"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
    @click="handleClick"
  >
    <span class="hex-blade__bg" />
    <span class="hex-blade__noise" />
    <span class="hex-blade__scan" />

    <svg
      class="hex-blade__border"
      viewBox="0 0 320 140"
      preserveAspectRatio="none"
    >
      <polygon
        points="36,0 284,0 320,70 284,140 36,140 0,70"
        stroke-linejoin="round"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
        fill="none"
      />
    </svg>

    <div class="hex-blade__content">
      <div
        v-if="icon"
        class="hex-blade__icon"
      >
        <slot name="icon">
          <span>{{ icon }}</span>
        </slot>
      </div>

      <div class="hex-blade__text">
        <span
          class="hex-blade__label"
          :data-text="label"
        >
          {{ label }}
        </span>
        <span
          v-if="subLabel"
          class="hex-blade__sublabel"
        >
          {{ subLabel }}
        </span>
      </div>
    </div>

    <div
      class="hex-blade__spikes"
      :class="showSpikes && 'is-visible'"
    >
      <span
        v-for="spike in spikes"
        :key="spike"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { twMerge } from 'tailwind-merge'

interface Props {
  label: string
  subLabel?: string
  icon?: string
  themeColor?: string
  disabled?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  themeColor: '#6EE7FF',
  disabled: false,
  subLabel: '',
  icon: '',
  className: ''
})

const emit = defineEmits<{ 
  (e: 'hover', event: MouseEvent): void
  (e: 'leave', event: MouseEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'press', event: PointerEvent): void
  (e: 'release', event: PointerEvent): void
  (e: 'click', event: MouseEvent): void
}>()

const buttonRef = ref<HTMLButtonElement | null>(null)
const isHovered = ref(false)
const isActive = ref(false)
const showSpikes = ref(false)
const spikes = Array.from({ length: 8 }, (_, idx) => idx)
let spikeTimer: number | null = null

const baseClass = 'hex-blade relative inline-flex select-none items-center justify-center px-8 py-5 font-semibold tracking-wider text-white transition-all duration-300'

const buttonStyle = computed(() => ({
  '--hb-theme': props.themeColor,
  '--hb-indigo': '22, 28, 45'
}))

const rootClass = computed(() => twMerge(baseClass, props.className ?? ''))

const resetSpike = () => {
  if (spikeTimer) {
    window.clearTimeout(spikeTimer)
    spikeTimer = null
  }
  showSpikes.value = false
}

const handleMouseEnter = (event: MouseEvent) => {
  if (props.disabled) return
  isHovered.value = true
  emit('hover', event)
}

const handleMouseLeave = (event: MouseEvent) => {
  if (props.disabled) return
  isHovered.value = false
  isActive.value = false
  emit('leave', event)
  resetSpike()
}

const handleFocus = (event: FocusEvent) => {
  if (props.disabled) return
  isHovered.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  if (props.disabled) return
  isHovered.value = false
  emit('blur', event)
}

const handlePointerDown = (event: PointerEvent) => {
  if (props.disabled) return
  isActive.value = true
  emit('press', event)
  showSpikes.value = true
  resetSpike()
  spikeTimer = window.setTimeout(() => {
    showSpikes.value = false
    spikeTimer = null
  }, 250)
}

const handlePointerUp = (event: PointerEvent) => {
  if (props.disabled) return
  isActive.value = false
  emit('release', event)
}

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

onBeforeUnmount(() => {
  resetSpike()
})
</script>

<style scoped>
.hex-blade {
  --hb-sheen: rgba(255, 255, 255, 0.25);
  --hb-border: #b4e1ff;
  --hb-glow: rgba(180, 225, 255, 0.45);
  --hb-notch: 11.25%;
  width: max-content;
  min-width: 220px;
  min-height: 64px;
  border: none;
  cursor: pointer;
  clip-path: polygon(var(--hb-notch) 0%, calc(100% - var(--hb-notch)) 0%, 100% 50%, calc(100% - var(--hb-notch)) 100%, var(--hb-notch) 100%, 0% 50%);
  background: transparent;
  padding: 0;
  font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  letter-spacing: 0.08em;
}

.hex-blade:focus-visible {
  outline: 2px solid var(--hb-theme);
  outline-offset: 4px;
}

.hex-blade.is-disabled {
  cursor: not-allowed;
  filter: grayscale(0.8);
  opacity: 0.65;
}

.hex-blade__bg,
.hex-blade__noise,
.hex-blade__scan,
.hex-blade__border,
.hex-blade__spikes {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: 0;
  clip-path: inherit;
}

.hex-blade__bg {
  background: rgba(var(--hb-indigo), 0.15);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.hex-blade.is-hovered .hex-blade__bg {
  background: rgba(var(--hb-indigo), 0.35);
  border-color: rgba(255, 255, 255, 0.3);
}

.hex-blade.is-active .hex-blade__bg {
  background: rgba(0, 0, 0, 0.5);
  border-color: var(--hb-theme);
  box-shadow: inset 0 0 24px var(--hb-glow);
}

.hex-blade__noise {
  mix-blend-mode: screen;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.hex-blade.is-hovered .hex-blade__noise {
  opacity: 0;
}

.hex-blade__scan {
  background-image: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 45%,
    rgba(255, 255, 255, 0.35) 50%,
    rgba(255, 255, 255, 0.15) 55%,
    transparent 100%
  );
  background-size: 400% 400%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hex-blade.is-hovered .hex-blade__scan {
  opacity: 1;
  animation: scanShift 2.5s linear infinite;
}


@keyframes scanShift {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 200%;
  }
}

.hex-blade__border {
  stroke: var(--hb-border);
  stroke-width: 2;
  opacity: 0.6;
  filter: drop-shadow(0 0 8px rgba(180, 225, 255, 0.45));
  transition: stroke 0.3s ease, opacity 0.3s ease;
}

.hex-blade.is-hovered .hex-blade__border {
  opacity: 1;
  stroke: var(--hb-theme);
  animation: borderFlow 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes borderFlow {
  from {
    stroke-dasharray: 0 600;
    stroke-dashoffset: 600;
  }
  to {
    stroke-dasharray: 600 0;
    stroke-dashoffset: 0;
  }
}

.hex-blade.is-active .hex-blade__border {
  filter: drop-shadow(0 0 14px var(--hb-theme));
}

.hex-blade__content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 40px;
  z-index: 2;
}

.hex-blade__icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.25s ease;
}

.hex-blade.is-hovered .hex-blade__icon {
  transform: translateY(-2px);
}

.hex-blade.is-active .hex-blade__icon {
  transform: rotateY(180deg) scale(1.05);
}

.hex-blade__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.hex-blade__label {
  font-size: 1rem;
  text-transform: uppercase;
  position: relative;
  display: inline-flex;
  color: #f8fafc;
  transition: transform 0.25s ease;
}

.hex-blade__label::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  color: rgba(255, 255, 255, 0.2);
  transform: translateY(4px);
  filter: blur(2px);
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.hex-blade.is-hovered .hex-blade__label {
  transform: translateY(-2px);
}

.hex-blade.is-hovered .hex-blade__label::after {
  opacity: 0.4;
}

.hex-blade.is-active .hex-blade__label {
  transform: scale(1.1);
}

.hex-blade__sublabel {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.8);
}

.hex-blade__spikes {
  display: grid;
  place-items: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.hex-blade__spikes span {
  position: absolute;
  width: 2px;
  height: 20px;
  background: var(--hb-theme);
  transform-origin: center 120%;
  opacity: 0.9;
  border-radius: 999px;
}

.hex-blade__spikes.is-visible {
  opacity: 1;
}

.hex-blade__spikes.is-visible span {
  animation: spikeBlast 0.25s ease-out forwards;
}

.hex-blade__spikes span:nth-child(1) { transform: rotate(0deg); }
.hex-blade__spikes span:nth-child(2) { transform: rotate(45deg); }
.hex-blade__spikes span:nth-child(3) { transform: rotate(90deg); }
.hex-blade__spikes span:nth-child(4) { transform: rotate(135deg); }
.hex-blade__spikes span:nth-child(5) { transform: rotate(180deg); }
.hex-blade__spikes span:nth-child(6) { transform: rotate(225deg); }
.hex-blade__spikes span:nth-child(7) { transform: rotate(270deg); }
.hex-blade__spikes span:nth-child(8) { transform: rotate(315deg); }

@keyframes spikeBlast {
  0% {
    transform: scaleY(0.2) translateY(0);
    opacity: 1;
  }
  100% {
    transform: scaleY(1) translateY(-12px);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .hex-blade__content {
    padding: 16px 24px;
  }
  .hex-blade__label {
    font-size: 0.9rem;
  }
}
</style>
