import { Router } from 'express';
import { createProject, listProjects } from
'../controllers/projects.controller';
import { listRunsForProject } from '../controllers/runs.controller';
const router = Router();
router.get('/', listProjects);
router.post('/', createProject);
router.get('/:id/runs', listRunsForProject);
export default router;