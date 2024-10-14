import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter.ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable API versioning with URI strategy
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove properties not in DTOs
      forbidNonWhitelisted: true, // Throw error if extra properties are provided
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Apply the global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000; // Fallback to port 3000 if not defined

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription(
      'This API handles user authentication including signup, signin, and user management. It provides JWT-based authentication and ensures secure password storage with bcrypt hashing.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
