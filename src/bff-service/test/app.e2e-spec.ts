import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as nock from 'nock';
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

  afterEach(() => {
    nock.restore();
  });

  describe('GET /products', () => {
    it('products without cache', async () => {
      const products = [2, 3];
      const req = nock(process.env.PRODUCT_URL).get('/products').reply(200, products);

      const response = await request(app.getHttpServer()).get('/products').expect(200);

      expect(response.body).toEqual(products);
      expect(req.isDone()).toBeTruthy();

      expect(mockSetCache).toHaveBeenCalledTimes(1);
      expect(mockGetCache).toHaveBeenCalledTimes(1);
    });

    it('products with cache', async () => {
      const cachedProducts = [1, 2, 3];
      const req = nock(process.env.PRODUCT_URL).get('/products').reply(200, [4, 5]);
      mockGetCache.mockReturnValue(cachedProducts);
      const response = await request(app.getHttpServer()).get('/products').expect(200);

      expect(response.body).toEqual(cachedProducts);
      expect(req.isDone()).toBeFalsy();
      expect(mockSetCache).toHaveBeenCalledTimes(0);
      expect(mockGetCache).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /*', () => {
    it('products/id', () => {
      request(app.getHttpServer())
        .get('/products/45965f1c-81c9-494d-88af-c7dc15c7b1b7')
        .expect(302)
        .expect('Location', `${process.env.PRODUCT_URL}/products/45965f1c-81c9-494d-88af-c7dc15c7b1b7`);
    });

    it('cart', () => {
      request(app.getHttpServer()).get('/cart').expect(302).expect('Location', `${process.env.CART_URL}/cart`);
    });
  });

  describe('POST /*', () => {
    it('products', () => {
      request(app.getHttpServer())
        .post('/products')
        .expect(302)
        .expect('Location', `${process.env.PRODUCT_URL}/products`);
    });
  });

  describe('PUT /*', () => {
    it('products', () => {
      request(app.getHttpServer())
        .put('/products/45965f1c-81c9-494d-88af-c7dc15c7b1b7')
        .expect(302)
        .expect('Location', `${process.env.PRODUCT_URL}/products/45965f1c-81c9-494d-88af-c7dc15c7b1b7`);
    });
  });

  describe('DELETE /*', () => {
    it('products', () => {
      request(app.getHttpServer())
        .delete('/products/45965f1c-81c9-494d-88af-c7dc15c7b1b7')
        .expect(302)
        .expect('Location', `${process.env.PRODUCT_URL}/products/45965f1c-81c9-494d-88af-c7dc15c7b1b7`);
    });
  });
});
