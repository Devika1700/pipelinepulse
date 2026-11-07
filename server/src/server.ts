import { createApp } from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
async function main() {
await connectDB();
const app = createApp();
const server = app.listen(env.PORT, () => {
console.log(`Server running on http://localhost:${env.PORT}`);
});
const shutdown = (signal: string) => {
console.log(`${signal} received. Shutting down...`);
server.close(async () => {
await disconnectDB();
process.exit(0);
});
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
}
main().catch((err) => {
console.error('Failed to start server:', err);
process.exit(1);
});