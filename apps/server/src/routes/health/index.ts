import type { FastifyInstance } from 'fastify'

export async function registerHealthRoutes(server: FastifyInstance) {
  server.get(
    '/api/health',
    {
      schema: {
        summary: '检查 API 服务状态',
        description: '用于确认后端 API 服务正在运行。',
        tags: ['System'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
            },
            required: ['status'],
            additionalProperties: false,
          },
        },
      },
    },
    async () => ({ status: 'ok' }),
  )
}
