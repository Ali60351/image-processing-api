import path from 'path';
import fs from 'fs';
import RequestError from './RequestError';

export const validatePath = (...filePath: string[]) => {
    const normalizedPath = path.join(...filePath);

    if (!fs.existsSync(normalizedPath)) {
        throw new RequestError(`${path.basename(normalizedPath)} is not available`, 404);
    }
};

export const validateNumber = (queryString: string) => {
    if (queryString !== queryString.trim()) {
        throw new RequestError(`${queryString} is not a valid number`, 400);
    }

    if (Number.isNaN(Number(queryString))) {
        throw new RequestError(`${queryString} is not a valid number`, 400);
    }
};
