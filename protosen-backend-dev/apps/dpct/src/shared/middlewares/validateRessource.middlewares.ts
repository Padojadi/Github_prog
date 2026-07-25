import { NextFunction, Response, Request } from 'express';
import { AnyZodObject } from 'zod';

export const validateInputResource =
	(schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});

			return next();
		} catch (error: any) {
			return res.status(400).send(error.errors);
		}
	};
