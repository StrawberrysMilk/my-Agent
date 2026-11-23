<script setup lang="ts">
import {ConversationList, MessageComposer, MessageTimeline} from './components'
import {useChatWorkspace} from './index.ts'
import './index.scss'

const {
  activeConversation,
  activeConversationId,
  activeMessages,
  conversations,
  createConversation,
  selectConversation,
  sendMessage,
  sending,
  errorMessage,
} = useChatWorkspace()
</script>

<template>
  <main class="workspace">
    <ConversationList
        :conversations="conversations"
        :active-id="activeConversationId"
        @select="selectConversation"
        @create="createConversation"
    />

    <section class="chat-panel">
      <header class="chat-header">
        <div class="chat-heading">
          <p class="eyebrow">学习工作区</p>
          <h1>{{ activeConversation.title }}</h1>
        </div>
        <div class="connection-state"><span class="state-dot"/>AI API</div>
      </header>

      <MessageTimeline :messages="activeMessages" :error-message="errorMessage"/>
      <MessageComposer :disabled="sending" @send="sendMessage"/>
    </section>
  </main>
</template>

