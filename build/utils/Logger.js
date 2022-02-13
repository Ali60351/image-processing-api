"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor() {
        this.log = (color = chalk_1.default.black, messages) => {
            if (process.env.NODE_ENV === 'test') {
                return;
            }
            const processedMessages = messages.map(message => {
                if (typeof message === 'string') {
                    return color(message);
                }
                else {
                    return message;
                }
            });
            console.log(...processedMessages, '-', new Date().toString().split('GMT')[0]);
        };
        this.info = (...messages) => {
            this.log(chalk_1.default.blueBright, messages);
        };
        this.success = (...messages) => {
            this.log(chalk_1.default.green, messages);
        };
        this.warn = (...messages) => {
            this.log(chalk_1.default.yellowBright, messages);
        };
        this.error = (...messages) => {
            this.log(chalk_1.default.redBright, messages);
        };
    }
}
exports.default = new Logger();
