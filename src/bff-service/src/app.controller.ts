import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

function getRedirectUrl(params: Record<string, string>, query: Record<string, string>): string | undefined {
  const SERVICE_URLS = {
    products: process.env.PRODUCT_URL,
    import: process.env.IMPORT_URL,
    cart: process.env.CART_URL,
  };

  const [path] = Object.values(params);
  if (typeof path === 'string') {
    const service = Object.keys(SERVICE_URLS).find((s) => path.startsWith(s));
    if (service) {
      const pathSuffix = path.startsWith('/') ? path.substring(path.indexOf('/')) : '/' + path;
      const search = new URLSearchParams(query);
      return SERVICE_URLS[service] + pathSuffix + (search.toString() ? '?' + search : '');
    }
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/*')
  @Redirect()
  getProducts(@Param() params, @Query() query) {
    const url = getRedirectUrl(params, query);
    if (url) {
      return { url };
    }

    throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
  }

  @Put('/*')
  @Redirect()
  updateProducts(@Param() params, @Query() query) {
    const url = getRedirectUrl(params, query);
    if (url) {
      return { url };
    }

    throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
  }

  @Post('/*')
  @Redirect()
  createProducts(@Param() params, @Query() query) {
    const url = getRedirectUrl(params, query);
    if (url) {
      return { url };
    }

    throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
  }

  @Delete('/*')
  @Redirect()
  deleteProducts(@Param() params, @Query() query) {
    const url = getRedirectUrl(params, query);
    if (url) {
      return { url };
    }

    throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
  }
}
