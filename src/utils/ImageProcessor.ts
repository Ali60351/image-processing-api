import sharp from 'sharp';
import { promises as fs } from 'fs';

import { ResizeOptions } from '../types';
import logger from './Logger';

class ImageProcessor {
    readonly resizeParams: ResizeOptions;
    readonly imageBuffer: Buffer;
    readonly extension: string;
    readonly destination: string;

    constructor(file: Buffer, resizeParams: ResizeOptions, destination: string, extension?: string) {
        this.resizeParams = resizeParams;
        this.imageBuffer = file;
        this.extension = extension || 'jpeg';
        this.destination = destination;
    }

    processImage = (): Promise<void> => new Promise((
        resolve: () => void, reject: (message: string) => void
    ) => {
        try {
            let resizedImage: sharp.Sharp;

            if (this.extension === 'png') {
                resizedImage = sharp(this.imageBuffer).resize(this.resizeParams).png();
            } else {
                resizedImage = sharp(this.imageBuffer).resize(this.resizeParams).jpeg({ mozjpeg: true });
            }

            resizedImage.toBuffer().then(buffer => {
                fs.writeFile(this.destination, buffer).then(resolve);
            });
        } catch (e: unknown) {
            const errorMessage = `Unexpected error occurred while converting ${this.destination}`;

            if (e instanceof Error) {
                logger.error(errorMessage, e.message);
            }

            reject(errorMessage);
        }
    });
}

export default ImageProcessor;
