import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "@/exceptions/app-exceptions";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedException();
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) {
    throw new UnauthorizedException();
  }
  try {
    const decoded = jwt.verify(token, secret) as unknown as {
      userId: string;
      role: string;
    };
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (err) {
    throw new UnauthorizedException();
  }
};
