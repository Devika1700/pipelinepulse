import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
export function signAccessToken(userId: string): string {
return jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
algorithm: 'HS256',
expiresIn: env.ACCESS_TOKEN_TTL_SECONDS,
});
}
export function verifyAccessToken(token: string): string {
const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms:
['HS256'] });
if (typeof payload === 'string' || !payload.sub) {
throw new Error('Malformed token');
}
return payload.sub;
}
export function generateRefreshToken(): string {
return crypto.randomBytes(48).toString('base64url');
}
export function hashToken(token: string): string {
return crypto.createHash('sha256').update(token).digest('hex');
}