import path from 'path';
import { existsSync, promises as fs } from 'fs';
import { Router, Request, Response } from 'express';

import { ensurePath, getNewFileDetails, getResizedFilename, getResizeParams, ImageProcessor, logger } from '../../utils';
import { ResizeQueryParams } from '../../types';
import { resizeRequestValidator } from './middlewares';

const router = Router();

router.get('/image', resizeRequestValidator, async (req: Request, res: Response): Promise<void> => {
    const queryParams: ResizeQueryParams = {
        filename: String(req.query.filename),
        width: req.query.w ? Number(req.query.w) : null,
        height: req.query.h ? Number(req.query.h) : null,
        extension: req.query.ext as string | undefined,
    };

    const { filename } = queryParams;
    const filePath = path.join('./images', queryParams.filename);

    const resizeParams = getResizeParams(queryParams);

    if (!resizeParams) {
        logger.success('No resizing required for', filePath);
        res.sendFile(path.resolve(filePath));
        return;
    }

    const fileHandler = await fs.open(filePath, 'r');
    const file = await fileHandler.readFile();

    ensurePath('./images/resized');

    const { name, extension } = getNewFileDetails(filename, queryParams.extension);
    const { width, height } = resizeParams;

    const resizedFilename = getResizedFilename(name, width, height, extension);
    const resizedFilePath = path.join('./images/resized', resizedFilename);

    res.type(extension === 'png' ? 'image/png' : 'image/jpeg');

    if (existsSync(resizedFilePath)) {
        logger.success('Using cached file for', resizedFilename);
        res.sendFile(path.resolve(resizedFilePath));
        fileHandler.close();
    } else {
        const imageProcessor = new ImageProcessor(file, resizeParams, resizedFilePath, extension);
        await imageProcessor.processImage();

        logger.success('Using new file for', resizedFilename);
        res.sendFile(path.resolve(resizedFilePath));
        fileHandler.close();
    }
});

export default router;
