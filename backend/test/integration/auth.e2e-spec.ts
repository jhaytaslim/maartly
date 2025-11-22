import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { MongoMemoryServer } from "mongodb-memory-server";
import { CreateTenantDto } from "../../src/auth/dtos/create-tenant.dto";
import { faker } from "@faker-js/faker";

describe("Auth (e2e)", () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongod.getUri() + "cognistock";
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("should register company", () => {
    const dto: CreateTenantDto = {
      businessName: faker.company.name(), // e.g., "Acme Inc"
      firstName: faker.person.firstName(), // e.g., "John"
      lastName: faker.person.lastName(), // e.g., "Doe"
      email: faker.internet.email({ provider: "example.com" }), // e.g., "john.doe@example.com"
      phone: "+234" + faker.phone.number({ style: "national" }), // e.g., "+2341234567890" (NG format)
      slug: faker.lorem.slug(), // e.g., "test-company-slug" (optional, but included)
      plan: faker.helpers.arrayElement(["basic", "pro", "enterprise"]), // e.g., "basic" (from common options)
    };
    return request(app.getHttpServer())
      .post("/api/auth/signup")
      .send({
        email: "company@test.com",
        password: "pass",
        companyName: "TestCo",
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("tenantId");
      });
  });

  it("should create employee as admin", async () => {
    // First register
    const regRes = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: "admin@test.com",
        password: "pass",
        companyName: "TestCo",
      });
    const token = regRes.body.token;

    // Create cashier
    return request(app.getHttpServer())
      .post("/api/users/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "cashier@test.com", role: "cashier" })
      .expect(201)
      .expect((res) => expect(res.body.role).toBe("cashier"));
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });
});
