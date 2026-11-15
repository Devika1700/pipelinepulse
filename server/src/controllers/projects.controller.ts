import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { createProjectSchema } from '../validators/schemas';
export async function createProject(req: Request, res: Response) {
const input = createProjectSchema.parse(req.body);
const project = await Project.create(input);
res.status(201).json(project);
}
export async function listProjects(_req: Request, res: Response) {
const projects = await Project.find().sort({ createdAt: -1 }).lean();
res.json({ data: projects });
}