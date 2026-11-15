import { Router } from 'express';
import { getRun } from '../controllers/runs.controller';
const router = Router();
router.get('/:id', getRun);
export default router;