import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,POST,DELETE',
  preflightContinue: false,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
