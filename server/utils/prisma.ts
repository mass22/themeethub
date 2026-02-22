import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export function usePrisma(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient()
  }
  if (globalThis.__prisma) {
    return globalThis.__prisma
  }
  const prisma = new PrismaClient()
  globalThis.__prisma = prisma
  return prisma
}
