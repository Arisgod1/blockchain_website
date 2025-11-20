<template>
  <div
    class="base-avatar"
    :class="avatarClasses"
    :style="avatarStyle"
  >
    <img
      v-if="showImage"
      :src="src"
      :alt="alt || fallbackText"
      class="avatar-image"
      @error="handleError"
    >
    <div
      v-else
      class="avatar-fallback"
      :style="fallbackStyle"
    >
      <span>{{ initials }}</span>
    </div>
    <slot name="badge" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  src?: string
  alt?: string
  size?: number | string
  rounded?: boolean
  ring?: boolean
  fallbackText?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  size: 80,
  rounded: true,
  ring: false,
  fallbackText: ''
})

const hasError = ref(false)

const sizeValue = computed(() => {
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }
  return props.size
})

const showImage = computed(() => Boolean(props.src) && !hasError.value)

const initials = computed(() => {
  const source = props.fallbackText || props.alt || ''
  if (!source.trim()) return '成员'
  const parts = source.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[1][0]).toUpperCase()
})

const avatarStyle = computed(() => ({
  width: sizeValue.value,
  height: sizeValue.value
}))

const avatarClasses = computed(() => ({
  'is-rounded': props.rounded,
  'has-ring': props.ring
}))

const fallbackStyle = computed(() => {
  const seed = (props.fallbackText || props.alt || 'Member').charCodeAt(0) || 65
  const primaryHue = (seed * 13) % 360
  const secondaryHue = (primaryHue + 40) % 360

  return {
    background: `linear-gradient(135deg, hsl(${primaryHue}, 70%, 55%), hsl(${secondaryHue}, 70%, 60%))`
  }
})

const handleError = () => {
  hasError.value = true
}
</script>

<style scoped>
.base-avatar {
  @apply relative flex items-center justify-center overflow-hidden bg-gray-100 text-white font-semibold uppercase shadow-sm;
}

.base-avatar.is-rounded {
  @apply rounded-full;
}

.base-avatar:not(.is-rounded) {
  @apply rounded-xl;
}

.base-avatar.has-ring {
  @apply ring-4 ring-white ring-offset-2 ring-offset-blue-100;
}

.avatar-image {
  @apply w-full h-full object-cover;
}

.avatar-fallback {
  @apply w-full h-full flex items-center justify-center text-lg tracking-wide;
}

.avatar-fallback span {
  @apply drop-shadow;
}
</style>
