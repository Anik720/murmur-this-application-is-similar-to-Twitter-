import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws if unknown properties exist
      transform: true, // auto-transforms input to DTO class instances
    }),
  );
  
  // ミドルウェアの設定
  app.use(helmet());
  app.use(cors());
  
  await app.listen(3001);
  console.log('Example app listening on port 3001!');
}
bootstrap();
