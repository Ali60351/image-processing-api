import app from '../../../index';
import supertest  from 'supertest';

const request = supertest(app);

describe('Image Processing API tests', () => {
    const route = '/api/image';

    it('Checks availability of route', async () => {
        const response = await request.get(route);
        expect(response.statusCode).not.toBe(404);
    });

    it('returns 400 if no params provided', async () => {
        await request.get(route).expect(400);
    });

    it('returns 404 if invalid image provided', async () => {
        await request.get(route).query({ filename: 'missing.jpg' }).expect(404);
    });

    describe('Tests with valid image', () => {
        it('returns 200 if valid image provided', async () => {
            await request.get(route).query({ filename: 'fjord.jpg' }).expect(200);
        });

        it('returns jpeg content type if valid image jpeg provided', async () => {
            await request.get(route).query({ filename: 'fjord.jpg' }).expect('Content-Type', 'image/jpeg');
        });

        it('returns png content type if valid image png provided', async () => {
            await request.get(route).query({ filename: '685929.png' }).expect('Content-Type', 'image/png');
        });

        describe('Test with valid resize params', () => {
            it('returns 200 if valid height and width given', async () => {
                await request.get(route).query({ filename: 'fjord.jpg', h: '200', w: '200' }).expect(200);
            });

            it('returns png file if valid conversion params given', async () => {
                const queryParams = { filename: 'fjord.jpg', h: '200', w: '200', ext: 'png' };
                await request.get(route).query(queryParams).expect(200).expect('Content-Type', 'image/png');
            });
        });

        describe('Test with invalid resize params', () => {
            it('returns 400 if invalid height given', async () => {
                await request.get(route).query({ filename: 'fjord.jpg', h: 'ABC', w: '200' }).expect(400);
            });

            it('returns 400 if invalid width given', async () => {
                await request.get(route).query({ filename: 'fjord.jpg', h: '200', w: 'ABC' }).expect(400);
            });

            it('returns 400 if extension param given but resize params missing', async () => {
                await request.get(route).query({ filename: 'fjord.jpg', ext: 'png' }).expect(400);
            });
        });
    });
});
