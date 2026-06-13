import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const isRemote = process.env.DATABASE_URL?.includes("supabase")
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
      ...(isRemote ? { ssl: { rejectUnauthorized: false } } : {}),
    }),
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
