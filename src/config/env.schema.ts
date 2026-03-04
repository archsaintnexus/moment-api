import { z } from 'zod';

/**
 * Zod validation schema for all environment variables.
 * Ensures type safety and existence of required keys.
 */
export const envSchema = z.object({
    // App
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // API
    APP_NAME: z.string().default('Moment'),
    APP_URL: z.url().default(`http://localhost:${process.env.PORT || 3000}`),
    APP_TIMEZONE: z.string().default('UTC'),

    // CORS
    FRONTEND_URL: z.url().default('http://localhost:3000'),

    // Database
    DATABASE_URL: z.url(),

    // Email
    MAIL_PROVIDER: z.string().default('resend'),
    MAIL_API_KEY: z.string().min(1),

    // Redis
    REDIS_URL: z.url(),

    // JWT
    JWT_SECRET: z.string().min(32),
});

export type EnvConfig = z.infer<typeof envSchema>;