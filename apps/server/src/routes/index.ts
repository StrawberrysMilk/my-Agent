import type { FastifyInstance } from 'fastify'
import { registerChatRoutes } from './chat/index.js'
import { registerGreetingRoutes } from './greeting/index.js'
import { registerHealthRoutes } from './health/index.js'

export async function registerRoutes(server: FastifyInstance) {
  await server.register(registerHealthRoutes)
  await server.register(registerGreetingRoutes)
  await server.register(registerChatRoutes)
}
