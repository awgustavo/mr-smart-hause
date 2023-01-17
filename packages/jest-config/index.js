module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    collectCoverage: true,
    coverageThreshold: {
        global: {
            lines: 30,
            funcs: 30,
            branch: 30,
            stmts: 30,
        },
    },
} 