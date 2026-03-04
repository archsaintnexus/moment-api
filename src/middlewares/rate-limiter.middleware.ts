import { ConfigService } from '@/config/env';
import { IApiResponse } from '@/types';
import rateLimit from 'express-rate-limit';

/**
 * Standardized rate limiter to prevent API abuse.
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: ConfigService.server.isProduction ? 100 : 1000, // Limit each IP
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        const response: IApiResponse = {
            success: false,
            message: 'Too many requests, please try again later.',
        };
        res.status(429).json(response);
    },
});

/**
 * Stricter limiter for sensitive Authentication routes.
 * Prevents automated scripts from guessing passwords or OTPs.
 */
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // Only 5 attempts per hour per IP
    message: {
        success: false,
        message: 'Too many login attempts. Please try again in an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});