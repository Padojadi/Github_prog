import db, { DomesticAndRelativeDC } from 'database/models';
import { DomesticAndRelativeDCRepo } from '../repositories/domesticAndRelative-card.repository';
import { IResults } from '@shared/types';
import {
	ICreateSpouseDC,
	IQueryOptionsDC,
	IUpdateSpouseDC,
	EDocumentState,
} from '@modules/cards/types';
import { HttpStatusCode } from 'axios';
import { ERROR_MESSAGE } from '@constants/messages';
import { RoleEnum } from '@modules/user/types';

interface IDomesticAndRelativeDCService {
	save(data: ICreateSpouseDC): Promise<DomesticAndRelativeDC>;

	update(id: string, data: IUpdateSpouseDC): Promise<DomesticAndRelativeDC | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<DomesticAndRelativeDC | null>;

	getAll(queryOptions: IQueryOptionsDC): Promise<IResults<DomesticAndRelativeDC>>;

	getOne(fields: object): Promise<DomesticAndRelativeDC | null>;
}

export class DomesticAndRelativeDCService implements IDomesticAndRelativeDCService {
	async save(data: ICreateSpouseDC): Promise<DomesticAndRelativeDC> {
		return await new DomesticAndRelativeDCRepo().save(data);
	}

	async update(id: string, data: IUpdateSpouseDC): Promise<DomesticAndRelativeDC | null> {
		return await new DomesticAndRelativeDCRepo().update(id, data);
	}

	async delete(id: string) {
		// Suppression d'une carte diplomatique avec tous ses fichiers associés
		const transaction = await db.sequelize.transaction();

		try {
			// Suppression des fichiers associés
			await db.DomesticAndRelativeDCFile.destroy({
				where: { id },
				transaction,
			});

			// Suppression de la carte diplomatique
			await db.DomesticAndRelativeDC.destroy({
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

	async getById(id: string): Promise<DomesticAndRelativeDC | null> {
		return await new DomesticAndRelativeDCRepo().getById(id);
	}

	async getAll(queryOptions: IQueryOptionsDC): Promise<IResults<DomesticAndRelativeDC>> {
		return await new DomesticAndRelativeDCRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<DomesticAndRelativeDC | null> {
		return await new DomesticAndRelativeDCRepo().getOne(field);
	}

	validateCanPrint(card: DomesticAndRelativeDC): void {
		if (card.dataValues.documentStage !== EDocumentState.CONFIRMED || card.expired) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.CAN_NOT_UPDATE,
			};
		}
	}

	validateCanUpdate(card: DomesticAndRelativeDC, userRole: RoleEnum): void {
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

	validateCanDelete(card: DomesticAndRelativeDC): void {
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

	validateCanUndoPrint(card: DomesticAndRelativeDC): void {
		if (card.dataValues.documentStage !== EDocumentState.PRINTED || card.expired) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.CAN_NOT_UPDATE,
			};
		}
	}
}
