import { LoggerBase } from '@/utils/logger';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from './env';
import { PrismaClient } from '@/generated/prisma/client';

/**
 * Manages the Prisma 7.3.0 client using a Driver Adapter.
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

        this.init();
    }

    /**
     * Validates the driver adapter connection on startup.
     */
    private async init(): Promise<void> {
        try {
            await this.client.$connect();
            this.log('Database connected successfully via PG Adapter');
        } catch (err) {
            this.error('Critical: Database connection failed', err);
            process.exit(1);
        }
    }
}

export const prisma = new DatabaseService().client;