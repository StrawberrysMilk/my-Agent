import type { FastifyInstance } from 'fastify'

interface GreetingRequest {
  name: string
}

export async function registerGreetingRoutes(server: FastifyInstance) {
  server.post<{ Body: GreetingRequest }>(
    '/api/greeting',
    {
      schema: {
        summary: '生成问候语',
        description: '根据提供的姓名生成个性化问候语。',
        tags: ['System'],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', description: '姓名' },
          },
          required: ['name'],
          additionalProperties: false,
        },
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string', description: '生成的问候语' },
            },
            required: ['message'],
            additionalProperties: false,
          },
        },
      },
    },
    async request => ({ message: `你好，${request.body.name}！` }),
  )
}
