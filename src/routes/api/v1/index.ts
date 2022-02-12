import { Router } from 'express';

import imageRouter from './image';

const router = Router();
const routes = [
    imageRouter
];

routes.map(route => {
    router.use('/v1', route);
});

export default router;
