import mongoose from 'mongoose';
import { env } from './env';
export async function connectDB(): Promise<void> {
mongoose.set('strictQuery', true);
await mongoose.connect(env.MONGODB_URI, {
maxPoolSize: 10,
serverSelectionTimeoutMS: 5000,
});
console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
export async function disconnectDB(): Promise<void> {
await mongoose.disconnect();
}