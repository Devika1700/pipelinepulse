import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { env } from "../config/env";
import { RefreshToken } from "../models/RefreshToken";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import {
  generateRefreshToken,
  hashToken,
  signAccessToken,
} from "../utils/tokens";
const BCRYPT_ROUNDS = 12;
const REFRESH_TTL_MS = env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
// Used to make login take the same time whether or not the email exists.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", BCRYPT_ROUNDS);
type SessionMeta = { userAgent?: string };
type SessionUser = { _id: Types.ObjectId; name: string; email: string };
async function startSession(user: SessionUser, meta: SessionMeta) {
  const userId = String(user._id);
  const refreshToken = generateRefreshToken();
  await RefreshToken.create({
    user: userId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    userAgent: meta.userAgent?.slice(0, 200),
  });
  return {
    user: { id: userId, name: user.name, email: user.email },
    accessToken: signAccessToken(userId),
    refreshToken,
  };
}
export async function register(
  input: { name: string; email: string; password: string },
  meta: SessionMeta,
) {
  const existing = await User.exists({ email: input.email });
  if (existing) {
    throw new AppError(409, "An account with this email already exists");
  }
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
  });
  return startSession(user, meta);
}
export async function login(
  input: { email: string; password: string },
  meta: SessionMeta,
) {
  const user = await User.findOne({ email: input.email }).select(
    "+passwordHash",
  );
  // Always run a comparison, even for an unknown email, so timing doesn'treveal which emails exist.
  const passwordOk = await bcrypt.compare(
    input.password,
    user?.passwordHash ?? DUMMY_HASH,
  );
  if (!user || !passwordOk) {
    throw new AppError(401, "Invalid email or password");
  }
  return startSession(user, meta);
}
export async function refreshSession(
  token: string | undefined,
  meta: SessionMeta,
) {
  if (!token) {
    throw new AppError(401, "No refresh token");
  }
  const stored = await RefreshToken.findOne({ tokenHash: hashToken(token) });
  if (!stored) {
    throw new AppError(401, "Invalid refresh token");
  }
  if (stored.revokedAt) {
    // This token was already used. Someone is replaying an old copy, so endevery session for this user.
    await RefreshToken.updateMany(
      { user: stored.user, revokedAt: { $exists: false } },
      { revokedAt: new Date() },
    );
    throw new AppError(401, "Session no longer valid. Please log in again.");
  }
  if (stored.expiresAt.getTime() < Date.now()) {
    throw new AppError(401, "Session expired. Please log in again.");
  }
  const user = await User.findById(stored.user);
  if (!user) {
    throw new AppError(401, "User no longer exists");
  }
  stored.revokedAt = new Date(); // each refresh token works exactly once
  await stored.save();
  return startSession(user, meta);
}
export async function logout(token: string | undefined) {
  if (!token) return;
  await RefreshToken.updateOne(
    { tokenHash: hashToken(token), revokedAt: { $exists: false } },
    { revokedAt: new Date() },
  );
}
