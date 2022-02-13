import app from '../../../index';
import supertest  from 'supertest';

const request = supertest(app);

describe('Image Processing API tests', () => {
    const route = '/api/image';

    it('Checks availability of route', async () => {
        const response = await request.get(route);
        expect(response.statusCode).not.toBe(404);
    });

    it('Checks if server returns 400 if no params provided', async () => {
        const response = await request.get(route);
        expect(response.statusCode).toBe(400);
    });
});
