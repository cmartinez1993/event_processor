import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from './generated/prisma/index.js'

const fastify = Fastify({ logger: true })
await fastify.register(cors, { origin: true })

const prisma = new PrismaClient()

fastify.addHook('onClose', async () => {
  await prisma.$disconnect()
})

// BigInt isn't JSON-serializable, so convert id to string before sending
function serialize(event) {
  return { ...event, id: event.id.toString() }
}

fastify.post('/events', async (request, reply) => {
  const { user_id, event_type, event_timestamp } = request.body

  if (!event_type) {
    return reply.status(400).send({ error: 'event_type is required' })
  }
  if (!user_id) {
    return reply.status(400).send({ error: 'user_id is required' })
  }

  const event = await prisma.event.create({
    data: {
      user_id,
      event_type,
      event_timestamp: event_timestamp ? new Date(event_timestamp) : new Date(),
    },
  })

  return reply.status(201).send({ success: true, event: serialize(event) })
})

fastify.get('/events', async (request, reply) => {
  const { event_type } = request.query
  const events = await prisma.event.findMany({
    where: event_type ? { event_type } : undefined,
    orderBy: { created_at: 'desc' },
  })
  return reply.send({ count: events.length, events: events.map(serialize) })
})

fastify.get('/events/:id', async (request, reply) => {
  const event = await prisma.event.findUnique({
    where: { id: BigInt(request.params.id) },
  })
  if (!event) return reply.status(404).send({ error: 'Event not found' })
  return reply.send(serialize(event))
})

fastify.delete('/events', async (request, reply) => {
  await prisma.event.deleteMany()
  return reply.send({ success: true, message: 'All events cleared' })
})

try {
  await fastify.listen({ port: 3000, host: '127.0.0.1' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
