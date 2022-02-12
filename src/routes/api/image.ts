import { Router } from 'express';
import { fetchImage } from '../../utils';

const router = Router();

router.get('/image', fetchImage);

export default router;
