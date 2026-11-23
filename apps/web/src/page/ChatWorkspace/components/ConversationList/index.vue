<script setup lang="ts">
import type { Conversation } from '../../types'
import './index.scss'

defineProps<{
  conversations: Conversation[]
  activeId: string
}>()

const emit = defineEmits<{
  select: [id: string]
  create: []
}>()
</script>

<template>
  <aside class="sidebar">
    <div class="brand-row">
      <div class="brand-mark">A</div>
      <span class="brand-name">Agent Lab</span>
    </div>

    <button class="new-chat" type="button" @click="emit('create')">
      <span class="plus" aria-hidden="true">+</span>
      <span class="new-chat-label">新建对话</span>
    </button>

    <div class="section-label">最近</div>
    <nav class="conversation-nav" aria-label="最近对话">
      <button
        v-for="conversation in conversations"
        :key="conversation.id"
        class="conversation-item"
        :class="{ active: conversation.id === activeId }"
        type="button"
        @click="emit('select', conversation.id)"
      >
        <span class="conversation-mark" aria-hidden="true">◦</span>
        <span class="conversation-copy">
          <span class="conversation-title">{{ conversation.title }}</span>
          <span class="conversation-time">{{ conversation.updatedAt }}</span>
        </span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <div class="avatar">学</div>
      <div class="profile-copy"><strong>学习者</strong><span>本地项目</span></div>
      <span class="profile-menu" aria-hidden="true">···</span>
    </div>
  </aside>
</template>

