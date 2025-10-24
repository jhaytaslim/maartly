import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.APP_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Performance
  app.use(compression());
  app.use(cookieParser());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API Prefix
  app.setGlobalPrefix('api/v1');

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Cognistock API')
    .setDescription('Smart Sales. Simple Control. - API Documentation')
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('tenants', 'Tenant management')
    .addTag('products', 'Product management')
    .addTag('orders', 'Order management')
    .addTag('inventory', 'Inventory management')
    .addTag('payments', 'Payment processing')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`
    🚀 Cognistock Backend is running!
    📡 API: http://localhost:${port}/api/v1
    📚 Docs: http://localhost:${port}/api/docs
    🌍 Environment: ${process.env.NODE_ENV}
  `);
}

bootstrap();
