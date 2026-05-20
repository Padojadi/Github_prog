import db, { SystemSettings } from '@database/models';
import { UpdateSystemSettingsInput } from '../dtos/systemSettings.dto';

export class SystemSettingsRepository {
	/**
	 * Récupère les paramètres système, crée une ligne si elle n'existe pas
	 */
	async getOrCreate(): Promise<SystemSettings> {
		let settings = await db.SystemSettings.findOne();

		if (!settings) {
			settings = await db.SystemSettings.create({});
		}

		return settings;
	}

	/**
	 * Met à jour les paramètres système (crée la ligne si elle n'existe pas)
	 */
	async update(data: UpdateSystemSettingsInput): Promise<SystemSettings> {
		const settings = await this.getOrCreate();

		const updateData: Partial<SystemSettings> = {};

		if (data.directorSignature !== undefined) {
			updateData.directorSignature = data.directorSignature;
		}
		if (data.ministryName !== undefined) {
			updateData.ministryName = data.ministryName;
		}
		if (data.protocolDirectionName !== undefined) {
			updateData.protocolDirectionName = data.protocolDirectionName;
		}

		return await settings.update(updateData);
	}
}
