import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CatModule } from './cat.module';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(CatModule);
  app.setGlobalPrefix('api');
  //app.useGlobalFilters(new GlobalErrorFilter());
  
  await app.init();
  return app;
}
