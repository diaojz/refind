<script setup>
import NotesInput from './components/NotesInput.vue'
import OutlineTree from './components/OutlineTree.vue'
import KnowledgeCards from './components/KnowledgeCards.vue'
import QuizPlayer from './components/QuizPlayer.vue'
import { ref } from 'vue'

const outline = ref(null)
const cards = ref([])
const quiz = ref([])
const step = ref('input') // input | outline | cards | quiz

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

<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
    <header class="border-b border-amber-200/60 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 class="text-lg font-bold tracking-tight text-amber-900">
          <span class="text-amber-500">✦</span> 练知 <span class="text-sm font-normal text-amber-600">Refiner</span>
        </h1>
        <button v-if="step !== 'input'"
          @click="onReset"
          class="text-sm text-amber-600 hover:text-amber-800 transition-colors cursor-pointer">
          重新开始
        </button>
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
