import { LoggerBase } from '@/utils/logger';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from './env';
import { PrismaClient } from '@/generated/prisma/client';

/**
 * Manages the Prisma 7.3.0 client using a Driver Adapter.
 * Manages the Prisma client using a Driver Adapter.
 * Bridges the gap between the 'pg' pool and Prisma.
 */
class DatabaseService extends LoggerBase {
    public readonly client: PrismaClient;

    constructor() {
        super();

        const pool = new Pool({
            connectionString: ConfigService.database.url,
        });

        const adapter = new PrismaPg(pool);

        this.client = new PrismaClient({
            adapter,
            log: ConfigService.server.isDevelopment
                ? ['query', 'info', 'warn', 'error']
                : ['error'],
        });
    }
}

export const prisma = new DatabaseService().client;