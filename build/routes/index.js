"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = __importDefault(require("./api"));
const routes = [
    api_1.default
];
const router = (0, express_1.Router)();
routes.map(route => {
    router.use(route);
});
exports.default = router;
