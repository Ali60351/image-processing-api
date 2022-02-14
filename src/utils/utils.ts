import path from 'path';
import fs from 'fs';
import RequestError from './RequestError';
import { FileDetails, ResizeOptions, ResizeQueryParams } from '../types';

export const fileExists = (...filePath: string[]) => {
    const normalizedPath = path.join(...filePath);
    return fs.existsSync(normalizedPath);
};

export const validatePath = (...filePath: string[]): void => {
    const filename = filePath[filePath.length - 1];

    if (!fileExists(...filePath)) {
        throw new RequestError(`${filename} is not available`, 404);
    }

    if (filePath[filePath.length - 1].split('.').length !== 2) {
        throw new RequestError(`${filename} is not a valid file name`, 404);
    }
};

export const getResizedFilename = (
    filename: string,
    width: string | number,
    height: string | number,
    extension: string
): string => {
    return `${filename}-${width}-${height}.${extension}`;
};

export const validateNumber = (queryString: string): void => {
    if (queryString !== queryString.trim()) {
        throw new RequestError(`${queryString} is not a valid number`, 400);
    }

    if (Number.isNaN(Number(queryString))) {
        throw new RequestError(`${queryString} is not a valid number`, 400);
    }
};

export const validateExtension = (extension: string): void => {
    if (['jpg', 'jpeg', 'png'].includes(extension)) {
        return;
    }

    throw new RequestError(`${extension} extension type is not supported`, 400);
};

export const ensurePath = (path: string): void => {
    if (fs.existsSync(path)) {
        return;
    } else {
        fs.mkdirSync(path, { recursive: true });
    }
};

export const getResizeParams = (queryParams: ResizeQueryParams): ResizeOptions | null => {
    let resizeParams: ResizeOptions | null = null;

    if (queryParams.width && queryParams.height) {
        const { width, height } = queryParams;

        resizeParams = {
            fit: 'fill',
            width: width,
            height: height,
        };
    }

    return resizeParams;
};

export const getNewFileDetails = (filename: string, extension: string | undefined): FileDetails => {
    const fileDetails = filename.split('.');

    const name = fileDetails[0];
    let fileExtension = extension || fileDetails[1];

    if (fileExtension === 'jpg') {
        fileExtension = 'jpeg';
    }

    return { name, extension: fileExtension };
};
