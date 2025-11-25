// test/integration/auth.e2e-spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { MongoMemoryServer } from "mongodb-memory-server";
import { PrismaService } from "../../src/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { CreateTenantDto } from "../../src/auth/dtos/create-tenant.dto";
import { $Enums } from "@prisma/client";
import { execSync } from "child_process";

jest.setTimeout(60000); // 60s per test

describe("Auth (e2e)", () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let prisma: PrismaService;
  let mongoUri: string;

  beforeAll(async () => {
    // Start in-memory MongoDB (standalone with directConnection for Prisma)
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: "cognistock_test",
      },
      binary: {
        version: "6.0.5",
      },
    });
    // Get base URI and add directConnection=true to bypass replica set requirement
    let baseUri = mongod.getUri();
    if (!baseUri.includes("?")) {
      baseUri += "?";
    } else {
      baseUri += "&";
    }
    mongoUri = `${baseUri}directConnection=true`;
    process.env.DATABASE_URL = mongoUri;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    prisma = app.get(PrismaService);

    await prisma
      .$connect()
      .then(() => {
        console.log("Prisma connected successfully");
      })
      .catch((err) => {
        console.error("Prisma failed to connect:", err);
        throw err;
      });

    // Push Prisma schema to in-memory MongoDB
    try {
      execSync("npx prisma db push", {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: mongoUri },
      });
      console.log("Prisma schema pushed successfully");
    } catch (error) {
      console.error("Failed to push Prisma schema:", error);
      throw error;
    }

    app.setGlobalPrefix("api/v1");
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
    if (prisma) await prisma.$disconnect();
    if (mongod) await mongod.stop();
  });

  it("should register company and create admin", async () => {
    const dto: CreateTenantDto = {
      businessName: faker.company.name(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email({ provider: "example.com" }),
      phone: "+234" + faker.phone.number({ style: "national" }),
      slug: faker.lorem.slug(),
      plan: faker.helpers.arrayElement([
        ...Object.values($Enums.SubscriptionPlan).map((v) => v.toString()),
      ]),
    };
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/signup")
      .send(dto)
      .expect(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("userId");
  });

  it("should verify email, set password, then login", async () => {
    // Step 1: Register tenant and admin
    const registerRes = await request(app.getHttpServer())
      .post("/api/v1/auth/signup")
      .send({
        businessName: "TestCo",
        firstName: "John",
        lastName: "Doe",
        email: "admin@test.com",
        phone: "+2341234567890",
        plan: faker.helpers.arrayElement([
          ...Object.values($Enums.SubscriptionPlan).map((v) => v.toString()),
        ]),
        slug: "testco",
      })
      .expect(201);

    const token =
      registerRes.body.verificationToken ||
      registerRes.body.userId ||
      "dummy-token";

    // Step 2: Verify email & set password
    await request(app.getHttpServer())
      .post("/api/v1/auth/verify-email")
      .send({ token, password: "secret123" })
      .expect(200);

    // Step 3: Login
    const loginRes = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "admin@test.com", password: "secret123" })
      .expect(200);

    expect(loginRes.body).toHaveProperty("token");
    expect(loginRes.body).toHaveProperty("user");
    expect(loginRes.body.user.email).toBe("admin@test.com");
  });
});
