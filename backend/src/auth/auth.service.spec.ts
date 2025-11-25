import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { CreateTenantDto } from "./dtos/create-tenant.dto";
import { NotificationsService } from "@/notifications/notifications.service";
import { ConfigService } from "@nestjs/config";

describe("AuthService", () => {
  let service: AuthService;
  let prismaMock = {
    user: { create: jest.fn(), findUnique: jest.fn() },
    tenant: { create: jest.fn(), findUnique: jest.fn() },
  };
  const jwtMock = { sign: jest.fn() };
  const notificationsMock = { sendEmail: jest.fn() };
  const configMock = global.configMock;

  beforeEach(async () => {
    configMock.get.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: ConfigService, useValue: configMock },
        { provide: NotificationsService, useValue: notificationsMock },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it("should register company and create admin w", async () => {
    const dto: CreateTenantDto = {
      businessName: faker.company.name(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email({ provider: "example.com" }),
      phone: "+234" + faker.phone.number({ style: "national" }),
      slug: faker.lorem.slug(),
      plan: faker.helpers.arrayElement(["basic", "pro", "enterprise"]),
    };
    const mockUserResult = { id: "user1" };
    const mockTenantResult = { id: "tenant1", companyId: "co1" };

    prismaMock.tenant.create.mockResolvedValue(mockTenantResult);
    prismaMock.user.create.mockResolvedValue(mockUserResult);
    jwtMock.sign.mockReturnValue("token");

    const result = await service.signupTenant(dto);
    expect(result).toEqual(
      expect.objectContaining({
        message:
          "Registration successful. Please check your email to verify your account and set your password.",
        userId: mockUserResult.id,
      })
    );
    expect(prismaMock.tenant.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          businessName: dto.businessName,
        }),
      })
    );
  });
});
