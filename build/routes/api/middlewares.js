"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeRequestValidator = void 0;
const utils_1 = require("../../utils");
const resizeRequestValidator = (req, res, next) => {
    const supportedParams = ['filename', 'w', 'h', 'ext'];
    const requiredParams = ['filename'];
    const queryParams = Object.assign({}, req.query);
    const paramValidators = {
        filename: (filePath) => (0, utils_1.validatePath)('./images', filePath),
        w: utils_1.validateNumber,
        h: utils_1.validateNumber,
        ext: utils_1.validateExtension
    };
    try {
        supportedParams.forEach(key => {
            const queryParam = queryParams[key];
            if (!queryParam) {
                if (requiredParams.includes(key)) {
                    throw new utils_1.RequestError(`${key} is missing in query params`, 400);
                }
                else {
                    return;
                }
            }
            if (typeof queryParam !== 'string') {
                throw new utils_1.RequestError(`${key} is of invalid type`, 400);
            }
            const validator = paramValidators[key];
            validator(queryParam);
        });
        if (queryParams.ext && !(queryParams.w && queryParams.h)) {
            throw new utils_1.RequestError('Type conversion requires resizing too', 400);
        }
        next();
    }
    catch (e) {
        if (e instanceof utils_1.RequestError) {
            utils_1.logger.warn('Input:', queryParams, e.message);
            res.status(e.status).json({ error: e.message });
        }
        else if (e instanceof Error) {
            utils_1.logger.error('Input:', queryParams, e.message);
            res.status(500).json({ error: 'Unexpected error', message: e.message });
        }
        else {
            console.error(e);
        }
        res.end();
    }
};
exports.resizeRequestValidator = resizeRequestValidator;
