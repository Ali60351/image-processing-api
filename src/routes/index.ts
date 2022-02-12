import { Router } from 'express';

import apiRouter from './api';

const routes = [
    apiRouter
];

const router = Router();

routes.map(route => {
    router.use(route);
});

export default router;
