import { Router } from 'express';

const router = Router();

router.get('/image', (req, res) => {
    res.status(200).send('Route Active!');
});

export default router;
