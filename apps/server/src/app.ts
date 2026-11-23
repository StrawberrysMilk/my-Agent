import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { registerRoutes } from './routes/index.js'

export async function createApp() {
  const server = Fastify({ logger: true })
  const port = Number(process.env.PORT ?? 3000)

  server.addHook('onRequest', async (request) => {
    request.log.info({
      method: request.method,
      url: request.url,
      requestId: request.id,
    }, 'request started')
  })

  server.addHook('onResponse', async (request, reply) => {
    request.log.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      requestId: request.id,
    }, 'request completed')
  })

  await server.register(swagger, {
    openapi: {
      info: {
        title: 'Agent Learning API',
        description: 'Node.js + Vue Agent 学习项目接口文档',
        version: '1.0.0',
      },
      servers: [{ url: process.env.API_BASE_URL ?? `http://localhost:${port}` }],
      tags: [{ name: 'System', description: '服务状态与系统接口' }],
    },
  })

  await server.register(swaggerUi, { routePrefix: '/docs' })
  await server.register(registerRoutes)

  return server
}
