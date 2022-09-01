export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'test/.*\\.spec\\.ts$',
  transform: {
    '.+\\.(t|j)s$': 'ts-jest'
  },
  moduleDirectories: ['node_modules'],
  transformIgnorePatterns: ['node_modules/(?!polkadot|@polkadot|@parallel-fi)'],
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node'
};
