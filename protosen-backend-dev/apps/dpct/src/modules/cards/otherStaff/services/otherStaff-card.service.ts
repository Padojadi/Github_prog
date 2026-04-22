import db, { OtherStaffDC } from 'database/models';
import { OtherStaffDCRepo } from '../repositories/otherStaff-card.repository';
import { HttpStatusCode } from 'axios';
import {
	EDocumentState,
	ICreateSpouseDC,
	IQueryOptionsDC,
	IUpdateSpouseDC,
} from '@modules/cards/types';
import { IResults } from '@shared/types';
import { ERROR_MESSAGE } from '@constants/messages';
import { RoleEnum } from '@modules/user/types';

interface IOtherStaffDCService {
	save(data: ICreateSpouseDC): Promise<OtherStaffDC>;

	update(id: string, data: IUpdateSpouseDC): Promise<OtherStaffDC | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<OtherStaffDC | null>;

	getOtherStaffsDC(queryOptions: IQueryOptionsDC): Promise<IResults<OtherStaffDC>>;

	getOne(fields: object): Promise<OtherStaffDC | null>;
}

export class OtherStaffDCService implements IOtherStaffDCService {
	async save(data: ICreateSpouseDC): Promise<OtherStaffDC> {
		return await new OtherStaffDCRepo().save(data);
	}

	async update(id: string, data: IUpdateSpouseDC): Promise<OtherStaffDC | null> {
		return await new OtherStaffDCRepo().update(id, data);
	}

	async delete(id: string) {
		// Suppression d'une carte diplomatique avec tous ses fichiers associés
		const transaction = await db.sequelize.transaction();

		try {
			// Suppression des fichiers associés
			await db.OtherStaffDCFile.destroy({
				where: { id },
				transaction,
			});

			// Suppression de la carte diplomatique
			await db.OtherStaffDC.destroy({
				where: { id: id },
				transaction,
			});

			// Valider la transaction
			await transaction.commit();
		} catch (error) {
			// Annuler la transaction en cas d'erreur
			await transaction.rollback();
			console.error('Erreur lors de la suppression :', error);
			throw error;
		}
	}

	async getById(id: string): Promise<OtherStaffDC | null> {
		return await new OtherStaffDCRepo().getById(id);
	}

	async getOtherStaffsDC(queryOptions: IQueryOptionsDC): Promise<IResults<OtherStaffDC>> {
		return await new OtherStaffDCRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<OtherStaffDC | null> {
		return await new OtherStaffDCRepo().getOne(field);
	}

	validateCanPrint(card: OtherStaffDC): void {
		if (card.dataValues.documentStage !== EDocumentState.CONFIRMED || card.expired) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.CAN_NOT_UPDATE,
			};
		}
	}

	validateCanUpdate(card: OtherStaffDC, userRole: RoleEnum): void {
		if (
			(card.dataValues.documentStage === EDocumentState.CONFIRMED && card.expired) ||
			(card.dataValues.documentStage === EDocumentState.CONFIRMED &&
				userRole !== RoleEnum.SUPERADMIN)
		) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.CAN_NOT_UPDATE,
			};
		}
	}

	validateCanDelete(card: OtherStaffDC): void {
		if (
			card.dataValues.documentStage === EDocumentState.PRINTED ||
			card.dataValues.documentStage === EDocumentState.CONFIRMED
		) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.DELETE_FAILURE_MESSAGE,
			};
		}
	}

	validateCanUndoPrint(card: OtherStaffDC): void {
		if (card.dataValues.documentStage !== EDocumentState.PRINTED || card.expired) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.CAN_NOT_UPDATE,
			};
		}
	}
}
