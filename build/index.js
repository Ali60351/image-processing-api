"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const port = 3000;
app.use(routes_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to image processing API',
        availableEndpoints: [
            '/image/api'
        ]
    });
});
app.listen(port, () => {
    utils_1.logger.info(`Image processing API enabled on http://localhost:${port}`);
});
exports.default = app;
