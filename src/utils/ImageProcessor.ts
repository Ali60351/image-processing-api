import sharp from 'sharp';
import { promises as fs } from 'fs';

import { ResizeOptions } from '../types';
import logger from './Logger';

class ImageProcessor {
    readonly resizeParams: ResizeOptions;
    readonly filePath: string;
    readonly extension: string;
    readonly destination: string;

    constructor(filePath: string, resizeParams: ResizeOptions, destination: string, extension?: string) {
        this.resizeParams = resizeParams;
        this.filePath = filePath;
        this.extension = extension || 'jpeg';
        this.destination = destination;
    }

    getImageBuffer = async (): Promise<Buffer> => {
        const fileHandler = await fs.open(this.filePath, 'r');
        const imageBuffer = await fileHandler.readFile();

        fileHandler.close();

        return imageBuffer;
    };

    saveImage = async (resizedImage: sharp.Sharp): Promise<void> => {
        const buffer = await resizedImage.toBuffer();
        await fs.writeFile(this.destination, buffer);
        return;
    };

    processImage = (): Promise<void> => new Promise((
        resolve: () => void, reject: (message: string) => void
    ) => {
        try {
            let resizedImage: sharp.Sharp;

            this.getImageBuffer().then(imageBuffer => {
                if (this.extension === 'png') {
                    resizedImage = sharp(imageBuffer).resize(this.resizeParams).png();
                } else {
                    resizedImage = sharp(imageBuffer).resize(this.resizeParams).jpeg({ mozjpeg: true });
                }

                this.saveImage(resizedImage).then(resolve);
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
