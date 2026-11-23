<script setup lang="ts">
import { ref } from 'vue'
import './index.scss'

const emit = defineEmits<{
  send: [content: string]
}>()

const draft = ref('')

function submitMessage() {
  if (props.disabled)
    return

  const content = draft.value.trim()
  if (!content)
    return

  emit('send', content)
  draft.value = ''
}

const props = defineProps<{
  disabled?: boolean
}>()
</script>

<template>
  <form class="composer-wrap" @submit.prevent="submitMessage">
    <div class="composer">
      <textarea
        v-model="draft"
        aria-label="消息内容"
        placeholder="给 Agent 发送消息…"
        rows="1"
        :disabled="disabled"
        @keydown.enter.exact.prevent="submitMessage"
      />
      <button class="send-button" type="submit" :disabled="disabled || !draft.trim()" aria-label="发送消息">
        <span aria-hidden="true">↑</span>
      </button>
    </div>
    <p class="composer-note">通过后端 API 调用模型</p>
  </form>
</template>

