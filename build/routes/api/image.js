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
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const express_1 = require("express");
const utils_1 = require("../../utils");
const middlewares_1 = require("./middlewares");
const router = (0, express_1.Router)();
router.get('/image', middlewares_1.resizeRequestValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryParams = {
        filename: String(req.query.filename),
        width: req.query.w ? Number(req.query.w) : null,
        height: req.query.h ? Number(req.query.h) : null,
        extension: req.query.ext,
    };
    const { filename } = queryParams;
    const filePath = path_1.default.join('./images', queryParams.filename);
    const resizeParams = (0, utils_1.getResizeParams)(queryParams);
    if (!resizeParams) {
        utils_1.logger.success('No resizing required for', filePath);
        res.sendFile(path_1.default.resolve(filePath));
        return;
    }
    const fileHandler = yield fs_1.promises.open(filePath, 'r');
    const file = yield fileHandler.readFile();
    (0, utils_1.ensurePath)('./images/resized');
    const { name, extension } = (0, utils_1.getNewFileDetails)(filename, queryParams.extension);
    const { width, height } = resizeParams;
    const resizedFilename = (0, utils_1.getResizedFilename)(name, width, height, extension);
    const resizedFilePath = path_1.default.join('./images/resized', resizedFilename);
    res.type(extension === 'png' ? 'image/png' : 'image/jpeg');
    if ((0, fs_1.existsSync)(resizedFilePath)) {
        utils_1.logger.success('Using cached file for', resizedFilename);
        res.sendFile(path_1.default.resolve(resizedFilePath));
        fileHandler.close();
    }
    else {
        const imageProcessor = new utils_1.ImageProcessor(file, resizeParams, resizedFilePath, extension);
        yield imageProcessor.processImage();
        utils_1.logger.success('Using new file for', resizedFilename);
        res.sendFile(path_1.default.resolve(resizedFilePath));
        fileHandler.close();
    }
}));
exports.default = router;
