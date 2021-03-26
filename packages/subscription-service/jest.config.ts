export default {
    collectCoverageFrom: [
        '**/*.{ts,}',
        '!**/*.module.ts',
        '!**/*.interface.ts',
        '!**/*.enum.ts',
        '!**/*.constants.ts',
        '!**/*.exception.ts',
        '!**/*.dto.ts',
        '!**/*.config.ts',
        '!**/*.schema.ts',
        '!**/*.filter.ts',
        '!**/*.int.spec.ts',
        '!**/index.ts',
        '!main.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    coverageDirectory: '../coverage',
    coverageProvider: 'v8',
    coverageReporters: ['lcov', 'text'],
    rootDir: 'src',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts', '!**/*.int.spec.ts'],
    transform: {
        '^.+\\.(t)s$': 'ts-jest',
    },
};
