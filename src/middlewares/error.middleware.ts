import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/app-exceptions";
import { LoggerBase } from "@/utils/logger";
import { IApiResponse } from "@/types";
import { ConfigService } from "@/config/env";

/**
 * Global Error Handler Middleware.
 * Catches all thrown exceptions and returns a structured JSON response.
 */
class ErrorMiddleware extends LoggerBase {
  public handle = (
    error: Error | HttpException,
    req: Request,
    res: Response,
    _next: NextFunction,
  ): void => {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors = undefined;

    if (error instanceof HttpException) {
      statusCode = error.statusCode;
      message = error.message;
      if ("errors" in error) errors = error.errors;
    } else if (error.type === "entity.parse.failed") {
      statusCode = 400;
      message = "Invalid JSON in request body";
    }

    // Log the error using our standardized logger
    this.error(`[${req.method}] ${req.path} >> ${message}`, error);

    const response: IApiResponse = {
      success: false,
      message,
      ...(errors ? { errors } : {}),
      // Only include stack trace in development
      ...(ConfigService.server.isDevelopment ? { stack: error.stack } : {}),
    };

    res.status(statusCode).json(response);
  };
}

export const globalErrorHandler = new ErrorMiddleware().handle;
