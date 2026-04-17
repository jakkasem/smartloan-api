import { PrismaClient } from '../generated/prisma';

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL + '?connection_limit=10&pool_timeout=20',
      },
    },
  });

globalForPrisma.prisma = prisma;

export default prisma;
