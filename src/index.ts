import express from 'express';

import routes from './routes';
import { logger } from './utils';

const app = express();
const port = 3000;

app.use(routes);

app.listen(port, () => {
    logger.info(`Image processing API enabled on http://localhost:${port}`);
});
