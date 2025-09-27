module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ["js","jsx","ts","tsx","json","node"],
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.js"]
};
