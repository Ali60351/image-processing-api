import { ensurePath, ImageProcessor } from '../../utils';
import fs, { promises as fsPromises } from 'fs';
import { ResizeOptions } from '../../types';

describe('Image Processing Tests', async () => {
    let imageProcessor: ImageProcessor;

    const filePath = './images/955301.jpeg';
    const destination = './images/resized/955301-1920-1080.jpeg';
    const resizeOptions: ResizeOptions = {
        fit: 'fill',
        width: 1920,
        height: 1080,
    };

    beforeEach(async () => {
        if (fs.existsSync('./images/resized')) {
            await fsPromises.rmdir('./images/resized', { recursive: true });
        }

        ensurePath('./images/resized');
        imageProcessor = new ImageProcessor(filePath, resizeOptions, destination);
    });

    it('tests if processing succeeds', async () => {
        expect(imageProcessor.processImage).not.toThrow();
    });

    it('tests if new file is created', async () => {
        expect(fs.existsSync(destination)).toBe(false);
        await imageProcessor.processImage();
        expect(fs.existsSync(destination)).toBe(true);
    });
});
