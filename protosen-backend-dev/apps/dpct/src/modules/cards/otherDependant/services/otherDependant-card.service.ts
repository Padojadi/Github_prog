import db, { OtherDependantDC } from 'database/models';
import { OtherDependantDCRepo } from '../repositories/otherDependant-card.repository';
import {
	ICreateSpouseDC,
	IQueryOptionsDC,
	IUpdateSpouseDC,
	EDocumentState,
} from '@modules/cards/types';
import { HttpStatusCode } from 'axios';
import { IResults } from '@shared/types';
import { ERROR_MESSAGE } from '@constants/messages';
import { RoleEnum } from '@modules/user/types';

interface IOtherDependantDCService {
	save(data: ICreateSpouseDC): Promise<OtherDependantDC>;

	update(id: string, data: IUpdateSpouseDC): Promise<OtherDependantDC | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<OtherDependantDC | null>;

	getOtherDependantsDC(queryOptions: IQueryOptionsDC): Promise<IResults<OtherDependantDC>>;

	getOne(fields: object): Promise<OtherDependantDC | null>;
}

export class OtherDependantDCService implements IOtherDependantDCService {
	async save(data: ICreateSpouseDC): Promise<OtherDependantDC> {
		return await new OtherDependantDCRepo().save(data);
	}

	async update(id: string, data: IUpdateSpouseDC): Promise<OtherDependantDC | null> {
		return await new OtherDependantDCRepo().update(id, data);
	}

	async delete(id: string) {
		// Suppression d'une carte diplomatique avec tous ses fichiers associés
		const transaction = await db.sequelize.transaction();

		try {
			// Suppression des fichiers associés
			await db.OtherDependantDCFile.destroy({
				where: { id },
				transaction,
			});

			// Suppression de la carte diplomatique
			await db.OtherDependantDC.destroy({
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

	async getById(id: string): Promise<OtherDependantDC | null> {
		return await new OtherDependantDCRepo().getById(id);
	}

	async getOtherDependantsDC(queryOptions: IQueryOptionsDC): Promise<IResults<OtherDependantDC>> {
		return await new OtherDependantDCRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<OtherDependantDC | null> {
		return await new OtherDependantDCRepo().getOne(field);
	}

	/**
	 * Valide si une carte peut être marquée comme imprimée
	 * Une carte peut être imprimée si elle est CONFIRMED et non expirée
	 */
	validateCanPrint(card: OtherDependantDC): void {
		if (card.dataValues.documentStage !== EDocumentState.CONFIRMED || card.expired) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.CAN_NOT_UPDATE,
			};
		}
	}

	/**
	 * Valide si une carte peut être mise à jour
	 * Une carte CONFIRMED ne peut pas être mise à jour sauf par SUPERADMIN
	 * Une carte expirée ne peut pas être mise à jour
	 */
	validateCanUpdate(card: OtherDependantDC, userRole: RoleEnum): void {
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

	/**
	 * Valide si une carte peut être supprimée
	 * Une carte CONFIRMED ou PRINTED ne peut pas être supprimée
	 */
	validateCanDelete(card: OtherDependantDC): void {
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

	/**
	 * Valide si l'annulation d'impression est possible
	 * Seulement les cartes PRINTED non expirées peuvent être remises à CONFIRMED
	 */
	validateCanUndoPrint(card: OtherDependantDC): void {
		if (card.dataValues.documentStage !== EDocumentState.PRINTED || card.expired) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.CAN_NOT_UPDATE,
			};
		}
	}
}
