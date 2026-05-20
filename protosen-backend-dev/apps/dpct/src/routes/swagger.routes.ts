import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { loadSwaggerDocumentation, swaggerOptions } from '../config/swagger.config';

const swaggerRouter = Router();

// Charger la documentation
const swaggerDocument = loadSwaggerDocumentation();

// Route pour la documentation Swagger UI
swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Route pour le JSON brut
swaggerRouter.get('/json', (_req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerDocument);
});

export default swaggerRouter;
