import { AccessGroup } from '@database/models';
import { InferCreationAttributes } from 'sequelize';
import { AccessGroupRepository } from '../repositories/accessgroup.repository';
import { CreateAccessGroupInput, UpdateAccessGroupInput } from '../dtos/accessgroup.dto';

export class AccessGroupService {
	static async create(data: CreateAccessGroupInput) {
		const accessGroupData: Partial<InferCreationAttributes<AccessGroup>> = {
			name: data.name,
			permissions: data.permissions as unknown as string[],
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
		return await AccessGroupRepository.update(id, data);
	}

	static async delete(id: string) {
		return await AccessGroupRepository.delete(id);
	}
}
