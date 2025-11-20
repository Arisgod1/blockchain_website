<template>
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    :width="size"
    :height="size"
  >
    <path d="M3 3v8h8V3H3zm0 10v8h8v-8H3zm10-10v8h8V3h-8zm0 10v8h8v-8h-8z" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
}
withDefaults(defineProps<Props>(), {
  size: 24
})
</script>