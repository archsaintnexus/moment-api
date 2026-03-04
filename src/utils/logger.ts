import { ConfigService } from '@/config/env';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

/**
 * Standardized log format definition.
 * Combines timestamp, log level, caller context, and message/stack trace.
 */
const logFormat = winston.format.printf(({ level, message, timestamp, stack, caller }) => {
    return `${timestamp} [${level.toUpperCase()}] ${caller ? `[${caller}]` : ''}: ${stack || message}`;
});

/**
 * Abstract base class for centralized logging.
 * Classes should extend this to gain access to context-aware logging.
 * @abstract
 */
export abstract class LoggerBase {
    protected logger: winston.Logger;
    private className: string;

    constructor() {
        this.className = this.constructor.name;
        const logDir = 'logs';

        this.logger = winston.createLogger({
            // Use centralized config instead of process.env
            level: ConfigService.server.isProduction ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.errors({ stack: true }),
                logFormat
            ),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        logFormat
                    ),
                }),
                new DailyRotateFile({
                    dirname: `${logDir}/combined`,
                    filename: 'combined-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '30d',
                }),
                new DailyRotateFile({
                    level: 'error',
                    dirname: `${logDir}/errors`,
                    filename: 'errors-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '90d',
                }),
            ],
        });
    }

    /**
     * Extracts caller information from the stack trace for auditing.
     * @returns {string} Formatted class and file name.
     */
    private getCallerInfo(): string {
        const err = new Error();
        const stack = err.stack?.split('\n');
        // Index 3 typically points to the method calling the logger
        const callerLine = stack?.[3] || '';
        const match = callerLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) || callerLine.match(/at\s+(.*):(\d+):(\d+)/);

        if (match) {
            const filePath = match[2] || match[1] || '';
            const fileName = path.basename(filePath);
            return `${this.className}.${fileName.split('.')[0]}`;
        }
        return this.className;
    }

    /**
     * Logs an informational message.
     * @param {string} message - The primary message to log.
     * @param {Record<string, unknown>} [meta] - Optional metadata to include in the log entry.
     */
    protected log(message: string, meta?: Record<string, unknown>): void {
        this.logger.info(message, { ...meta, caller: this.getCallerInfo() });
    }

    /**
     * Logs an error message and associated error object or stack trace.
     * @param {string} message - The error description.
     * @param {Error | unknown} [error] - The error object or supplementary details.
     */
    protected error(message: string, error?: Error | unknown): void {
        this.logger.error(message, { error, caller: this.getCallerInfo() });
    }

    /**
     * Logs a warning message.
     * @param {string} message - The warning description.
     * @param {Record<string, unknown>} [meta] - Optional metadata or context.
     */
    protected warn(message: string, meta?: Record<string, unknown>): void {
        this.logger.warn(message, { ...meta, caller: this.getCallerInfo() });
    }

    /**
     * Logs a debug message, typically visible only in non-production environments.
     * @param {string} message - The debug details.
     * @param {Record<string, unknown>} [meta] - Optional metadata.
     */
    protected debug(message: string, meta?: Record<string, unknown>): void {
        this.logger.debug(message, { ...meta, caller: this.getCallerInfo() });
    }
}