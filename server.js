import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const fastify = Fastify({ logger: true })
await fastify.register(cors, { origin: true })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

fastify.addHook('onClose', async () => {
  await prisma.$disconnect()
})

// BigInt isn't JSON-serializable, so convert id to string before sending
function serialize(event) {
  return { ...event, id: event.id.toString() }
}

fastify.get('/health', async (request, reply) => {
  try {
    await prisma.event.count()
    return reply.send({ status: 'ok', db: 'connected' })
  } catch (err) {
    return reply.status(503).send({ status: 'error', db: 'unreachable', detail: err.message })
  }
})

fastify.post('/events', {
  schema: {
    body: {
      type: 'object',
      required: ['user_id', 'event_type'],
      additionalProperties: false,
      properties: {
        user_id:         { type: 'string', minLength: 1 },
        event_type:      { type: 'string', minLength: 1 },
        event_timestamp: { type: 'string' },
      },
    },
  },
}, async (request, reply) => {
  const { user_id, event_type, event_timestamp } = request.body

  const event = await prisma.event.create({
    data: {
      user_id,
      event_type,
      event_timestamp: event_timestamp ? new Date(event_timestamp) : new Date(),
    },
  })

  return reply.status(201).send({ success: true, event: serialize(event) })
})

fastify.get('/events', {
  schema: {
    querystring: {
      type: 'object',
      additionalProperties: false,
      properties: {
        event_type: { type: 'string', minLength: 1 },
      },
    },
  },
}, async (request, reply) => {
  const { event_type } = request.query
  const events = await prisma.event.findMany({
    where: event_type ? { event_type } : undefined,
    orderBy: { created_at: 'desc' },
  })
  return reply.send({ count: events.length, events: events.map(serialize) })
})

fastify.get('/events/:id', {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', pattern: '^[0-9]+$' },
      },
    },
  },
}, async (request, reply) => {
  const event = await prisma.event.findUnique({
    where: { id: BigInt(request.params.id) },
  })
  if (!event) return reply.status(404).send({ error: 'Event not found' })
  return reply.send(serialize(event))
})

fastify.get('/analytics/daily', async (request, reply) => {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const rows = await prisma.event.groupBy({
    by: ['event_type'],
    where: { created_at: { gte: startOfDay } },
    _count: { event_type: true },
    orderBy: { _count: { event_type: 'desc' } },
  })

  return reply.send({
    date: startOfDay.toISOString().split('T')[0],
    total: rows.reduce((sum, r) => sum + r._count.event_type, 0),
    breakdown: rows.map(r => ({ event_type: r.event_type, count: r._count.event_type })),
  })
})

fastify.delete('/events', async (request, reply) => {
  await prisma.event.deleteMany()
  return reply.send({ success: true, message: 'All events cleared' })
})

try {
  await fastify.listen({ port: 3000, host: '127.0.0.1' })
  console.log('API ready → http://127.0.0.1:3000')
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
