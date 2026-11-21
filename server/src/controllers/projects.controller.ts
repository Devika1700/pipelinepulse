import { Request, Response } from "express";
import { getUserId } from "../middleware/auth";
import { Project } from "../models/Project";
import { createProjectSchema } from "../validators/schemas";
export async function createProject(req: Request, res: Response) {
  const userId = getUserId(req);
  const input = createProjectSchema.parse(req.body);
  const project = await Project.create({ ...input, owner: userId });
  res.status(201).json(project);
}
export async function listProjects(req: Request, res: Response) {
  const userId = getUserId(req);
  const projects = await Project.find({ owner: userId })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ data: projects });
}
