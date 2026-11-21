import { Request, Response } from "express";
import { env } from "../config/env";
import { getUserId } from "../middleware/auth";
import { User } from "../models/User";
import * as authService from "../services/auth.service";
import { AppError } from "../utils/AppError";
import { loginSchema, registerSchema } from "../validators/schemas";
const REFRESH_COOKIE = "refreshToken";
const COOKIE_PATH = "/api/auth";
function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
}
function sessionMeta(req: Request) {
  return { userAgent: req.get("user-agent") };
}
export async function register(req: Request, res: Response) {
  const input = registerSchema.parse(req.body);
  const session = await authService.register(input, sessionMeta(req));
  setRefreshCookie(res, session.refreshToken);
  res
    .status(201)
    .json({ user: session.user, accessToken: session.accessToken });
}
export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const session = await authService.login(input, sessionMeta(req));
  setRefreshCookie(res, session.refreshToken);
  res.json({ user: session.user, accessToken: session.accessToken });
}
export async function refresh(req: Request, res: Response) {
  const session = await authService.refreshSession(
    req.cookies?.[REFRESH_COOKIE],
    sessionMeta(req),
  );
  setRefreshCookie(res, session.refreshToken);
  res.json({ user: session.user, accessToken: session.accessToken });
}
export async function logout(req: Request, res: Response) {
  await authService.logout(req.cookies?.[REFRESH_COOKIE]);
  res.clearCookie(REFRESH_COOKIE, { path: COOKIE_PATH });
  res.status(204).send();
}
export async function me(req: Request, res: Response) {
  const user = await User.findById(getUserId(req)).lean();
  if (!user) {
    throw new AppError(401, "User no longer exists");
  }
  res.json({
    user: { id: String(user._id), name: user.name, email: user.email },
  });
}
