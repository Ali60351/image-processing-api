"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = require("fs");
const Logger_1 = __importDefault(require("./Logger"));
class ImageProcessor {
    constructor(filePath, resizeParams, destination, extension) {
        this.getImageBuffer = () => __awaiter(this, void 0, void 0, function* () {
            const fileHandler = yield fs_1.promises.open(this.filePath, 'r');
            const imageBuffer = yield fileHandler.readFile();
            fileHandler.close();
            return imageBuffer;
        });
        this.saveImage = (resizedImage) => __awaiter(this, void 0, void 0, function* () {
            const buffer = yield resizedImage.toBuffer();
            yield fs_1.promises.writeFile(this.destination, buffer);
            return;
        });
        this.processImage = () => new Promise((resolve, reject) => {
            try {
                let resizedImage;
                this.getImageBuffer().then(imageBuffer => {
                    if (this.extension === 'png') {
                        resizedImage = (0, sharp_1.default)(imageBuffer).resize(this.resizeParams).png();
                    }
                    else {
                        resizedImage = (0, sharp_1.default)(imageBuffer).resize(this.resizeParams).jpeg({ mozjpeg: true });
                    }
                    this.saveImage(resizedImage).then(resolve);
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
        this.filePath = filePath;
        this.extension = extension || 'jpeg';
        this.destination = destination;
    }
}
exports.default = ImageProcessor;
