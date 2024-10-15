import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import helmet from 'helmet';
import { join } from 'path';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());

  // Enable CORS with dynamic origins
  app.enableCors({
    origin: configService.get<string>('ALLOWED_ORIGINS').split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove properties not in DTOs
      forbidNonWhitelisted: true, // Throw error if extra properties are provided
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = configService.get<number>('PORT') || 3000;

  const config = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription(
      'This API handles user authentication including signup, signin, and user management. It provides JWT-based authentication and ensures secure password storage with bcrypt hashing.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Serve static files from the dist/public folder
  app.use(express.static(join(__dirname, 'public')));

  // Handle client-side routing fallback
  app.use('*', (req, res, next) => {
    if (
      req.originalUrl.startsWith('/api') ||
      req.originalUrl.startsWith('/health-check')
    ) {
      // If the request is for an API endpoint, proceed to the next handler (don't serve index.html)
      next();
    } else {
      // For any other route, serve index.html (fallback for client-side routing)
      res.sendFile(join(__dirname, 'public', 'index.html'));
    }
  });

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
