import path from 'path';
import fs from 'fs';
import RequestError from './RequestError';

export const fileExists = (...filePath: string[]) => {
    const normalizedPath = path.join(...filePath);
    return fs.existsSync(normalizedPath);
};

export const validatePath = (...filePath: string[]) => {
    if (!fileExists(...filePath)) {
        const filename = filePath[filePath.length - 1];
        throw new RequestError(`${filename} is not available`, 404);
    }
};

export const getResizedFilename = (
    filename: string, width: string | number, height: string | number, extension: string
) => {
    return `${filename}-${width}-${height}.${extension}`;
};

export const validateNumber = (queryString: string) => {
    if (queryString !== queryString.trim()) {
        throw new RequestError(`${queryString} is not a valid number`, 400);
    }

    if (Number.isNaN(Number(queryString))) {
        throw new RequestError(`${queryString} is not a valid number`, 400);
    }
};

export const ensurePath = (path: string) => {
    if (fs.existsSync(path)) {
        return;
    } else {
        fs.mkdirSync(path, { recursive: true });
    }
};
