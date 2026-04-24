module.exports = {
  // The root of your source code, typically /src
  roots: ['<rootDir>/src'],
  
  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Runs special logic, such as cleaning up components
  // when using React Testing Library and adds special
  // extended assertions to Jest
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.js'
  ],
  
  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$',
  
  // Module file extensions for importing
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  
  // Mock CSS imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__tests__/mocks/fileMock.js'
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js',
    '!src/__tests__/**/*'
  ],
  
  // Test environment configuration
  testEnvironment: 'jsdom',
  
  // Ignore certain directories
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/'
  ],
  
  // Verbose output
  verbose: true
};
