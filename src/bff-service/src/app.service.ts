import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as LRU from 'lru-cache';

const cache = new LRU({
  ttl: 1000 * 60 * 2, // 2 min time to live
});

const PRODUCTS_CACHE_KEY = 'products_cache_key';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getProducts(): Promise<unknown[]> {
    let products: unknown[] = cache.get(PRODUCTS_CACHE_KEY);
    if (!products) {
      const { data } = await axios(`${process.env.PRODUCT_URL}/products`);
      products = data;
      cache.set(PRODUCTS_CACHE_KEY, products);
    }

    return products;
  }
}
