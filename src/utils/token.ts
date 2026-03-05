import jwt from "jsonwebtoken";
import { StringValue } from "ms";

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN as StringValue,
  });
};

export const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as StringValue,
  });
};
