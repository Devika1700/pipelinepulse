import { Request, Response } from "express";
import { getUserId } from "../middleware/auth";
import { Project } from "../models/Project";
import { Run } from "../models/Run";
import { AppError } from "../utils/AppError";
import { idParamSchema, listRunsQuerySchema } from "../validators/schemas";
export async function listRunsForProject(req: Request, res: Response) {
  const userId = getUserId(req);
  const { id } = idParamSchema.parse(req.params);
  const { page, limit, status, branch } = listRunsQuerySchema.parse(req.query);
  const owned = await Project.exists({ _id: id, owner: userId });
  if (!owned) {
    throw new AppError(404, "Project not found");
  }
  const filter: Record<string, unknown> = { project: id };
  if (status) filter.status = status;
  if (branch) filter.branch = branch;
  const [runs, total] = await Promise.all([
    Run.find(filter)
      .sort({ startedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Run.countDocuments(filter),
  ]);
  res.json({
    data: runs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
export async function getRun(req: Request, res: Response) {
  const userId = getUserId(req);
  const { id } = idParamSchema.parse(req.params);
  const run = await Run.findById(id).lean();
  if (!run) {
    throw new AppError(404, "Run not found");
  }
  const project = await Project.findOne({ _id: run.project, owner: userId })
    .select("name repoFullName")
    .lean();
  if (!project) {
    throw new AppError(404, "Run not found"); // same message, so we don'treveal that it exists
  }
  res.json({ ...run, project });
}
