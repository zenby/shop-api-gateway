module.exports = {
  transform: {
    "^.+\\.js?$": "babel-jest",
  },
  testPathIgnorePatterns: ["<rootDir>/src/bff-service", "<rootDir>/node_modules/"],
};
