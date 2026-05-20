import db, { SpouseDC } from 'database/models';
import { SpouseDCRepo } from '../repositories/spouse-card.repository';
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

interface ISpouseDCService {
	save(data: ICreateSpouseDC): Promise<SpouseDC>;

	update(id: string, data: IUpdateSpouseDC): Promise<SpouseDC | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<SpouseDC | null>;

	getSpousesDC(queryOptions: IQueryOptionsDC): Promise<IResults<SpouseDC>>;

	getOne(fields: object): Promise<SpouseDC | null>;
}

export class SpouseDCService implements ISpouseDCService {
	async save(data: ICreateSpouseDC): Promise<SpouseDC> {
		return await new SpouseDCRepo().save(data);
	}

	async update(id: string, data: IUpdateSpouseDC): Promise<SpouseDC | null> {
		return await new SpouseDCRepo().update(id, data);
	}

	async delete(id: string) {
		// Suppression d'une carte diplomatique avec tous ses fichiers associés
		const transaction = await db.sequelize.transaction();

		try {
			// Suppression des fichiers associés
			await db.SpouseDCFile.destroy({
				where: { id },
				transaction,
			});

			// Suppression de la carte diplomatique
			await db.SpouseDC.destroy({
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

	async getById(id: string): Promise<SpouseDC | null> {
		return await new SpouseDCRepo().getById(id);
	}

	async getSpousesDC(queryOptions: IQueryOptionsDC): Promise<IResults<SpouseDC>> {
		return await new SpouseDCRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<SpouseDC | null> {
		return await new SpouseDCRepo().getOne(field);
	}

	/**
	 * Valide si une carte peut être marquée comme imprimée
	 * Une carte peut être imprimée si elle est CONFIRMED et non expirée
	 */
	validateCanPrint(card: SpouseDC): void {
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
	validateCanUpdate(card: SpouseDC, userRole: RoleEnum): void {
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
	validateCanDelete(card: SpouseDC): void {
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
	validateCanUndoPrint(card: SpouseDC): void {
		if (card.dataValues.documentStage !== EDocumentState.PRINTED || card.expired) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.CAN_NOT_UPDATE,
			};
		}
	}
}
