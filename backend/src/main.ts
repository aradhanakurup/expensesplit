import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  // Security middleware
  app.use(helmet());

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // CORS
  app.enableCors();

  // Health check
  app.get('/health', () => ({ status: 'ok' }));

  await app.listen(port);
  console.log(`ExpenseSplit API running on http://localhost:${port}`);
}

bootstrap();
