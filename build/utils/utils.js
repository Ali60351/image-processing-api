"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewFileDetails = exports.getResizeParams = exports.ensurePath = exports.validateExtension = exports.validateNumber = exports.getResizedFilename = exports.validatePath = exports.fileExists = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const RequestError_1 = __importDefault(require("./RequestError"));
const fileExists = (...filePath) => {
    const normalizedPath = path_1.default.join(...filePath);
    return fs_1.default.existsSync(normalizedPath);
};
exports.fileExists = fileExists;
const validatePath = (...filePath) => {
    const filename = filePath[filePath.length - 1];
    if (!(0, exports.fileExists)(...filePath)) {
        throw new RequestError_1.default(`${filename} is not available`, 404);
    }
    if (filePath[filePath.length - 1].split('.').length !== 2) {
        throw new RequestError_1.default(`${filename} is not a valid file name`, 404);
    }
};
exports.validatePath = validatePath;
const getResizedFilename = (filename, width, height, extension) => {
    return `${filename}-${width}-${height}.${extension}`;
};
exports.getResizedFilename = getResizedFilename;
const validateNumber = (queryString) => {
    if (queryString !== queryString.trim()) {
        throw new RequestError_1.default(`${queryString} is not a valid number`, 400);
    }
    if (Number.isNaN(Number(queryString))) {
        throw new RequestError_1.default(`${queryString} is not a valid number`, 400);
    }
};
exports.validateNumber = validateNumber;
const validateExtension = (extension) => {
    if (['jpg', 'jpeg', 'png'].includes(extension)) {
        return;
    }
    throw new RequestError_1.default(`${extension} extension type is not supported`, 400);
};
exports.validateExtension = validateExtension;
const ensurePath = (path) => {
    if (fs_1.default.existsSync(path)) {
        return;
    }
    else {
        fs_1.default.mkdirSync(path, { recursive: true });
    }
};
exports.ensurePath = ensurePath;
const getResizeParams = (queryParams) => {
    let resizeParams = null;
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
exports.getResizeParams = getResizeParams;
const getNewFileDetails = (filename, extension) => {
    const fileDetails = filename.split('.');
    const name = fileDetails[0];
    let fileExtension = extension || fileDetails[1];
    if (fileExtension === 'jpg') {
        fileExtension = 'jpeg';
    }
    return { name, extension: fileExtension };
};
exports.getNewFileDetails = getNewFileDetails;
