import { Request, Response } from 'express';
import { CardTypeService } from '../services/cardType.service';

export class CardTypeController {
	static async create(req: Request, res: Response) {
		try {
			const cardType = await CardTypeService.createCardType(req.body);
			return res.status(201).json(cardType);
		} catch {
			return res.status(400).json({ error: 'Erreur de création' });
		}
	}

	static async getAll(req: Request, res: Response) {
		const cardTypes = await CardTypeService.getAllCardTypes();
		return res.status(200).json(cardTypes);
	}

	static async getById(req: Request, res: Response) {
		const cardType = await CardTypeService.getCardTypeById(req.params.id);
		if (!cardType) {return res.status(404).json({ error: 'CardType non trouvé' });}
		return res.status(200).json(cardType);
	}

	static async update(req: Request, res: Response) {
		try {
			const updatedCardType = await CardTypeService.updateCardType(req.params.id, req.body);
			if (!updatedCardType) {return res.status(404).json({ error: 'CardType non trouvé' });}
			return res.status(200).json(updatedCardType);
		} catch {
			return res.status(400).json({ error: 'Erreur de mise à jour' });
		}
	}

	static async delete(req: Request, res: Response) {
		const deletedCardType = await CardTypeService.deleteCardType(req.params.id);
		if (!deletedCardType) {return res.status(404).json({ error: 'CardType non trouvé' });}
		return res.status(204).send();
	}
}
