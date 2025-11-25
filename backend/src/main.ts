import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

import { Request, Response } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.get("/health", (_req: Request, res: Response) => {
    res.status(200).send("OK");
  });

  // Security headers
  app.use(helmet());

  // Allowed origins (expandable)
  const allowedOrigins = [
    process.env.APP_URL || "http://localhost:5173",
    "http://localhost:3001",
    "http://127.0.0.1:5173",
  ];

  console.log("🟢 CORS allowed origins:", allowedOrigins);

  // Dynamic CORS configuration
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow REST tools / curl
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked request from: ${origin}`);
        callback(
          new Error(`CORS policy: ${origin} not allowed by server`),
          false
        );
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Performance middlewares
  app.use(compression());
  app.use(cookieParser());

  // Global filters and pipes
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Prefix and Swagger
  app.setGlobalPrefix("api/v1");

  const config = new DocumentBuilder()
    .setTitle("Maartly API")
    .setDescription("Smart Sales. Simple Control. - API Documentation")
    .setVersion("2.0")
    .addBearerAuth()
    .addTag("auth", "Authentication endpoints")
    .addTag("users", "User management")
    .addTag("tenants", "Tenant management")
    .addTag("products", "Product management")
    .addTag("orders", "Order management")
    .addTag("inventory", "Inventory management")
    .addTag("payments", "Payment processing")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // Start server
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`
    🚀 Maartly Backend is running!
    📡 API: http://localhost:${port}/api/v1
    📚 Docs: http://localhost:${port}/api/docs
    🌍 Environment: ${process.env.NODE_ENV || "development"}
  `);
}

bootstrap();
