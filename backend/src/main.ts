import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RequestContextService } from './common/services/request-context.service';
import { GlobalExceptionFilter } from './common/exceptions/HttpExceptionHandler';
import { AppLogger } from './common/services/logger.service';
import { AppDataSource } from 'src/data-sourse';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(AppLogger)));
  app.enableCors({ origin: true , credentials: true });
  app.use(cookieParser());
  const contextService = app.get(RequestContextService);
  app.use((req, res, next) => contextService.run(req.user, () => next()));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
// index.ts

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    // Here you can start using your entities to query the database
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
