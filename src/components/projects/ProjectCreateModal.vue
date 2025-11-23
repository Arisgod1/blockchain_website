<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div
      class="absolute inset-0 bg-black/50"
      @click="close"
    />
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg z-10 p-6">
      <h3 class="text-lg font-semibold mb-4">
        创建新项目
      </h3>

      <form @submit.prevent="submit">
        <div class="grid grid-cols-1 gap-3">
          <label class="flex flex-col">
            <span class="text-sm text-gray-700">项目标题</span>
            <input
              v-model="form.title"
              required
              class="mt-1 p-2 border rounded"
            >
          </label>

          <label class="flex flex-col">
            <span class="text-sm text-gray-700">简短描述</span>
            <input
              v-model="form.shortDescription"
              class="mt-1 p-2 border rounded"
            >
          </label>

          <label class="flex flex-col">
            <span class="text-sm text-gray-700">分类</span>
            <input
              v-model="form.category"
              class="mt-1 p-2 border rounded"
            >
          </label>

          <label class="flex flex-col">
            <span class="text-sm text-gray-700">状态</span>
            <select
              v-model="form.status"
              class="mt-1 p-2 border rounded"
            >
              <option value="planning">规划中</option>
              <option value="in-progress">开发中</option>
              <option value="completed">已完成</option>
              <option value="paused">已暂停</option>
            </select>
          </label>

          <label class="flex flex-col">
            <span class="text-sm text-gray-700">进度（%）</span>
            <input
              v-model.number="form.progress"
              type="number"
              min="0"
              max="100"
              class="mt-1 p-2 border rounded"
            >
          </label>
        </div>

        <div class="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded border"
            @click="close"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded bg-blue-600 text-white"
          >
            创建
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { Project, ProjectStatusValue } from '@/types/entities'
import { createProject } from '@/api/project'

const emit = defineEmits<{
  (e: 'created', project: Project): void
  (e: 'close'): void
}>()

const form = reactive<{ 
  title: string
  shortDescription: string
  category: string
  status: ProjectStatusValue
  progress: number
}>({
  title: '',
  shortDescription: '',
  category: '',
  status: 'planning',
  progress: 0
})

const close = () => emit('close')

const submit = async () => {
  try {
    const payload: Partial<Project> = {
      title: form.title,
      shortDescription: form.shortDescription,
      description: form.shortDescription,
      category: form.category,
  status: form.status,
      progress: form.progress,
      likes: 0,
      views: 0,
      isLiked: false
    }

    const created = await createProject(payload)
    emit('created', created)
    // reset
    form.title = ''
    form.shortDescription = ''
    form.category = ''
    form.status = 'planning'
    form.progress = 0
  } catch (err) {
    console.error('创建项目失败', err)
    const message = err instanceof Error ? err.message : '创建项目失败'
    alert(message)
  }
}
</script>

<style scoped>
/* 简单样式依赖 Tailwind，可按需调整 */
</style>
