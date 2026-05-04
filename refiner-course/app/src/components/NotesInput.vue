<script setup>
import { ref } from 'vue'
import { callDeepSeek } from '../api/deepseek.js'
import prompts from '../prompts.js'

const notes = ref('')
const loading = ref(false)
const error = ref('')

const emit = defineEmits(['ready'])

async function handleSubmit() {
  if (!notes.value.trim()) return
  loading.value = true
  error.value = ''

  try {
    const result = await callDeepSeek(prompts.notesStructurer, notes.value)
    emit('ready', result)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto text-center">
    <div class="mb-8">
      <p class="text-5xl mb-4">📝</p>
      <h2 class="text-2xl font-bold text-amber-900 mb-2">粘贴你的学习笔记</h2>
      <p class="text-amber-700/70 text-sm">AI 将帮你提炼成结构化知识大纲</p>
    </div>

    <textarea v-model="notes"
      placeholder="把课堂笔记、讲义粘贴在这里...&#10;&#10;例如：&#10;Vue 的响应式系统基于 Proxy 实现...&#10;组件通信方式有 props、emit、provide/inject...&#10;v-model 是语法糖..."
      class="w-full h-56 p-4 rounded-xl border border-amber-200 bg-white/80 backdrop-blur-sm
             focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
             placeholder:text-amber-300 resize-none text-sm leading-relaxed" />

    <button @click="handleSubmit"
      :disabled="loading || !notes.trim()"
      class="mt-4 px-8 py-3 bg-amber-600 text-white rounded-xl font-medium
             hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed
             transition-all cursor-pointer shadow-sm hover:shadow-md">
      <span v-if="loading">✦ 正在炼化笔记...</span>
      <span v-else>开始学习</span>
    </button>

    <p v-if="error" class="mt-4 text-red-500 text-sm">{{ error }}</p>
  </div>
</template>
