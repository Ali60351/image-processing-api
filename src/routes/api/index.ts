import { Router } from 'express';

import imageRoute from './image';

const routes = [
    imageRoute
];

const router = Router();

routes.map(route => {
    router.use('/api', route);
});

export default router;
