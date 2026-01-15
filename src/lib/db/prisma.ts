import { Prisma, PrismaClient } from '~/prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { pagination } from 'prisma-extension-pagination';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const SLOW_QUERY_THRESHOLD_MS = 500;

export const slowQueryLogger = Prisma.defineExtension({
  name: 'slowQueryLogger',
  query: {
    $allModels: {
      $allOperations: async ({ model, operation, args, query }) => {
        const start = Date.now();

        try {
          const result = await query(args);
          const duration = Date.now() - start;

          if (duration < SLOW_QUERY_THRESHOLD_MS)
            return result;

          console.warn('[Prisma] Slow query detected', { model, operation, durationMs: duration });
        } catch (error) {
          const duration = Date.now() - start;

          console.warn('[Prisma] Query failed', { model, operation, durationMs: duration });
          throw error;
        }
      }
    }
  }
});


const prismaClient = new PrismaClient({ adapter })
  .$extends(pagination())
  .$extends(slowQueryLogger);

export type PrismaExtendedClient = typeof prismaClient;

declare global {
  var __prisma: PrismaExtendedClient | undefined;
}

export const prisma = globalThis.__prisma ?? prismaClient;

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}