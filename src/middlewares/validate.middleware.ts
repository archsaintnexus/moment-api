import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationException } from "@/exceptions/app-exceptions";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new ValidationException("Validation failed", result.error));
    } else {
      req.body = result.data;
      next();
    }
  };
};
