import express from 'express';

import routes from './routes';
import { logger } from './utils';

const app = express();
const port = 3000;

app.use(routes);

app.get('/', (req: express.Request, res: express.Response): void => {
    res.json({
        message: 'Welcome to image processing API',
        availableEndpoints: ['/image/api'],
    });
});

app.listen(port, (): void => {
    logger.info(`Image processing API enabled on http://localhost:${port}`);
});

export default app;
