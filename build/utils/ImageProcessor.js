"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = require("fs");
const Logger_1 = __importDefault(require("./Logger"));
class ImageProcessor {
    constructor(file, resizeParams, destination, extension) {
        this.processImage = () => new Promise((resolve, reject) => {
            try {
                let resizedImage;
                if (this.extension === 'png') {
                    resizedImage = (0, sharp_1.default)(this.imageBuffer).resize(this.resizeParams).png();
                }
                else {
                    resizedImage = (0, sharp_1.default)(this.imageBuffer).resize(this.resizeParams).jpeg({ mozjpeg: true });
                }
                resizedImage.toBuffer().then(buffer => {
                    fs_1.promises.writeFile(this.destination, buffer).then(resolve);
                });
            }
            catch (e) {
                const errorMessage = `Unexpected error occurred while converting ${this.destination}`;
                if (e instanceof Error) {
                    Logger_1.default.error(errorMessage, e.message);
                }
                reject(errorMessage);
            }
        });
        this.resizeParams = resizeParams;
        this.imageBuffer = file;
        this.extension = extension || 'jpeg';
        this.destination = destination;
    }
}
exports.default = ImageProcessor;
