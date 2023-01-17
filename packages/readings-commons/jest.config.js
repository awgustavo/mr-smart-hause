module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleNameMapper: {
        '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    },
    collectCoverage: true,
} 