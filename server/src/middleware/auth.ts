import { Request, RequestHandler } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/tokens";
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication required");
  }
  try {
    req.userId = verifyAccessToken(header.slice("Bearer ".length));
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
  next();
};
export function getUserId(req: Request): string {
  if (!req.userId) {
    throw new AppError(401, "Authentication required");
  }
  return req.userId;
}
