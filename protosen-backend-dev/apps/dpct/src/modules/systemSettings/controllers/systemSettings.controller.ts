import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { SystemSettingsService } from '../services/systemSettings.service';
import { UpdateSystemSettingsInput } from '../dtos/systemSettings.dto';

class SystemSettingsController {
	/**
	 * GET /system-settings
	 * Récupérer les paramètres système (tout utilisateur authentifié)
	 */
	async get(req: Request, res: Response) {
		try {
			const settings = await new SystemSettingsService().get();
			return res.status(HttpStatusCode.Ok).json({
				data: settings,
				message: 'Paramètres système récupérés avec succès',
			});
		} catch (error: any) {
			console.error('Error fetching system settings:', error);
			return res.status(HttpStatusCode.InternalServerError).json({
				message: 'Erreur lors de la récupération des paramètres système',
			});
		}
	}

	/**
	 * PUT /system-settings
	 * Mettre à jour les paramètres système (Super Admin uniquement)
	 */
	async update(req: Request<{}, {}, UpdateSystemSettingsInput>, res: Response) {
		try {
			const settings = await new SystemSettingsService().update(req.body);
			return res.status(HttpStatusCode.Ok).json({
				data: settings,
				message: 'Paramètres système mis à jour avec succès',
			});
		} catch (error: any) {
			console.error('Error updating system settings:', error);
			return res.status(HttpStatusCode.InternalServerError).json({
				message: 'Erreur lors de la mise à jour des paramètres système',
			});
		}
	}
}

export default new SystemSettingsController();
