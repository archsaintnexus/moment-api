import { ValidationException } from "@/exceptions/app-exceptions";
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );

      next(new ValidationException("Validation failed", errors as any));
    } else {
      req.body = result.data;
      next();
    }
  };
};
