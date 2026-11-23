import { createApp } from './app.js'

const server = await createApp()
const port = Number(process.env.PORT ?? 3000)

try {
    await server.listen({host: '0.0.0.0', port})
} catch (error) {
    server.log.error(error)
    process.exit(1)
}
