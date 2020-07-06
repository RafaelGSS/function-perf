module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: 'test/.*\\.spec\\.ts(x?)$',
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  moduleDirectories: [
    "node_modules",
    "src"
  ],
  roots: [
    "<rootDir>/test"
  ],
};
