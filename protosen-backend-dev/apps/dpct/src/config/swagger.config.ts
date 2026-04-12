import fs from 'fs';
import path from 'path';
import YAML from 'yamljs';

/**
 * Charge et combine tous les fichiers swagger.yaml des modules
 */
export function loadSwaggerDocumentation() {
	// Charger le fichier principal
	const mainSwagger = YAML.load(path.join(process.cwd(), 'swagger.yaml'));

	// Charger tous les modules
	const modulesPath = path.join(__dirname, '../modules');
	const modules = [
		'auth',
		'user',
		'institution',
		'statistics',
		'cardType',
		'plaque',
		'accessgroup',
		'systemSettings',
	];

	// Modules de cartes avec sous-modules
	const cardModules = [
		'cards/owner',
		'cards/spouse',
		'cards/child',
		'cards/otherDependant',
		'cards/domesticAndRelative',
		'cards/otherStaff',
	];

	// Initialiser les paths et components
	mainSwagger.paths = {};
	if (!mainSwagger.components) {
		mainSwagger.components = {};
	}
	if (!mainSwagger.components.schemas) {
		mainSwagger.components.schemas = {};
	}

	// Fonction helper pour charger un module swagger
	const loadModuleSwagger = (swaggerPath: string) => {
		if (fs.existsSync(swaggerPath)) {
			try {
				const moduleSwagger = YAML.load(swaggerPath);

				// Fusionner les paths
				if (moduleSwagger.paths) {
					mainSwagger.paths = {
						...mainSwagger.paths,
						...moduleSwagger.paths,
					};
				}

				// Fusionner les schemas
				if (moduleSwagger.components?.schemas) {
					mainSwagger.components.schemas = {
						...mainSwagger.components.schemas,
						...moduleSwagger.components.schemas,
					};
				}

				// Fusionner les securitySchemes
				if (moduleSwagger.components?.securitySchemes) {
					mainSwagger.components.securitySchemes = {
						...mainSwagger.components.securitySchemes,
						...moduleSwagger.components.securitySchemes,
					};
				}
			} catch (error) {
				console.warn(`Warning: Could not load ${swaggerPath}:`, error);
			}
		}
	};

	// Charger chaque module standard
	modules.forEach((moduleName) => {
		const swaggerPath = path.join(modulesPath, moduleName, 'docs', 'swagger.yaml');
		loadModuleSwagger(swaggerPath);
	});

	// Charger chaque module de cartes
	cardModules.forEach((moduleName) => {
		const swaggerPath = path.join(modulesPath, moduleName, 'docs', 'swagger.yaml');
		loadModuleSwagger(swaggerPath);
	});

	return mainSwagger;
}

/**
 * Options pour swagger-ui-express
 */
export const swaggerOptions = {
	customCss: '.swagger-ui .topbar { display: none }',
	customSiteTitle: 'Protosen DPCT API Documentation',
	customfavIcon: '/favicon.ico',
	swaggerOptions: {
		persistAuthorization: true,
		docExpansion: 'none',
		filter: true,
		showRequestHeaders: true,
		tryItOutEnabled: true,
	},
};
