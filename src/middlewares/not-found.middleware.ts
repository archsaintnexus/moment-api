import { NextFunction, Request, Response } from 'express';
import { NotFoundException } from '../exceptions/app-exceptions';

/**
 * Catch-all middleware that converts unmatched routes into a 404 HttpException.
 */
export const notFoundHandler = (
    _req: Request,
    _res: Response,
    next: NextFunction
): void => {
    next(new NotFoundException('Route not found'));
};
