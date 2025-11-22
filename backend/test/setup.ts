// test/setup.ts
import { faker } from "@faker-js/faker";

faker.seed(123);

global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

global.configMock = {
  get: jest.fn(),
} as unknown as jest.Mocked<import("@nestjs/config").ConfigService>;
