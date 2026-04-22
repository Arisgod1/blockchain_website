<template>
  <div class="resume-apply-page min-h-screen bg-slate-50 text-slate-800">
    <header class="gradient-hero flowing-gradient-cosmic hero-header">
      <div class="hero-inner">
        <span class="hero-eyebrow">DUT BLOCKCHAIN RECRUITMENT</span>
        <h1 class="hero-title">
          简历投递
        </h1>
        <p class="hero-subtitle">
          欢迎加入大连理工大学区块链组。请完整填写基础信息并提交表单，我们会尽快完成审核并与你联系。
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="grid gap-8 lg:grid-cols-[1fr_320px]">
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.08)] sm:p-8">
          <form
            ref="resumeFormRef"
            class="space-y-6"
            @submit.prevent="handleSubmit"
          >
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="block text-sm text-slate-700">姓名 *</label>
                <input
                  v-model.trim="form.name"
                  name="name"
                  type="text"
                  required
                  class="field-input"
                  placeholder="请输入姓名"
                >
              </div>
              <div class="space-y-2">
                <label class="block text-sm text-slate-700">学号 *</label>
                <input
                  v-model.trim="form.studentId"
                  name="student_id"
                  type="text"
                  required
                  class="field-input"
                  placeholder="请输入学号"
                >
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm text-slate-700">联系方式 *</label>
              <input
                v-model.trim="form.contact"
                name="contact"
                type="text"
                required
                class="field-input"
                placeholder="手机号 / 微信 / 邮箱"
              >
            </div>

            <div class="space-y-2">
              <label class="block text-sm text-slate-700">邮箱 *</label>
              <input
                v-model.trim="form.email"
                name="email"
                type="email"
                required
                class="field-input"
                placeholder="请输入常用邮箱"
              >
            </div>

            <div class="space-y-2">
              <label class="block text-sm text-slate-700">技术栈 *</label>
              <textarea
                v-model.trim="form.techStack"
                name="tech_stack"
                required
                rows="3"
                class="field-input field-textarea"
                placeholder="例如：Java、TypeScript、Vue、Spring Boot、MySQL..."
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm text-slate-700">项目经历 *</label>
              <textarea
                v-model.trim="form.projectExperience"
                name="project_experience"
                required
                rows="5"
                class="field-input field-textarea"
                placeholder="请描述主要项目、承担角色与产出"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm text-slate-700">在校经历 *</label>
              <textarea
                v-model.trim="form.campusExperience"
                name="campus_experience"
                required
                rows="4"
                class="field-input field-textarea"
                placeholder="请描述科研、竞赛、社团或其他在校经历"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm text-slate-700">补充说明</label>
              <textarea
                v-model.trim="form.extraNote"
                name="extra_note"
                rows="3"
                class="field-input field-textarea"
                placeholder="可填写可投入时间、期望方向等信息"
              />
            </div>

            <input type="hidden" name="submitted_at" :value="new Date().toLocaleString('zh-CN')">

            <p v-if="errorMessage" class="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {{ errorMessage }}
            </p>

            <p v-if="successMessage" class="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {{ successMessage }}
            </p>

            <BaseButton
              type="submit"
              size="lg"
              :loading="isSubmitting"
              :disabled="isSubmitting"
              text="提交简历"
              class="submit-btn"
            />
          </form>
        </article>

        <aside class="space-y-6">
          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
            <h2 class="text-lg font-semibold text-slate-900">
              填写提示
            </h2>
            <ul class="mt-4 space-y-2 text-sm leading-6 text-slate-600">
              <li>请确保联系方式长期可用。</li>
              <li>技术栈建议按熟练度从高到低填写。</li>
              <li>项目经历请突出你的职责和成果。</li>
              <li>提交后会自动发送到指定邮箱，请核对信息准确性。</li>
            </ul>
          </section>
        </aside>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import emailjs from '@emailjs/browser'
import BaseButton from '@/components/common/BaseButton.vue'
import type { ResumeApplicationPayload } from '@/types/entities'

const DAILY_SUBMIT_LIMIT = 3
const RESUME_SUBMIT_LIMIT_KEY = 'resume-apply-submit-limit'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim()
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim()
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim()

const form = ref<ResumeApplicationPayload>({
  name: '',
  studentId: '',
  contact: '',
  email: '',
  techStack: '',
  projectExperience: '',
  campusExperience: '',
  extraNote: ''
})

const resumeFormRef = ref<HTMLFormElement | null>(null)
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

interface SubmitLimitState {
  date: string
  count: number
}

const getTodayKey = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const readSubmitLimitState = (): SubmitLimitState => {
  const today = getTodayKey()

  try {
    const raw = localStorage.getItem(RESUME_SUBMIT_LIMIT_KEY)
    if (!raw) {
      return { date: today, count: 0 }
    }

    const parsed = JSON.parse(raw) as Partial<SubmitLimitState>
    if (parsed.date !== today) {
      return { date: today, count: 0 }
    }

    const safeCount = Number.isFinite(parsed.count) ? Number(parsed.count) : 0
    return { date: today, count: Math.max(0, safeCount) }
  } catch {
    return { date: today, count: 0 }
  }
}

const saveSubmitLimitState = (state: SubmitLimitState) => {
  localStorage.setItem(RESUME_SUBMIT_LIMIT_KEY, JSON.stringify(state))
}

const isDailyLimitReached = (): boolean => {
  const state = readSubmitLimitState()
  return state.count >= DAILY_SUBMIT_LIMIT
}

const increaseTodaySubmitCount = () => {
  const state = readSubmitLimitState()
  saveSubmitLimitState({
    date: state.date,
    count: state.count + 1
  })
}

const validateBeforeSubmit = () => {
  if (!form.value.name || !form.value.studentId || !form.value.contact || !form.value.email) {
    errorMessage.value = '请先完整填写姓名、学号、联系方式和邮箱。'
    return false
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)
  if (!isValidEmail) {
    errorMessage.value = '请输入有效的邮箱地址。'
    return false
  }

  if (!form.value.techStack || !form.value.projectExperience || !form.value.campusExperience) {
    errorMessage.value = '请补充技术栈、项目经历和在校经历。'
    return false
  }

  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    errorMessage.value = '邮件服务未配置，请联系管理员设置 EmailJS 参数。'
    return false
  }

  if (isDailyLimitReached()) {
    errorMessage.value = '今日提交次数已达上限（3次），请明天再试。'
    return false
  }

  return true
}

const resetForm = () => {
  form.value = {
    name: '',
    studentId: '',
    contact: '',
    email: '',
    techStack: '',
    projectExperience: '',
    campusExperience: '',
    extraNote: ''
  }
}

const handleSubmit = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!validateBeforeSubmit()) {
    return
  }

  isSubmitting.value = true

  try {
    if (!resumeFormRef.value) {
      throw new Error('表单实例未就绪')
    }

    await emailjs.sendForm(EMAILJS_SERVICE_ID as string, EMAILJS_TEMPLATE_ID as string, resumeFormRef.value, {
      publicKey: EMAILJS_PUBLIC_KEY as string
    })
    increaseTodaySubmitCount()
    successMessage.value = '投递成功，邮件已发送。'
    resetForm()
  } catch (error) {
    console.error('简历投递失败:', error)
    errorMessage.value = '提交失败，请稍后重试或联系管理员。'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.field-input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgb(203, 213, 225);
  background: rgb(255, 255, 255);
  padding: 0.72rem 0.95rem;
  color: rgb(15, 23, 42);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-input::placeholder {
  color: rgb(148, 163, 184);
}

.field-input:focus {
  border-color: rgb(59, 130, 246);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.14);
}

.field-file {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgb(203, 213, 225);
  background: rgb(255, 255, 255);
  color: rgb(51, 65, 85);
  padding: 0.55rem 0.8rem;
}

.field-textarea {
  min-height: 7rem;
  resize: vertical;
}

.submit-btn {
  width: 100%;
}

@media (max-width: 640px) {
  .field-input,
  .field-file {
    font-size: 0.95rem;
  }
}
</style>
