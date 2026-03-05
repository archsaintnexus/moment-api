import type { ZodError } from "zod";

/**
 * Global API Response Contract
 * @template T The shape of the data being returned
 */
export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ZodError | Record<string, string[]> | unknown;    // For validation issues (Zod errors, custom validation, etc.)
  stack?: string;  // Only populated in development for debugging
}