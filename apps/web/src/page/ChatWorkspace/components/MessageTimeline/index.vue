<script setup lang="ts">
import type { Message } from '../../types'
import './index.scss'

defineProps<{
  messages: Message[]
  errorMessage: string
}>()
</script>

<template>
  <section class="timeline" aria-label="消息记录">
    <p v-if="errorMessage" class="request-error" role="alert">{{ errorMessage }}</p>

    <div v-if="messages.length === 0" class="empty-state">
      <div class="empty-mark">A</div>
      <h2>从一个问题开始</h2>
      <p>输入内容后，这里会显示对话消息。</p>
    </div>

    <div v-else class="message-list">
      <article
        v-for="message in messages"
        :key="message.id"
        class="message-row"
        :class="`message-${message.role}`"
      >
        <div class="message-avatar" :class="`avatar-${message.role}`">
          {{ message.role === 'user' ? '我' : 'A' }}
        </div>
        <div class="message-body">
          <div class="message-meta">
            <strong>{{ message.role === 'user' ? '你' : 'Agent' }}</strong>
            <time>{{ message.createdAt }}</time>
          </div>
          <p>{{ message.content }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

