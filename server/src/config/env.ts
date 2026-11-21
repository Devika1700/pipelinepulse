import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({
NODE_ENV: z.enum(['development', 'test',
'production']).default('development'),
PORT: z.coerce.number().default(5000),
MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
CLIENT_URL: z.string().default('http://localhost:5173'),
JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'), ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().default(900),REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(7),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
console.error('Invalid environment variables:');
console.error(parsed.error.issues);
process.exit(1);
}
export const env = parsed.data;