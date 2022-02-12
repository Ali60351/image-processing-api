import { Router } from 'express';
import versionOneRouter from './v1';

const router = Router();

router.use('/api', versionOneRouter);

export default router;
