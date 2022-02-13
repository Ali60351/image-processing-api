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
const index_1 = __importDefault(require("../../../index"));
const supertest_1 = __importDefault(require("supertest"));
const request = (0, supertest_1.default)(index_1.default);
describe('Image Processing API tests', () => {
    const route = '/api/image';
    it('Checks availability of route', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(route);
        expect(response.statusCode).not.toBe(404);
    }));
    it('returns 400 if no params provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield request.get(route).expect(400);
    }));
    it('returns 404 if invalid image provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield request.get(route).query({ filename: 'missing.jpg' }).expect(404);
    }));
    describe('Tests with valid image', () => {
        it('returns 200 if valid image provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get(route).query({ filename: 'fjord.jpg' }).expect(200);
        }));
        it('returns jpeg content type if valid image jpeg provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get(route).query({ filename: 'fjord.jpg' }).expect('Content-Type', 'image/jpeg');
        }));
        it('returns png content type if valid image png provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get(route).query({ filename: '685929.png' }).expect('Content-Type', 'image/png');
        }));
        describe('Test with valid resize params', () => {
            it('returns 200 if valid height and width given', () => __awaiter(void 0, void 0, void 0, function* () {
                yield request.get(route).query({ filename: 'fjord.jpg', h: '200', w: '200' }).expect(200);
            }));
            it('returns png file if valid conversion params given', () => __awaiter(void 0, void 0, void 0, function* () {
                const queryParams = { filename: 'fjord.jpg', h: '200', w: '200', ext: 'png' };
                yield request.get(route).query(queryParams).expect(200).expect('Content-Type', 'image/png');
            }));
        });
        describe('Test with invalid resize params', () => {
            it('returns 400 if invalid height given', () => __awaiter(void 0, void 0, void 0, function* () {
                yield request.get(route).query({ filename: 'fjord.jpg', h: 'ABC', w: '200' }).expect(400);
            }));
            it('returns 400 if invalid width given', () => __awaiter(void 0, void 0, void 0, function* () {
                yield request.get(route).query({ filename: 'fjord.jpg', h: '200', w: 'ABC' }).expect(400);
            }));
            it('returns 400 if extension param given but resize params missing', () => __awaiter(void 0, void 0, void 0, function* () {
                yield request.get(route).query({ filename: 'fjord.jpg', ext: 'png' }).expect(400);
            }));
        });
    });
});
