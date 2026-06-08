import Fastify from 'fastify'
import cors from '@fastify/cors'

const fastify = Fastify({ logger: true })
await fastify.register(cors, { origin: true })

const events = []

fastify.post('/events', async (request, reply) => {
  const { type, payload, timestamp } = request.body

  if (!type) {
    return reply.status(400).send({ error: 'Event type is required' })
  }

  const event = {
    id: crypto.randomUUID(),
    type,
    payload: payload ?? {},
    timestamp: timestamp ?? new Date().toISOString(),
    receivedAt: new Date().toISOString(),
  }

  events.push(event)

  return reply.status(201).send({ success: true, event })
})

fastify.get('/events', async (request, reply) => {
  const { type } = request.query
  const result = type ? events.filter(e => e.type === type) : events
  return reply.send({ count: result.length, events: result })
})

fastify.get('/events/:id', async (request, reply) => {
  const event = events.find(e => e.id === request.params.id)
  if (!event) return reply.status(404).send({ error: 'Event not found' })
  return reply.send(event)
})

fastify.delete('/events', async (request, reply) => {
  events.length = 0
  return reply.send({ success: true, message: 'All events cleared' })
})

try {
  await fastify.listen({ port: 3000, host: '127.0.0.1' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
