import { z } from 'zod';
import { RUN_STATUSES } from '../models/Run';
export const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalidid');export const idParamSchema = z.object({
id: objectIdSchema,
});
export const createProjectSchema = z.object({
name: z.string().trim().min(1, 'Name is required').max(80),
repoFullName: z
.string()
.trim()
.regex(/^[A-Za-z0-9_.-]+[/][A-Za-z0-9_.-]+$/, 'Use the formatowner/repo'),
});
export const listRunsQuerySchema = z.object({
page: z.coerce.number().int().min(1).default(1),
limit: z.coerce.number().int().min(1).max(100).default(20),
status: z.enum(RUN_STATUSES).optional(),
branch: z.string().trim().min(1).max(100).optional(),
});