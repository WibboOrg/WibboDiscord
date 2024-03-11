import { PrismaClient } from 'wibboprisma'

export const prisma = new PrismaClient({ datasourceUrl: process.env.PRISMA_DATABASE_URL })