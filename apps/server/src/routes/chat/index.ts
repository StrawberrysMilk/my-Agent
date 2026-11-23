import type {FastifyInstance} from 'fastify'
import {generateChatReply, streamChatReply} from '../../modules/chat/chat.service.js'
import { once } from 'node:events'

interface ChatRequest {
    message: string
}

export async function registerChatRoutes(server: FastifyInstance) {
    server.post<{ Body: ChatRequest }>(
        '/api/chat',
        {
            schema: {
                summary: '与 AI 聊天',
                description: '与 AI 进行对话，获取智能回复。',
                tags: ['System'],
                body: {
                    type: 'object',
                    properties: {
                        message: {type: 'string', minLength: 1, description: '用户输入的消息'},
                    },
                    required: ['message'],
                    additionalProperties: false,
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            message: {type: 'string', description: 'AI 的回复消息'},
                        },
                        required: ['message'],
                        additionalProperties: false,
                    },
                },
            },
        },
        async request => ({message: await generateChatReply(request.body.message)}),
    )

    server.post<{ Body: ChatRequest }>('/api/chat/stream',
        {
            schema: {
                summary: '与 AI 聊天（流式响应）',
                description: '与 AI 进行对话，获取智能回复（流式响应）。',
                tags: ['System'],
                body: {
                    type: 'object',
                    properties: {
                        message: {type: 'string', minLength: 1, description: '用户输入的消息'},
                    },
                    required: ['message'],
                    additionalProperties: false,
                },
                response: {
                    200: {
                        description: 'Server-Sent Events 流；每个 data 事件包含一个 delta，结束时发送 done 事件。',
                        content: {
                            'text/event-stream': {
                                schema: {type: 'string'},
                            },
                        },
                    }
                }
            }
        },
        async (request, reply) => {
            reply.hijack()
            const abortController = new AbortController()
            const abortOnDisconnect = () => {
                if (!reply.raw.writableEnded)
                    abortController.abort()
            }
            reply.raw.on('close', abortOnDisconnect)

            reply.raw.writeHead(200, {
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                Connection: 'keep-alive',
                'X-Accel-Buffering': 'no',
            })

            async function writeEvent(event: string) {
                if (abortController.signal.aborted)
                    return

                if (!reply.raw.write(event))
                    await once(reply.raw, 'drain', {signal: abortController.signal})
            }

            try {
                for await (const delta of streamChatReply(request.body.message, abortController.signal)) {
                    await writeEvent(`data: ${JSON.stringify({delta})}\n\n`)
                }

                await writeEvent('event: done\ndata: {}\n\n')
            } catch (error) {
                if (!abortController.signal.aborted) {
                    request.log.error(error)
                    try {
                        await writeEvent(`event: error\ndata: ${JSON.stringify({message: '模型生成失败'})}\n\n`)
                    } catch {
                        // The client may disconnect while the error event is being written.
                    }
                }
            } finally {
                reply.raw.off('close', abortOnDisconnect)
                reply.raw.end()
            }
        }
    )
}
