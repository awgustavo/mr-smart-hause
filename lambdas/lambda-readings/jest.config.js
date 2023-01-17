module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleNameMapper: {
        '^@application/(.*)$': '<rootDir>/src/application/$1'
    },
    collectCoverage: true,
    collectCoverageFrom: ['./src/domain/**', './src/application/**', './src/infrastructure/**'],
    coverageThreshold: {
        global: {
            lines: 30,
            funcs: 30,
            branch: 30,
            stmts: 30,
        },
    },
} 