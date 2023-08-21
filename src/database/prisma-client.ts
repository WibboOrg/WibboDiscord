import { PrismaClient, createContext } from 'wibboprisma'

export let prisma: PrismaClient = null;

export const initPrisma = async () => {
  prisma = (await createContext({})).prisma;
}