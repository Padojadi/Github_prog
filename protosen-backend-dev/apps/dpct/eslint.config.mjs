import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.es2021,
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// TypeScript strict rules
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'@typescript-eslint/no-empty-object-type': 'off', // Sequelize pattern
			'@typescript-eslint/no-unsafe-function-type': 'warn',

			// Best practices
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			eqeqeq: ['error', 'always'],
			curly: ['error', 'all'],
			'no-var': 'error',
			'prefer-const': 'error',

			// Security
			'no-eval': 'error',
			'no-implied-eval': 'error',
			'no-new-func': 'error',
		},
	},
	// Règles spécifiques pour les modèles Sequelize
	{
		files: ['src/database/models/**/*.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off', // Sequelize associate pattern
		},
	},
	{
		ignores: [
			'node_modules/**',
			'build/**',
			'dist/**',
			'coverage/**',
			'**/*.js',
			'**/*.mjs',
			'docs/**',
			'src/database/migrations/**',
			'grpc/generated/**',
		],
	},
);
