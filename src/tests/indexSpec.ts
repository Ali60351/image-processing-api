import app from '../index';
import { default as request } from 'supertest';

describe('Basic server tests', () => {
    it('Checks if server is running', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
    });
});
