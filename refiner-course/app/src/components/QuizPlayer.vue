<script setup>
import { ref } from 'vue'
import { callDeepSeek } from '../api/deepseek.js'
import prompts from '../prompts.js'

const props = defineProps({ quiz: Array, outline: Object })
const emit = defineEmits(['restart'])

const answers = ref({})
const results = ref({})
const loading = ref(null)

async function submitAnswer(q) {
  const answer = answers.value[q.id]
  if (!answer?.trim()) return

  loading.value = q.id
  try {
    const result = await callDeepSeek(
      prompts.answerEvaluator,
      JSON.stringify({ question: q, userAnswer: answer }, null, 2)
    )
    results.value[q.id] = result
  } catch (e) {
    results.value[q.id] = { score: 0, correct: false, feedback: '评分失败：' + e.message }
  } finally {
    loading.value = null
  }
}

function selectOption(q, option) {
  answers.value[q.id] = option
  submitAnswer(q)
}

function totalScore() {
  const scores = Object.values(results.value)
  if (!scores.length) return 0
  return Math.round(scores.reduce((s, r) => s + r.score, 0) / scores.length)
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="text-center mb-8">
      <h2 class="text-xl font-bold text-amber-900 mb-2">知识测验</h2>
      <p class="text-amber-600/70 text-sm">每题作答后立即获得 AI 评分与反馈</p>
    </div>

    <div v-if="Object.keys(results).length" class="mb-8 text-center">
      <div class="inline-flex items-center gap-3 px-6 py-3 bg-white/80 rounded-xl shadow-sm border border-amber-100">
        <span class="text-sm text-amber-700">总分</span>
        <span class="text-3xl font-bold" :class="totalScore() >= 80 ? 'text-green-600' : totalScore() >= 50 ? 'text-amber-600' : 'text-red-500'">
          {{ totalScore() }}
        </span>
      </div>
    </div>

    <div v-for="(q, i) in quiz" :key="q.id" class="mb-6">
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-amber-100 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xs px-2 py-0.5 rounded font-medium"
            :class="q.type === 'multipleChoice' ? 'bg-blue-100 text-blue-700' :
                    q.type === 'trueFalse' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'">
            {{ q.type === 'multipleChoice' ? '选择题' : q.type === 'trueFalse' ? '判断题' : '简答题' }}
          </span>
          <span class="text-xs text-amber-500">#{{ i + 1 }}</span>
        </div>

        <p class="text-sm font-medium text-amber-900 mb-3">{{ q.question }}</p>

        <!-- 选择题 -->
        <div v-if="q.type === 'multipleChoice'" class="space-y-2">
          <button v-for="opt in q.options" :key="opt"
            @click="selectOption(q, opt)"
            :disabled="results[q.id]"
            :class="[
              'w-full text-left p-3 rounded-lg border text-sm transition-all cursor-pointer',
              results[q.id]
                ? opt === q.correctAnswer
                  ? 'border-green-300 bg-green-50 text-green-800'
                  : answers[q.id] === opt && opt !== q.correctAnswer
                    ? 'border-red-300 bg-red-50 text-red-800'
                    : 'border-amber-100 bg-white/50 text-amber-700'
                : 'border-amber-100 hover:border-amber-300 bg-white/50 text-amber-800 hover:bg-amber-50'
            ]">
            {{ opt }}
          </button>
        </div>

        <!-- 判断题 -->
        <div v-if="q.type === 'trueFalse'" class="flex gap-3">
          <button v-for="opt in ['正确', '错误']" :key="opt"
            @click="selectOption(q, opt)"
            :disabled="results[q.id]"
            :class="[
              'flex-1 p-3 rounded-lg border text-sm transition-all cursor-pointer',
              results[q.id]
                ? opt === q.correctAnswer
                  ? 'border-green-300 bg-green-50 text-green-800'
                  : answers[q.id] === opt
                    ? 'border-red-300 bg-red-50 text-red-800'
                    : 'border-amber-100 bg-white/50 text-amber-700'
                : 'border-amber-100 hover:border-amber-300 bg-white/50 text-amber-800 hover:bg-amber-50'
            ]">
            {{ opt }}
          </button>
        </div>

        <!-- 简答题 -->
        <div v-if="q.type === 'shortAnswer'">
          <textarea v-model="answers[q.id]"
            :disabled="results[q.id]"
            placeholder="输入你的回答..."
            class="w-full p-3 rounded-lg border border-amber-200 bg-white/50 text-sm
                   focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none h-24
                   placeholder:text-amber-300" />
          <button v-if="!results[q.id]"
            @click="submitAnswer(q)"
            :disabled="loading === q.id || !answers[q.id]?.trim()"
            class="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm
                   hover:bg-amber-700 disabled:opacity-40 transition-all cursor-pointer">
            <span v-if="loading === q.id">评分中...</span>
            <span v-else>提交</span>
          </button>
        </div>

        <!-- 结果反馈 -->
        <div v-if="results[q.id]" class="mt-4 p-3 rounded-lg"
          :class="results[q.id].score >= 80 ? 'bg-green-50 border border-green-200' :
                  results[q.id].score >= 50 ? 'bg-amber-50 border border-amber-200' :
                  'bg-red-50 border border-red-200'">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-lg font-bold"
              :class="results[q.id].score >= 80 ? 'text-green-600' :
                      results[q.id].score >= 50 ? 'text-amber-600' :
                      'text-red-500'">
              {{ results[q.id].score }} 分
            </span>
            <span class="text-xs text-amber-600/70">{{ results[q.id].feedback }}</span>
          </div>
          <p v-if="results[q.id].suggestion" class="text-xs text-amber-700/70 mt-1">
            💡 {{ results[q.id].suggestion }}
          </p>
          <p v-if="results[q.id].perfectAnswer" class="text-xs text-green-700/70 mt-1">
            ✓ 参考答案：{{ results[q.id].perfectAnswer }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="Object.keys(results).length === quiz.length" class="text-center mt-8 mb-12">
      <button @click="emit('restart')"
        class="px-8 py-3 bg-amber-600 text-white rounded-xl font-medium
               hover:bg-amber-700 transition-all cursor-pointer shadow-sm">
        重新学一遍
      </button>
    </div>
  </div>
</template>
