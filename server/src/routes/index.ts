import { Router } from 'express';
import projectRoutes from './projects.routes';
import runRoutes from './runs.routes';
const router = Router();
router.use('/projects', projectRoutes);
router.use('/runs', runRoutes);
export default router;