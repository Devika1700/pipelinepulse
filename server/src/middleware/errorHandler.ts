import { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';
export const notFound: RequestHandler = (req, res) => {
res.status(404).json({ message: `Route not found: ${req.method}
${req.originalUrl}` });
};
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
if (err instanceof ZodError) {
res.status(400).json({
message: 'Validation failed',
errors: err.issues.map((issue) => ({
field: issue.path.join('.'),
message: issue.message,
})),
});
return;
}
if (err instanceof mongoose.Error.ValidationError) {
res.status(400).json({ message: err.message });
return;
}
if (err?.code === 11000) {
res.status(409).json({ message: 'That record already exists' });
return;
}
const status = err instanceof AppError ? err.statusCode : 500;
if (status === 500) {
console.error(err);
}
res.status(status).json({
message: status === 500 ? 'Something went wrong' : err.message,
});
};