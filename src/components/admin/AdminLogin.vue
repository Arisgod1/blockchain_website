<template>
  <BaseModal 
    :model-value="show" 
    title="管理员登录" 
    size="sm"
    @update:model-value="$emit('update:show', $event)"
    @close="$emit('update:show', false)"
  >
    <form
      class="admin-login-form"
      @submit.prevent="handleLogin"
    >
      <div class="form-group">
        <label for="username">用户名</label>
        <BaseInput
          id="username"
          v-model="formData.username"
          type="text"
          placeholder="请输入管理员用户名"
          :error="errors.username"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="password">密码</label>
        <BaseInput
          id="password"
          v-model="formData.password"
          type="password"
          placeholder="请输入管理员密码"
          :error="errors.password"
          required
        />
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input 
            v-model="formData.rememberMe" 
            type="checkbox"
            class="checkbox-input"
          >
          <span class="checkbox-text">记住登录状态</span>
        </label>
      </div>

      <div
        v-if="loginError"
        class="error-message"
      >
        {{ loginError }}
      </div>
    </form>

    <template #footer>
      <BaseButton 
        variant="secondary" 
        @click="$emit('update:show', false)"
      >
        取消
      </BaseButton>
      <BaseButton 
        variant="primary"
        :loading="loading"
        :disabled="!isFormValid"
        @click="handleLogin"
      >
        {{ loading ? '登录中...' : '登录' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { BaseModal, BaseButton } from '@/components/common'
import { BaseInput } from '@/components/form'
import type { AdminUser } from '@/types/entities'
import { login as loginRequest } from '@/api/auth'

interface Props {
  show: boolean
}

interface FormData {
  username: string
  password: string
  rememberMe: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'login', user: AdminUser): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 设置页面元数据
useHead({
  title: '管理员登录 - 区块链组官方网站',
  meta: [
    { name: 'description', content: '区块链组官方网站管理员登录页面' }
  ]
})

// 响应式数据
const formData = ref<FormData>({
  username: '',
  password: '',
  rememberMe: false
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const loginError = ref('')

// 计算属性
const isFormValid = computed(() => {
  return formData.value.username.trim() !== '' && 
         formData.value.password.trim() !== ''
})

// 登录处理
const handleLogin = async () => {
  if (!isFormValid.value) {
    errors.value = {
      username: formData.value.username ? '' : '请输入用户名',
      password: formData.value.password ? '' : '请输入密码'
    }
    return
  }

  loading.value = true
  loginError.value = ''

  try {
    const { token, user } = await loginRequest({
      username: formData.value.username.trim(),
      password: formData.value.password
    })

    if (formData.value.rememberMe) {
      localStorage.setItem('adminToken', token)
      localStorage.setItem('admin-user', JSON.stringify(user))
    } else {
      sessionStorage.setItem('adminToken', token)
      sessionStorage.setItem('admin-user', JSON.stringify(user))
    }

    emit('login', {
      ...user,
      rememberMe: formData.value.rememberMe
    })
    emit('update:show', false)
    resetForm()
  } catch (error) {
    loginError.value = error instanceof Error ? error.message : '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    username: '',
    password: '',
    rememberMe: false
  }
  errors.value = {}
  loginError.value = ''
}

// 监听弹窗关闭，重置表单
watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<style scoped>
.admin-login-form {
  padding: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-of-type {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
}

.checkbox-input {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  cursor: pointer;
}

.checkbox-input:checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-text {
  user-select: none;
}

.error-message {
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 1rem;
}
</style>