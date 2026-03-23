import { Request, Response } from 'express';
import { PlaqueService } from '../services/plaque.service';

export class PlaqueController {
	static async create(req: Request, res: Response) {
		try {
			const data = await PlaqueService.createPlaque(req.body);
			return res.status(201).json(data);
		} catch {
			return res.status(400).json({ error: 'Erreur de création' });
		}
	}

	static async getAll(req: Request, res: Response) {
		const data = await PlaqueService.getAllPlaques();
		return res.status(200).json(data);
	}

	static async getById(req: Request, res: Response) {
		const cardType = await PlaqueService.getPlaqueById(req.params.id);
		if (!cardType) {return res.status(404).json({ error: 'Plaque non trouvé' });}
		return res.status(200).json(cardType);
	}

	static async update(req: Request, res: Response) {
		try {
			const updatedCardType = await PlaqueService.updatePlaque(req.params.id, req.body);
			if (!updatedCardType) {return res.status(404).json({ error: 'Plaque non trouvé' });}
			return res.status(200).json(updatedCardType);
		} catch {
			return res.status(400).json({ error: 'Erreur de mise à jour' });
		}
	}

	static async delete(req: Request, res: Response) {
		const deletedCardType = await PlaqueService.deletePlaque(req.params.id);
		if (!deletedCardType) {return res.status(404).json({ error: 'Plaque non trouvé' });}
		return res.status(204).send();
	}
}
