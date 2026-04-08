"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function setupApp(app) {
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: [
            'http://localhost:3000',
            process.env.FRONTEND_URL ?? 'http://localhost:3000',
        ],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Multi-Tenant CRM API')
        .setDescription('Production-quality CRM system with multi-tenant isolation, JWT auth, and concurrency-safe customer assignment.')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await setupApp(app);
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🚀 Backend running at http://localhost:${port}`);
    console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
}
let cachedApp;
exports.default = async (req, res) => {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        await setupApp(app);
        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }
    return cachedApp(req, res);
};
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    bootstrap();
}
//# sourceMappingURL=main.js.map