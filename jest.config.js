/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: ["**/*.ts"],
  coverageDirectory: "./coverage",
  setupFilesAfterEnv: ["<rootDir>/src/singleton.ts"],
  coveragePathIgnorePatterns: [
    "/node_modules",
    "/dist",
    "^(.*)\\.test\\.(.*)$",
    "/prisma",
  ],
};
