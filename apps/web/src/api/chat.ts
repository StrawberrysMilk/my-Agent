import request from './request'

export interface ChatRequest {
    message: string
}

export interface ChatResponse {
    message: string
}

export async function createChat(data: ChatRequest): Promise<ChatResponse>{
    return request.post<ChatResponse>('/chat', data, { timeout: 60_000 }).then((response) => response.data)
}

export async function updateChatStream(data: ChatRequest): Promise<ChatResponse> {
    return request.post<ChatResponse>('/chat/stream', data, {
        timeout: 60_000,
        headers: {
            'Accept': 'text/event-stream',
        },
    }).then((response) => response.data)
}
