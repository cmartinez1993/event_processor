import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma  = new PrismaClient({ adapter })

const START_ID  = 5
const END_ID    = 10_004
const BATCH_SIZE = 500

function randomDate() {
  const now   = Date.now()
  const days30 = 30 * 24 * 60 * 60 * 1000
  return new Date(now - Math.random() * days30)
}

async function main() {
  const total = END_ID - START_ID + 1
  console.log(`Seeding ${total} user.signup events (user_id ${START_ID}–${END_ID})…`)

  let inserted = 0

  for (let i = START_ID; i <= END_ID; i += BATCH_SIZE) {
    const batch = []
    for (let userId = i; userId <= Math.min(i + BATCH_SIZE - 1, END_ID); userId++) {
      const ts = randomDate()
      batch.push({
        user_id:         String(userId),
        event_type:      'user.signup',
        event_timestamp: ts,
        created_at:      ts,
      })
    }

    await prisma.event.createMany({ data: batch })
    inserted += batch.length
    console.log(`  ${inserted} / ${total}`)
  }

  console.log(`Done — ${inserted} events inserted.`)
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
