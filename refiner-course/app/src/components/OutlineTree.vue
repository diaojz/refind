<script setup>
import { callDeepSeek } from '../api/deepseek.js'
import prompts from '../prompts.js'

const props = defineProps({ outline: Object })
const emit = defineEmits(['next'])

const loading = ref(false)
const error = ref('')

import { ref } from 'vue'

async function handleGenerateCards() {
  loading.value = true
  error.value = ''
  try {
    const allKps = props.outline.chapters.flatMap(c => c.knowledgePoints)
    const cards = []
    for (const kp of allKps) {
      const card = await callDeepSeek(prompts.knowledgeCards, JSON.stringify(kp, null, 2))
      cards.push(card)
    }
    emit('next', cards)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="outline" class="max-w-2xl mx-auto">
    <h2 class="text-xl font-bold text-amber-900 mb-4">{{ outline.title }}</h2>

    <div v-for="(ch, i) in outline.chapters" :key="i" class="mb-6">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-amber-500 font-bold">{{ i + 1 }}.</span>
        <h3 class="font-semibold text-amber-800">{{ ch.chapterTitle }}</h3>
        <span class="text-xs text-amber-500/60 ml-auto">{{ ch.knowledgePoints.length }} 个知识点</span>
      </div>

      <p class="text-xs text-amber-600/70 mb-2 ml-6">{{ ch.summary }}</p>

      <div class="space-y-1.5 ml-6">
        <div v-for="kp in ch.knowledgePoints" :key="kp.id"
          class="flex items-start gap-2 p-2 rounded-lg bg-white/60 text-sm">
          <span class="text-amber-400 mt-0.5 shrink-0">◇</span>
          <div>
            <span class="font-medium text-amber-900">{{ kp.concept }}</span>
            <span :class="[
              'ml-2 text-xs px-1.5 py-0.5 rounded',
              kp.difficulty === 'advanced' ? 'bg-red-100 text-red-600' :
              kp.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
              'bg-green-100 text-green-600'
            ]">{{ kp.difficulty === 'advanced' ? '进阶' : kp.difficulty === 'intermediate' ? '中等' : '基础' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-8">
      <button @click="handleGenerateCards"
        :disabled="loading"
        class="px-8 py-3 bg-amber-600 text-white rounded-xl font-medium
               hover:bg-amber-700 disabled:opacity-40 transition-all cursor-pointer shadow-sm">
        <span v-if="loading">✦ 生成知识卡片...</span>
        <span v-else>生成知识卡片 →</span>
      </button>
    </div>
    <p v-if="error" class="text-center mt-4 text-red-500 text-sm">{{ error }}</p>
  </div>
</template>
