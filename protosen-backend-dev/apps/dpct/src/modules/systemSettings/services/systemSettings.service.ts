import { SystemSettings } from '@database/models';
import { SystemSettingsRepository } from '../repositories/systemSettings.repository';
import { UpdateSystemSettingsInput } from '../dtos/systemSettings.dto';

export class SystemSettingsService {
	private repository: SystemSettingsRepository;

	constructor() {
		this.repository = new SystemSettingsRepository();
	}

	async get(): Promise<SystemSettings> {
		return await this.repository.getOrCreate();
	}

	async update(data: UpdateSystemSettingsInput): Promise<SystemSettings> {
		return await this.repository.update(data);
	}
}
