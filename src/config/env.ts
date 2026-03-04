import 'dotenv/config';
import { envSchema } from './env.schema';

/**
 * Validate and parse environment variables.
 * This throws a descriptive error if any required variable is missing or malformed.
 */
const _env = envSchema.parse(process.env);

/**
 * Centralized Configuration Service.
 * Provides a structured, type-safe way to access application settings.
 */
export const ConfigService = {
    server: {
        port: _env.PORT,
        env: _env.NODE_ENV,
        isProduction: _env.NODE_ENV === 'production',
        isDevelopment: _env.NODE_ENV === 'development',
    },
    app: {
        name: _env.APP_NAME,
        timezone: _env.APP_TIMEZONE,
    },
    api: {
        prefix: '/api/v1',
        url: _env.APP_URL || `http://localhost:${_env.PORT}`,
    },
    cors: {
        origins: _env.FRONTEND_URL ? [_env.FRONTEND_URL] : ['http://localhost:3000'],
    },
    database: {
        url: _env.DATABASE_URL,
    },
    email: {
        provider: _env.MAIL_PROVIDER || 'resend',
        apiKey: _env.MAIL_API_KEY,
        name: _env.APP_NAME,
        fromAddress: 'noreply@' + _env.APP_NAME.toLowerCase().replace(' ', '-') + '.com',
    },
    redis: {
        url: _env.REDIS_URL,
    },
    jwt: {
        secret: _env.JWT_SECRET,
        expiresIn: '7d',
    },
} as const;