import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function createUser(aadhaarNumber: string, facialData: string) {
  return prisma.user.create({
    data: {
      aadhaarNumber,
      facialData,
    },
  })
}

export async function getUserByAadhaar(aadhaarNumber: string) {
  return prisma.user.findUnique({
    where: {
      aadhaarNumber,
    },
  })
}

export async function updateUserFacialData(aadhaarNumber: string, facialData: string) {
  return prisma.user.update({
    where: {
      aadhaarNumber,
    },
    data: {
      facialData,
    },
  })
}