import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /*', () => {
    it('products', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(302)
        .expect('Location', `${process.env.PRODUCT_URL}/products`);
    });

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
