<template>
  <BaseModal 
    :show="show"
    :title="isCreate ? '添加新成员' : '编辑成员信息'"
    size="lg"
    @close="$emit('close')"
  >
    <form
      id="member-edit-form"
      class="member-edit-form"
      @submit.prevent="handleSubmit"
    >
      <div class="form-content">
        <!-- 基本信息 -->
        <div class="form-section">
          <h3 class="section-title">
            基本信息
          </h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="name">姓名 <span class="required">*</span></label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-input"
                placeholder="请输入成员姓名"
                required
              >
              <span
                v-if="errors.name"
                class="error-message"
              >{{ errors.name }}</span>
            </div>
            
            <div class="form-group">
              <label for="role">职位 <span class="required">*</span></label>
              <input
                id="role"
                v-model="form.role"
                type="text"
                class="form-input"
                placeholder="请输入职位"
                required
              >
              <span
                v-if="errors.role"
                class="error-message"
              >{{ errors.role }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="grade">年级</label>
              <select
                id="grade"
                v-model="form.grade"
                class="form-input"
              >
                <option value="">
                  请选择年级
                </option>
                <option value="大一">
                  大一
                </option>
                <option value="大二">
                  大二
                </option>
                <option value="大三">
                  大三
                </option>
                <option value="大四">
                  大四
                </option>
                <option value="研一">
                  研一
                </option>
                <option value="研二">
                  研二
                </option>
                <option value="研三">
                  研三
                </option>
                <option value="博士">
                  博士
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="email">邮箱 <span class="required">*</span></label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="请输入邮箱地址"
                required
              >
              <span
                v-if="errors.email"
                class="error-message"
              >{{ errors.email }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="joinDate">加入时间 <span class="required">*</span></label>
              <input
                id="joinDate"
                v-model="form.joinDate"
                type="date"
                class="form-input"
                required
              >
              <span
                v-if="errors.joinDate"
                class="error-message"
              >{{ errors.joinDate }}</span>
            </div>
            
            <div class="form-group">
              <label for="status">状态</label>
              <select
                id="status"
                v-model="form.isActive"
                class="form-input"
              >
                <option :value="true">
                  活跃
                </option>
                <option :value="false">
                  非活跃
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="avatar">头像链接</label>
            <input
              id="avatar"
              v-model="form.avatar"
              type="url"
              class="form-input"
              placeholder="请输入头像图片链接"
            >
            <span
              v-if="errors.avatar"
              class="error-message"
            >{{ errors.avatar }}</span>
          </div>

          <div class="form-group">
            <label for="bio">个人简介</label>
            <textarea
              id="bio"
              v-model="form.bio"
              class="form-textarea"
              rows="3"
              placeholder="请输入个人简介（可选）"
            />
          </div>
        </div>

        <!-- 技能 -->
        <div class="form-section">
          <h3 class="section-title">
            技能特长
          </h3>
          <div class="form-group">
            <label>技能列表 <span class="required">*</span></label>
            <div class="skills-input-container">
              <input
                v-model="newSkill"
                type="text"
                class="form-input"
                placeholder="输入技能后按回车添加"
                @keydown.enter.prevent="addSkill"
              >
              <button
                type="button"
                class="add-skill-btn"
                :disabled="!newSkill.trim()"
                @click="addSkill"
              >
                添加
              </button>
            </div>
            
            <div
              v-if="form.skills && form.skills.length > 0"
              class="skills-list"
            >
              <div 
                v-for="(skill, index) in form.skills" 
                :key="index"
                class="skill-tag editable"
              >
                {{ skill }}
                <button
                  type="button"
                  class="remove-skill-btn"
                  @click="removeSkill(index)"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div
              v-else
              class="empty-skills"
            >
              暂无技能，点击上方输入框添加技能
            </div>
            <span
              v-if="errors.skills"
              class="error-message"
            >{{ errors.skills }}</span>
          </div>
        </div>

        <!-- 社交链接 -->
        <div class="form-section">
          <h3 class="section-title">
            社交链接
          </h3>
          
          <div class="form-group">
            <label for="github">GitHub 链接</label>
            <input
              id="github"
              v-model="form.github"
              type="url"
              class="form-input"
              placeholder="https://github.com/username"
            >
          </div>
          
          <div class="form-group">
            <label for="linkedin">LinkedIn 链接</label>
            <input
              id="linkedin"
              v-model="form.linkedin"
              type="url"
              class="form-input"
              placeholder="https://linkedin.com/in/username"
            >
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <BaseButton 
        type="button"
        variant="secondary" 
        @click="$emit('close')"
      >
        取消
      </BaseButton>
      <BaseButton 
        type="submit"
        form="member-edit-form"
        variant="primary"
        :loading="saving"
      >
        {{ isCreate ? '创建' : '保存' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { BaseModal, BaseButton } from '@/components/common'
import type { Member } from '@/types/entities'

interface Props {
  show: boolean
  member: Member | null
  isCreate: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', member: Member): void
  (e: 'update:show', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表单数据
const form = ref<Partial<Member>>({
  id: '',
  name: '',
  role: '',
  avatar: '',
  bio: '',
  skills: [],
  grade: '',
  email: '',
  github: '',
  linkedin: '',
  joinDate: '',
  isActive: true
})

const newSkill = ref('')
const saving = ref(false)
const errors = ref<Record<string, string>>({})

// 监听成员数据变化，初始化表单
watch(() => props.member, (newMember) => {
  if (newMember) {
    form.value = { ...newMember }
  } else {
    resetForm()
  }
}, { immediate: true })

// 双向绑定
const show = computed({
  get: () => props.show,
  set: (value: boolean) => emit('update:show', value)
})

// 方法
const resetForm = () => {
  form.value = {
    id: '',
    name: '',
    role: '',
    avatar: '',
    bio: '',
    skills: [],
    grade: '',
    email: '',
    github: '',
    linkedin: '',
    joinDate: '',
    isActive: true
  }
  newSkill.value = ''
  errors.value = {}
}

const addSkill = () => {
  if (!newSkill.value.trim()) return
  
  const skill = newSkill.value.trim()
  if (!form.value.skills!.includes(skill)) {
    form.value.skills!.push(skill)
    newSkill.value = ''
    delete errors.value.skills
  }
}

const removeSkill = (index: number) => {
  form.value.skills!.splice(index, 1)
}

const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.name?.trim()) {
    errors.value.name = '请输入成员姓名'
  }
  
  if (!form.value.role?.trim()) {
    errors.value.role = '请输入职位'
  }
  
  if (!form.value.email?.trim()) {
    errors.value.email = '请输入邮箱地址'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = '请输入有效的邮箱地址'
  }
  
  if (!form.value.joinDate) {
    errors.value.joinDate = '请选择加入时间'
  }
  
  if (!form.value.skills || form.value.skills.length === 0) {
    errors.value.skills = '请至少添加一个技能'
  }
  
  if (form.value.avatar && !/^https?:\/\/.+/.test(form.value.avatar)) {
    errors.value.avatar = '请输入有效的图片链接'
  }
  
  if (form.value.github && !/^https?:\/\/.+/.test(form.value.github)) {
    errors.value.github = '请输入有效的GitHub链接'
  }
  
  if (form.value.linkedin && !/^https?:\/\/.+/.test(form.value.linkedin)) {
    errors.value.linkedin = '请输入有效的LinkedIn链接'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  saving.value = true
  
  try {
    const memberData: Member = {
      id: form.value.id || `member_${Date.now()}`,
      name: form.value.name!.trim(),
      role: form.value.role!.trim(),
      avatar: form.value.avatar?.trim() || '',
      bio: form.value.bio?.trim() || '',
      skills: form.value.skills!,
      grade: form.value.grade || '',
      email: form.value.email!.trim(),
      github: form.value.github?.trim() || '',
      linkedin: form.value.linkedin?.trim() || '',
      joinDate: form.value.joinDate!,
      isActive: form.value.isActive!
    }

    emit('save', memberData)
  } catch (error) {
    console.error('保存成员信息失败:', error)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.member-edit-form {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #dc2626;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.skills-input-container {
  display: flex;
  gap: 0.5rem;
}

.skills-input-container .form-input {
  flex: 1;
}

.add-skill-btn {
  padding: 0.75rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-skill-btn:hover:not(:disabled) {
  background: #2563eb;
}

.add-skill-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.skill-tag {
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 1rem;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skill-tag.editable {
  padding-right: 0.25rem;
}

.remove-skill-btn {
  width: 1.25rem;
  height: 1.25rem;
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-skill-btn:hover {
  background: #dc2626;
}

.empty-skills {
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
  text-align: center;
  padding: 1rem;
  border: 1px dashed #d1d5db;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
}

.error-message {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* 滚动条样式 */
.member-edit-form::-webkit-scrollbar {
  width: 6px;
}

.member-edit-form::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.member-edit-form::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.member-edit-form::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .skills-input-container {
    flex-direction: column;
  }
  
  .add-skill-btn {
    width: 100%;
  }
}
</style>