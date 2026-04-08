import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function setupApp(app: INestApplication) {
  // Global validation pipe — strips unknown properties, validates DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://bxtrack-frontend-omega.vercel.app',
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
}

// For local development
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await setupApp(app);
  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 Backend running at http://localhost:${port}`);
  console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
}

// For Vercel deployment
let cachedApp: any;
export default async (req: any, res: any) => {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    await setupApp(app);
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp(req, res);
};

// Only run bootstrap if not in Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  bootstrap();
}
