<script setup>
import { ref, computed } from 'vue'
import { callDeepSeek } from '../api/deepseek.js'
import prompts from '../prompts.js'

const props = defineProps({ cards: Array, outline: Object })
const emit = defineEmits(['next'])

const currentIndex = ref(0)
const offsetX = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const isFlipped = ref(false)
const results = ref([]) // { index, direction: 'mastered' | 'review' }
const isExiting = ref(false)

const loading = ref(false)
const error = ref('')
const isDone = ref(false)

const currentCard = computed(() => props.cards[currentIndex.value])
const progress = computed(() => `${results.value.length} / ${props.cards.length}`)
const mastered = computed(() => results.value.filter(r => r.direction === 'mastered').length)
const toReview = computed(() => results.value.filter(r => r.direction === 'review').length)

const swipeHint = computed(() => {
  if (Math.abs(offsetX.value) < 40) return ''
  return offsetX.value < 0 ? 'mastered' : 'review'
})

const cardStyle = computed(() => {
  if (isExiting.value) {
    const dir = offsetX.value < 0 ? -500 : 500
    return { transform: `translateX(${dir}px) rotate(${offsetX.value < 0 ? -20 : 20}deg)`, opacity: 0 }
  }
  if (isDragging.value) {
    return { transform: `translateX(${offsetX.value}px) rotate(${offsetX.value * 0.04}deg)`, transition: 'none' }
  }
  return { transform: 'translateX(0) rotate(0)' }
})

function startDrag(x) {
  if (isExiting.value || isDone.value) return
  isDragging.value = true
  startX.value = x
}

function moveDrag(x) {
  if (!isDragging.value) return
  offsetX.value = x - startX.value
}

function endDrag() {
  if (!isDragging.value) return
  isDragging.value = false

  if (Math.abs(offsetX.value) > 100) {
    isExiting.value = true
    const direction = offsetX.value < 0 ? 'mastered' : 'review'
    setTimeout(() => {
      results.value.push({ index: currentIndex.value, direction })
      if (currentIndex.value + 1 >= props.cards.length) {
        isDone.value = true
      } else {
        currentIndex.value++
        isFlipped.value = false
        offsetX.value = 0
      }
      isExiting.value = false
      if (!isDone.value) offsetX.value = 0
    }, 300)
  } else {
    offsetX.value = 0
  }
}

function toggleFlip() {
  if (!isDragging.value && !isExiting.value) {
    isFlipped.value = !isFlipped.value
  }
}

function onTouchStart(e) { startDrag(e.touches[0].clientX) }
function onTouchMove(e) { moveDrag(e.touches[0].clientX) }
function onTouchEnd() { endDrag() }
function onMouseDown(e) { startDrag(e.clientX) }
function onMouseMove(e) { if (isDragging.value) moveDrag(e.clientX) }
function onMouseUp() { endDrag() }

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
  <div class="max-w-lg mx-auto select-none">
    <!-- 进度条 -->
    <div class="mb-6">
      <div class="flex items-center justify-between text-sm text-amber-700 mb-2">
        <span class="font-medium">✦ 闯关进度</span>
        <span>{{ progress }}</span>
      </div>
      <div class="h-2 bg-amber-100 rounded-full overflow-hidden">
        <div class="h-full bg-amber-500 rounded-full transition-all duration-500"
          :style="{ width: `${(results.length / props.cards.length) * 100}%` }" />
      </div>
    </div>

    <!-- 滑动闯关区 -->
    <template v-if="!isDone">
      <div class="relative">
        <!-- 左滑提示（已掌握） -->
        <div v-if="swipeHint === 'mastered'"
          class="absolute inset-0 z-10 border-4 border-green-400 rounded-2xl pointer-events-none
                 flex items-start justify-end p-6">
          <span class="bg-green-400 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
            ✨ 掌握了
          </span>
        </div>
        <!-- 右滑提示（没掌握） -->
        <div v-if="swipeHint === 'review'"
          class="absolute inset-0 z-10 border-4 border-orange-400 rounded-2xl pointer-events-none
                 flex items-start justify-start p-6">
          <span class="bg-orange-400 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
            📖 没掌握
          </span>
        </div>

        <!-- 卡片 -->
        <div
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend="onTouchEnd"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="isDragging && endDrag()"
          @click="toggleFlip"
          class="relative w-full aspect-[3/4] max-h-[420px] cursor-grab active:cursor-grabbing"
          :style="cardStyle">

          <div class="w-full h-full relative preserve-3d">
            <!-- 正面 -->
            <div :class="[
              'absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col justify-center border shadow-lg transition-colors',
              isFlipped ? 'bg-amber-50/80 border-amber-200' : 'bg-white border-amber-100'
            ]">
              <span class="text-xs text-amber-400 mb-3">{{ results.length + 1 }} / {{ props.cards.length }}</span>
              <p v-if="!isFlipped" class="text-lg font-medium text-amber-900 leading-relaxed text-center">
                {{ currentCard.cardFront }}
              </p>
              <p v-else class="text-base text-amber-900 leading-relaxed text-center">
                {{ currentCard.cardBack }}
              </p>
              <p v-if="!isFlipped" class="mt-4 text-xs text-amber-400 text-center">点击查看详解</p>
            </div>

            <!-- 反面（详解） -->
            <div :class="[
              'absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col justify-center border shadow-lg rotate-y-180',
              isFlipped ? 'bg-white border-amber-100' : 'bg-amber-50/80 border-amber-200'
            ]">
              <span class="text-xs text-amber-400 mb-3">详解</span>
              <p class="text-base text-amber-900 leading-relaxed text-center">
                {{ isFlipped ? currentCard.cardFront : currentCard.cardBack }}
              </p>
              <p v-if="currentCard.example" class="mt-3 text-sm text-amber-600/70 italic text-center">
                💡 {{ currentCard.example }}
              </p>
              <span v-if="isFlipped" class="mt-4 self-center text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-600">
                {{ currentCard.cardType === 'definition' ? '概念' : currentCard.cardType === 'qa' ? '问答' : currentCard.cardType === 'fillBlank' ? '填空' : '对比' }}
              </span>
              <p v-if="isFlipped" class="mt-2 text-xs text-amber-400 text-center">左右滑动标记掌握状态</p>
            </div>
          </div>
        </div>

        <!-- 底部操作提示 -->
        <div class="flex items-center justify-between mt-4 text-sm text-amber-500/60">
          <span>← 掌握了</span>
          <span class="text-xs">滑动卡片</span>
          <span>没掌握 →</span>
        </div>
      </div>
    </template>

    <!-- 完成总结页 -->
    <div v-else class="text-center py-12">
      <div class="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
        <p class="text-5xl mb-4">🎉</p>
        <h2 class="text-xl font-bold text-amber-900 mb-2">全部学完了！</h2>
        <div class="flex justify-center gap-8 my-6">
          <div class="text-center">
            <p class="text-3xl font-bold text-green-500">{{ mastered }}</p>
            <p class="text-xs text-amber-600/70">掌握了</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-orange-500">{{ toReview }}</p>
            <p class="text-xs text-amber-600/70">待复习</p>
          </div>
        </div>
        <button @click="handleStartQuiz"
          :disabled="loading"
          class="mt-4 px-8 py-3 bg-amber-600 text-white rounded-xl font-medium
                 hover:bg-amber-700 disabled:opacity-40 transition-all cursor-pointer shadow-sm">
          <span v-if="loading">✦ AI 正在出题...</span>
          <span v-else>开始测试 →</span>
        </button>
        <p v-if="error" class="mt-4 text-red-500 text-sm">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preserve-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; }
.rotate-y-180 { transform: rotateY(180deg); }
</style>
