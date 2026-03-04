import type { ZodError } from 'zod'

/**
 * @fileoverview Defines custom HTTP exception classes for consistent error handling.
 * Each exception class extends the base HttpException, which includes a message, status code, and an operational flag.
 * This structure allows for clear differentiation between expected (operational) and unexpected errors in the application.
 * The exceptions can be thrown in controllers or services to signal specific error conditions, which can then be handled by a global error handler middleware.
 * Example usage:
 *   throw new NotFoundException('User not found');
 *   throw new UnauthorizedException('Invalid token');
 *   throw new ForbiddenException('Insufficient permissions');
 *   throw new ConflictException('Email already in use');
 *   throw new ValidationException('Input validation failed', validationErrors);
 */

/**
 * Base class for HTTP exceptions.
 * Contains a message, status code, and an operational flag to distinguish between expected and unexpected errors.
 */
export class HttpException extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Maintain proper stack trace for where the error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Thrown when a requested resource is not found (e.g., invalid ID or missing record).
 */
export class NotFoundException extends HttpException {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * Thrown when authentication fails or is missing.
 */
export class UnauthorizedException extends HttpException {
    constructor(message = 'Authentication required') {
        super(message, 401);
    }
}

/**
 * Thrown when a user is authenticated but lacks permission for an action.
 */
export class ForbiddenException extends HttpException {
    constructor(message = 'Access denied') {
        super(message, 403);
    }
}

/**
 * Thrown for business logic conflicts (e.g., email already registered).
 */
export class ConflictException extends HttpException {
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}

/**
 * Thrown for validation errors (e.g., Zod schema failures).
 */
export class ValidationException extends HttpException {
    public errors?: ZodError | Record<string, string[]> | undefined;

    constructor(message = 'Validation failed', errors?: ZodError | Record<string, string[]>) {
        super(message, 422);
        this.errors = errors;
    }
}