import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

const mockGetCache = jest.fn();
const mockSetCache = jest.fn();

jest.mock('lru-cache', () => {
  return function () {
    return {
      get: () => mockGetCache(),
      set: () => mockSetCache(),
    };
  };
});

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    jest.resetAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /products', () => {
    it('products without cache', async () => {
      const response = await request(app.getHttpServer()).get('/products').expect(200);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(mockSetCache).toHaveBeenCalledTimes(1);
      expect(mockGetCache).toHaveBeenCalledTimes(2);
    });

    it('products with cache', async () => {
      const cachedProducts = [1, 2, 3, 4];
      mockGetCache.mockReturnValue(cachedProducts);
      const response = await request(app.getHttpServer()).get('/products').expect(200);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(cachedProducts);
      expect(mockSetCache).toHaveBeenCalledTimes(0);
      expect(mockGetCache).toHaveBeenCalledTimes(2);
    });
  });

  describe('GET /*', () => {
    it('products/id', () => {
      return request(app.getHttpServer())
        .get('/products/45965f1c-81c9-494d-88af-c7dc15c7b1b7')
        .expect(302)
        .expect('Location', `${process.env.PRODUCT_URL}/products/45965f1c-81c9-494d-88af-c7dc15c7b1b7`);
    });

    it('cart', () => {
      return request(app.getHttpServer()).get('/cart').expect(302).expect('Location', `${process.env.CART_URL}/cart`);
    });
  });

  describe('POST /*', () => {
    it('products', () => {
      return request(app.getHttpServer())
        .post('/products')
        .expect(302)
        .expect('Location', `${process.env.PRODUCT_URL}/products`);
    });
  });

  describe('PUT /*', () => {
    it('products', () => {
      return request(app.getHttpServer())
        .put('/products/45965f1c-81c9-494d-88af-c7dc15c7b1b7')
        .expect(302)
        .expect('Location', `${process.env.PRODUCT_URL}/products/45965f1c-81c9-494d-88af-c7dc15c7b1b7`);
    });
  });

  describe('DELETE /*', () => {
    it('products', () => {
      return request(app.getHttpServer())
        .delete('/products/45965f1c-81c9-494d-88af-c7dc15c7b1b7')
        .expect(302)
        .expect('Location', `${process.env.PRODUCT_URL}/products/45965f1c-81c9-494d-88af-c7dc15c7b1b7`);
    });
  });
});
