import express from 'express';

import routes from './routes';
import { logger } from './utils';

const app = express();
const port = 3000;

app.use(routes);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to image processing API',
        availableEndpoints: [
            '/image/api'
        ]
    });
});

app.listen(port, () => {
    logger.info(`Image processing API enabled on http://localhost:${port}`);
});

export default app;
