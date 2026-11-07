import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';
export function createApp() {
const app = express();
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.get('/api/health', (_req, res) => {
res.json({
status: 'ok',
db: mongoose.connection.readyState === 1 ? 'connected' :
'disconnected',
uptime: Math.round(process.uptime()),
});
});

app.use(notFound);
app.use(errorHandler);
return app;
}