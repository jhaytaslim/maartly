// jest.config.ts
import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  preset: "ts-jest",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "ts-jest",
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
    "^.+\\.(css|less|scss|sass)$": "jest-transform-stub",
    "^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "jest-transform-stub",
  },
  transformIgnorePatterns: [
    // Key fix: Ignore most node_modules, but transform .pnpm contents *and* @faker-js specifically
    // This handles pnpm's nested structure: node_modules/.pnpm/.../node_modules/@faker-js/...
    "node_modules/(?!(\\.pnpm|@faker-js)/)",
  ],
  collectCoverageFrom: [
    "**/*.(ts|js)",
    "!**/*.d.ts",
    "!**/*.spec.ts",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  verbose: true,
};

export default config;
