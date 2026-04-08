import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe — strips unknown properties, validates DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS for frontend dev
  app.enableCors({
    origin: [
      'http://localhost:3000',
      process.env.FRONTEND_URL ?? 'http://localhost:3000',
    ],
    credentials: true,
  });

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Multi-Tenant CRM API')
    .setDescription(
      'Production-quality CRM system with multi-tenant isolation, JWT auth, and concurrency-safe customer assignment.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 Backend running at http://localhost:${port}`);
  console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
}

void bootstrap();
