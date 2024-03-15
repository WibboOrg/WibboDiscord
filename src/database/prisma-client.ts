import { PrismaClient } from '@wibbo/prisma'

export const prisma = new PrismaClient({ datasourceUrl: process.env.PRISMA_DATABASE_URL })