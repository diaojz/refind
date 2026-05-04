<script setup>
import NotesInput from './components/NotesInput.vue'
import OutlineTree from './components/OutlineTree.vue'
import KnowledgeCards from './components/KnowledgeCards.vue'
import QuizPlayer from './components/QuizPlayer.vue'
import { ref, onMounted } from 'vue'
import { hasApiKey, setApiKey } from './api/deepseek.js'

const outline = ref(null)
const cards = ref([])
const quiz = ref([])
const step = ref('input') // input | outline | cards | quiz
const showApiKeyModal = ref(false)
const apiKeyInput = ref('')
const apiKeyError = ref('')

onMounted(() => {
  if (!hasApiKey()) {
    showApiKeyModal.value = true
  }
})

function saveApiKey() {
  const key = apiKeyInput.value.trim()
  if (!key) {
    apiKeyError.value = '请输入 API Key'
    return
  }
  if (!key.startsWith('sk-')) {
    apiKeyError.value = 'DeepSeek API Key 应以 sk- 开头'
    return
  }
  setApiKey(key)
  showApiKeyModal.value = false
  apiKeyError.value = ''
}

function onOutlineReady(data) {
  outline.value = data
  step.value = 'outline'
}

function onCardsReady(data) {
  cards.value = data
  step.value = 'cards'
}

function onQuizReady(data) {
  quiz.value = data
  step.value = 'quiz'
}

function onReset() {
  outline.value = null
  cards.value = []
  quiz.value = []
  step.value = 'input'
}
</script>
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
    <!-- API Key 配置弹窗 -->
    <div v-if="showApiKeyModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold text-amber-900 mb-2">配置 DeepSeek API Key</h2>
        <p class="text-sm text-amber-600/70 mb-4">
          在 <a href="https://platform.deepseek.com" target="_blank" class="underline">platform.deepseek.com</a> 获取你的 API Key
        </p>
        <input
          v-model="apiKeyInput"
          type="password"
          placeholder="sk-..."
          class="w-full px-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 mb-2"
          @keyup.enter="saveApiKey"
        />
        <p v-if="apiKeyError" class="text-red-500 text-sm mb-3">{{ apiKeyError }}</p>
        <button
          @click="saveApiKey"
          class="w-full px-4 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors cursor-pointer">
          保存并开始
        </button>
        <p class="text-xs text-amber-500/60 mt-3 text-center">
          Key 仅存储在浏览器本地，不会上传到服务器
        </p>
      </div>
    </div>

    <header class="border-b border-amber-200/60 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 class="text-lg font-bold tracking-tight text-amber-900">
          <span class="text-amber-500">✦</span> 练知 <span class="text-sm font-normal text-amber-600">Refiner</span>
        </h1>
        <div class="flex items-center gap-3">
          <button
            @click="showApiKeyModal = true"
            class="text-xs text-amber-500 hover:text-amber-700 transition-colors cursor-pointer">
            ⚙️ API Key
          </button>
          <button v-if="step !== 'input'"
            @click="onReset"
            class="text-sm text-amber-600 hover:text-amber-800 transition-colors cursor-pointer">
            重新开始
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-8">
      <NotesInput v-if="step === 'input'" @ready="onOutlineReady" />
      <OutlineTree v-else-if="step === 'outline'" :outline="outline" @next="onCardsReady" />
      <KnowledgeCards v-else-if="step === 'cards'" :cards="cards" :outline="outline" @next="onQuizReady" />
      <QuizPlayer v-else-if="step === 'quiz'" :quiz="quiz" :outline="outline" @restart="onReset" />
    </main>
  </div>
</template>
