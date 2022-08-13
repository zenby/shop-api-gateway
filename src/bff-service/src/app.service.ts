import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as LRU from 'lru-cache';

const cache = new LRU({
  ttl: 1000 * 60 * 2, // 2 min
});

const PRODUCTS_CACHE_KEY = 'products_cache_key';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getProducts(): Promise<unknown[]> {
    if (!cache.get(PRODUCTS_CACHE_KEY)) {
      const { data } = await axios(`${process.env.PRODUCT_URL}/products`);
      cache.set(PRODUCTS_CACHE_KEY, data);
    }

    return cache.get(PRODUCTS_CACHE_KEY);
  }
}
