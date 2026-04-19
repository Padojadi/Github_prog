import { AccessGroup } from '@database/models';
import { InferCreationAttributes } from 'sequelize';
import { AccessGroupRepository } from '../repositories/accessgroup.repository';
import { CreateAccessGroupInput, UpdateAccessGroupInput } from '../dtos/accessgroup.dto';

const ACCESS_CONFERENCE_MODULE = 'ACCESS_CONFERENCE_MODULE';
const ACCESS_HONOR_LOUNGE_MODULE = 'ACCESS_HONOR_LOUNGE_MODULE';

const normalizePermissions = (permissions: string[] = []) => {
	const normalized = [...permissions];
	if (
		normalized.includes(ACCESS_CONFERENCE_MODULE) &&
		!normalized.includes(ACCESS_HONOR_LOUNGE_MODULE)
	) {
		normalized.push(ACCESS_HONOR_LOUNGE_MODULE);
	}
	return normalized;
};

export class AccessGroupService {
	static async create(data: CreateAccessGroupInput) {
		const accessGroupData: Partial<InferCreationAttributes<AccessGroup>> = {
			name: data.name,
			permissions: normalizePermissions(data.permissions as unknown as string[]),
			editable: true,
		};
		return await AccessGroupRepository.create(
			accessGroupData as InferCreationAttributes<AccessGroup>,
		);
	}

	static async getAll() {
		return await AccessGroupRepository.findAll();
	}

	static async getById(id: string) {
		return await AccessGroupRepository.findById(id);
	}

	static async update(id: string, data: UpdateAccessGroupInput) {
		const payload = {
			...data,
			...(data.permissions
				? {
						permissions: normalizePermissions(data.permissions as unknown as string[]),
					}
				: {}),
		};
		return await AccessGroupRepository.update(id, payload);
	}

	static async delete(id: string) {
		return await AccessGroupRepository.delete(id);
	}
}
