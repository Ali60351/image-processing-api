import path from 'path';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { Router, Request, Response, NextFunction } from 'express';

import { RequestError, validateNumber, validatePath } from '../../utils';

const router = Router();

const requestValidator = (req: Request, res: Response, next: NextFunction) => {
    const supportedParams = ['filename', 'w', 'h'] as const;
    const requiredParams = ['filename'];
    const queryParams = { ...req.query };

    const paramValidators = {
        filename: (filePath: string) => validatePath('./images', filePath),
        w: validateNumber,
        h: validateNumber,
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

        next();
    } catch (e: unknown) {
        if (e instanceof RequestError) {
            res.status(e.status).json({ error: e.message });
        } else if (e instanceof Error) {
            res.status(500).json({ error: 'Unexpected error', message: e.message });
        } else {
            console.error(e);
        }

        res.end();
    }
};

router.get('/image', requestValidator, (req, res) => {
    const queryParams = {
        filename: String(req.query.filename),
        width: req.query.w ? Number(req.query.w) : null,
        height: req.query.h ? Number(req.query.h) : null,
    };

    const filePath = path.join('./images', queryParams.filename);

    fs.open(filePath, 'r').then(fileHandler => {
        fileHandler.readFile().then(file => {
            res.status(200);
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Content-Disposition', `filename: ${path.basename(filePath)}`);

            let resizeParams: sharp.ResizeOptions | null = null;

            if (queryParams.width && queryParams.height) {
                resizeParams = {
                    fit: 'fill',
                    width: queryParams.width,
                    height: queryParams.height,
                };
            }

            if (resizeParams) {
                const resizedImage = sharp(file).resize(resizeParams);
                resizedImage.jpeg({ mozjpeg: true }).toBuffer().then(buffer => {
                    res.send(buffer);
                    fileHandler.close();
                });
            } else {
                res.send(file);
                fileHandler.close();
            }
        });
    });
});

export default router;
