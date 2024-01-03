import { Environment } from 'vitest'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import * as process from 'process'
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Provide DATABASE_URL env variable')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

const prisma = new PrismaClient()

export default <Environment>{
  name: 'prisma',
  setup: async () => {
    const schema = randomUUID()

    process.env.DATABASE_URL = generateDatabaseURL(schema)

    execSync('npx prisma migrate deploy')

    return {
      schema,
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
  transformMode: 'ssr',
}
