// test/setup.ts
import { faker } from "@faker-js/faker";

process.env.MONGOMS_DOWNLOAD_DIR = "./.mongodb-binaries";
process.env.MONGOMS_DISABLE_POSTINSTALL = "true"; // skip auto-download
process.env.MONGOMS_FORCE_BINARY = "true"; // force use binary

faker.seed(123);

// global.console = {
//   ...console,
//   log: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

global.configMock = {
  get: jest.fn(),
} as unknown as jest.Mocked<import("@nestjs/config").ConfigService>;
