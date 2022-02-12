import path from 'path';
import sharp from 'sharp';
import { existsSync, promises as fs } from 'fs';
import { Router, Request, Response, NextFunction } from 'express';

import { ensurePath, getResizedFilename, RequestError, validateExtension, validateNumber, validatePath } from '../../utils';
import { ResizeOptions } from '../../types';

const router = Router();

const requestValidator = (req: Request, res: Response, next: NextFunction) => {
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

router.get('/image', requestValidator, async (req, res) => {
    const queryParams = {
        filename: String(req.query.filename),
        width: req.query.w ? Number(req.query.w) : null,
        height: req.query.h ? Number(req.query.h) : null,
        extension: (req.query.ext as string | undefined)
    };

    const { filename } = queryParams;
    const filePath = path.join('./images', queryParams.filename);

    let resizeParams: ResizeOptions | null = null;

    if (queryParams.width && queryParams.height) {
        const { width, height } = queryParams;

        resizeParams = {
            fit: 'fill',
            width: width,
            height: height,
        };
    }

    if (!resizeParams) {
        res.sendFile(path.resolve(filePath));
        return;
    }

    const fileHandler = await fs.open(filePath, 'r');
    const file = await fileHandler.readFile();

    ensurePath('./images/resized');

    const fileDetails = filename.split('.');

    const name = fileDetails[0];
    let extension = queryParams.extension ||  fileDetails[1];

    if (extension === 'jpg') {
        extension = 'jpeg';
    }

    const { width, height } = resizeParams;

    const resizedFilename = getResizedFilename(name, width, height, extension);
    const resizedFilePath = path.join('./images/resized', resizedFilename);

    res.type(extension === 'png' ? 'image/png' : 'image/jpeg');

    if (existsSync(resizedFilePath)) {
        res.sendFile(path.resolve(resizedFilePath));
        fileHandler.close();
    } else {
        let resizedImage: sharp.Sharp;

        if (extension === 'png') {
            resizedImage = sharp(file).resize(resizeParams).png();
        } else {
            resizedImage = sharp(file).resize(resizeParams).jpeg({ mozjpeg: true });
        }

        const buffer = await resizedImage.toBuffer();

        fs.writeFile(resizedFilePath, buffer).then(() => {
            res.sendFile(path.resolve(resizedFilePath));
            fileHandler.close();
        });
    }
});

export default router;
