const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node", // 'jsdom' is better for Next.js since it uses DOM APIs
  roots: ["<rootDir>/src"],
  testMatch: ["**/?(*.)+(spec).+(ts|tsx)"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
