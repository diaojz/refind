<script setup>
import { ref } from 'vue'
import { callDeepSeek } from '../api/deepseek.js'
import prompts from '../prompts.js'

const props = defineProps({ cards: Array, outline: Object })
const emit = defineEmits(['next'])

const flipped = ref({})
const loading = ref(false)
const error = ref('')

function toggleFlip(idx) {
  flipped.value[idx] = !flipped.value[idx]
}

async function handleStartQuiz() {
  loading.value = true
  error.value = ''
  try {
    const allKps = props.outline.chapters.flatMap(c => c.knowledgePoints)
    const quiz = await callDeepSeek(prompts.quizGenerator, JSON.stringify(allKps, null, 2))
    emit('next', quiz)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h2 class="text-xl font-bold text-amber-900 mb-6 text-center">知识卡片</h2>
    <p class="text-amber-600/70 text-sm text-center mb-6">点击卡片翻转查看答案</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="(card, i) in cards" :key="i"
        @click="toggleFlip(i)"
        class="aspect-[3/2] perspective-1000 cursor-pointer">
        <div :class="[
          'relative w-full h-full transition-transform duration-500 preserve-3d rounded-xl shadow-md',
          flipped[i] ? 'rotate-y-180' : ''
        ]">
          <!-- 正面 -->
          <div class="absolute inset-0 backface-hidden bg-white rounded-xl p-5 flex items-center justify-center border border-amber-100">
            <p class="text-center font-medium text-amber-900 leading-relaxed">{{ card.cardFront }}</p>
          </div>
          <!-- 反面 -->
          <div class="absolute inset-0 backface-hidden rotate-y-180 bg-amber-50 rounded-xl p-5 border border-amber-200 flex flex-col justify-center">
            <p class="text-sm text-amber-900 leading-relaxed mb-3">{{ card.cardBack }}</p>
            <p v-if="card.example" class="text-xs text-amber-600/70 italic">💡 {{ card.example }}</p>
            <span class="mt-2 self-start text-xs px-2 py-0.5 rounded bg-amber-200/60 text-amber-700">
              {{ card.cardType === 'definition' ? '概念' : card.cardType === 'qa' ? '问答' : card.cardType === 'fillBlank' ? '填空' : '对比' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-8">
      <button @click="handleStartQuiz"
        :disabled="loading"
        class="px-8 py-3 bg-amber-600 text-white rounded-xl font-medium
               hover:bg-amber-700 disabled:opacity-40 transition-all cursor-pointer shadow-sm">
        <span v-if="loading">✦ AI 正在出题...</span>
        <span v-else>开始测试 →</span>
      </button>
    </div>
    <p v-if="error" class="text-center mt-4 text-red-500 text-sm">{{ error }}</p>
  </div>
</template>

<style scoped>
.perspective-1000 { perspective: 1000px; }
.preserve-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; }
.rotate-y-180 { transform: rotateY(180deg); }
</style>
