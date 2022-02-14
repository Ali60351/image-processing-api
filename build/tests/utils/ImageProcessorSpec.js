"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const fs_1 = __importStar(require("fs"));
describe('Image Processing Tests', () => __awaiter(void 0, void 0, void 0, function* () {
    let imageProcessor;
    const filePath = './images/955301.jpeg';
    const destination = './images/resized/955301-1920-1080.jpeg';
    const resizeOptions = {
        fit: 'fill',
        width: 1920,
        height: 1080,
    };
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        if (fs_1.default.existsSync('./images/resized')) {
            yield fs_1.promises.rmdir('./images/resized', { recursive: true });
        }
        (0, utils_1.ensurePath)('./images/resized');
        imageProcessor = new utils_1.ImageProcessor(filePath, resizeOptions, destination);
    }));
    it('tests if processing succeeds', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(imageProcessor.processImage).not.toThrow();
    }));
    it('tests if new file is created', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(fs_1.default.existsSync(destination)).toBe(false);
        yield imageProcessor.processImage();
        expect(fs_1.default.existsSync(destination)).toBe(true);
    }));
}));
