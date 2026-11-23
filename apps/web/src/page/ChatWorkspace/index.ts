import {computed, ref} from 'vue'
import {isAxiosError} from 'axios'
import type {Conversation, Message} from './types'
import {createChat, updateChatStream} from '@/api/chat'

export function useChatWorkspace() {
    const conversations = ref<Conversation[]>([
        {id: 'agent-basics', title: 'Agent 是如何工作的？', updatedAt: '刚刚'},
        {id: 'tool-calling', title: '理解工具调用', updatedAt: '昨天'},
        {id: 'project-plan', title: '项目技术选型', updatedAt: '周一'},
    ])

    const messagesByConversation = ref<Record<string, Message[]>>({
        'agent-basics': [
            {id: 'm1', role: 'user', content: '我想从零开始学习 Agent，应该先理解什么？', createdAt: '10:24'},
            {
                id: 'm2',
                role: 'assistant',
                content: '先把 Agent 看成一个由后端控制的循环：模型根据上下文决定下一步，服务端负责执行工具、保存状态，并判断任务何时结束。',
                createdAt: '10:24'
            },
            {
                id: 'm3',
                role: 'assistant',
                content: '建议从单轮模型调用开始，再逐步加入流式输出、一个受限工具和多步流程。这样每一层的职责都容易观察。',
                createdAt: '10:25'
            },
        ],
        'tool-calling': [
            {id: 'm4', role: 'user', content: '模型可以直接运行工具吗？', createdAt: '昨天'},
            {
                id: 'm5',
                role: 'assistant',
                content: '模型只返回结构化的工具调用意图，真正的参数校验和执行应该由后端完成。',
                createdAt: '昨天'
            },
        ],
        'project-plan': [
            {id: 'm6', role: 'user', content: 'Vue 和 Node 的项目怎么组织？', createdAt: '周一'},
            {
                id: 'm7',
                role: 'assistant',
                content: '可以用 pnpm workspace 管理 apps/web 和 apps/server，先保持前后端边界清楚。',
                createdAt: '周一'
            },
        ],
    })
    const sending = ref(false)
    const errorMessage = ref('')

    const activeConversationId = ref('agent-basics')
    const activeConversation = computed(() => conversations.value.find(item => item.id === activeConversationId.value)!)
    const activeMessages = computed(() => messagesByConversation.value[activeConversationId.value] ?? [])

    function selectConversation(id: string) {
        activeConversationId.value = id
    }

    function createConversation() {
        const id = crypto.randomUUID()
        conversations.value.unshift({id, title: '新对话', updatedAt: '刚刚'})
        messagesByConversation.value[id] = []
        activeConversationId.value = id
    }

    async function sendMessage(content: string) {
        const normalizedContent = content.trim()
        if (!normalizedContent) {
            errorMessage.value = '消息内容不能为空'
            return
        }

        if (sending.value)
            return

        const conversationId = activeConversationId.value
        const messages = messagesByConversation.value[conversationId] ?? []
        const now = new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})
        sending.value = true
        errorMessage.value = ''

        messages.push({id: crypto.randomUUID(), role: 'user', content: normalizedContent, createdAt: now})
        messagesByConversation.value[conversationId] = messages

        if (activeConversation.value.title === '新对话')
            activeConversation.value.title = normalizedContent.slice(0, 18)

        try {
            const data = await updateChatStream({message: normalizedContent})
            // const data = await createChat({message: normalizedContent})
            const latest = messagesByConversation.value[conversationId] ?? []
            latest.push({
                id: crypto.randomUUID(),
                role: 'assistant',
                content: data.message,
                createdAt: new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}),
            })
            messagesByConversation.value[conversationId] = [...latest]
        } catch (error) {
            if (isAxiosError(error)) {
                const status = error.response?.status
                const message = error.response?.data?.message
                errorMessage.value = status
                    ? `AI 服务请求失败（HTTP ${status}），请检查后端日志。`
                    : '无法连接后端或请求超时，请确认服务正在运行后重试。'
            } else {
                errorMessage.value = 'AI 请求失败，请稍后重试。'
            }
        } finally {
            sending.value = false
        }
    }

    return {
        activeConversation,
        activeConversationId,
        activeMessages,
        conversations,
        createConversation,
        selectConversation,
        sendMessage,
        sending,
        errorMessage,
    }
}
