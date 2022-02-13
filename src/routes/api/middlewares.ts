import { Request, Response, NextFunction } from 'express';
import { logger, RequestError, validateExtension, validateNumber, validatePath } from '../../utils';

export const resizeRequestValidator = (req: Request, res: Response, next: NextFunction) => {
    const supportedParams = ['filename', 'w', 'h', 'ext'] as const;
    const requiredParams = ['filename'];
    const queryParams = { ...req.query };

    const paramValidators = {
        filename: (filePath: string) => validatePath('./images', filePath),
        w: validateNumber,
        h: validateNumber,
        ext: validateExtension
    };

    try {
        supportedParams.forEach(key => {
            const queryParam = queryParams[key];

            if (!queryParam) {
                if (requiredParams.includes(key)) {
                    throw new RequestError(`${key} is missing in query params`, 400);
                } else {
                    return;
                }
            }

            if (typeof queryParam !== 'string') {
                throw new RequestError(`${key} is of invalid type`, 400);
            }

            const validator = paramValidators[key];
            validator(queryParam);
        });

        if (queryParams.ext && !(queryParams.w && queryParams.h)) {
            throw new RequestError('Type conversion requires resizing too', 400);
        }

        next();
    } catch (e: unknown) {
        if (e instanceof RequestError) {
            logger.warn('Input:', queryParams, e.message);
            res.status(e.status).json({ error: e.message });
        } else if (e instanceof Error) {
            logger.error('Input:', queryParams, e.message);
            res.status(500).json({ error: 'Unexpected error', message: e.message });
        } else {
            console.error(e);
        }

        res.end();
    }
};