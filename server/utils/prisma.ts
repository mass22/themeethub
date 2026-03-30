import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

/** Singleton par processus (évite d’ouvrir un pool Prisma à chaque requête en prod). */
export function usePrisma(): PrismaClient {
  if (globalThis.__prisma) {
    return globalThis.__prisma
  }
  const prisma = new PrismaClient()
  globalThis.__prisma = prisma
  return prisma
}
