import { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../utils/AppError';
export const notFound: RequestHandler = (req, res) => {
res.status(404).json({ message: `Route not found: ${req.method}
${req.originalUrl}` });
};
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
const status = err instanceof AppError ? err.statusCode : 500;
if (status === 500) {
console.error(err);
}
res.status(status).json({
message: status === 500 ? 'Something went wrong' : err.message,
});
};