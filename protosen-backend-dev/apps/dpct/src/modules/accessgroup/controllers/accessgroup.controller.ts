import { Request, Response } from 'express';
import { AccessGroupService } from '../services/accessgroup.service';

export class AccessGroupController {
	static async create(req: Request, res: Response) {
		try {
			const access = await AccessGroupService.create(req.body);
			return res.status(201).json(access);
		} catch  {
			return res.status(400).json({ error: 'Erreur de création' });
		}
	}

	static async getAll(req: Request, res: Response) {
		const accesss = await AccessGroupService.getAll();
		return res.status(200).json(accesss);
	}

	static async getById(req: Request, res: Response) {
		const access = await AccessGroupService.getById(req.params.id);
		if (!access) {return res.status(404).json({ error: "Groupe d'accès non trouvé" });}
		return res.status(200).json(access);
	}

	static async update(req: Request, res: Response) {
		try {
			const access = await AccessGroupService.getById(req.params.id);
			if (!access) {return res.status(404).json({ error: "Groupe d'accès non trouvé" });}
			if (!access.editable) {return res.status(403).json({ error: "Groupe d'accès non modifiable" });}
			const updatedaccess = await AccessGroupService.update(req.params.id, req.body);
			return res.status(200).json(updatedaccess);
		} catch  {
			return res.status(400).json({ error: 'Erreur de mise à jour' });
		}
	}

	static async delete(req: Request, res: Response) {
		try {
			const access = await AccessGroupService.getById(req.params.id);
			if (!access) {return res.status(404).json({ error: "Groupe d'accès non trouvé" });}
			if (!access.editable)
				{return res.status(403).json({ error: "Groupe d'accès non supprimable" });}
			const deletedaccess = await AccessGroupService.delete(req.params.id);
			return res.status(204).send(deletedaccess);
		} catch  {
			return res.status(400).json({ error: 'Erreur de suppression' });
		}
	}
}
