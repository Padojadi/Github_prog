import db, { ChildDC } from 'database/models';
import { ChildDCRepo } from '../repositories/child-card.repository';
import { HttpStatusCode } from 'axios';
import { IResults } from '@shared/types';
import {
	EDocumentState,
	ICreateSpouseDC,
	IQueryOptionsDC,
	IUpdateSpouseDC,
} from '@modules/cards/types';
import { ERROR_MESSAGE } from '@constants/messages';
import { RoleEnum } from '@modules/user/types';

interface IChildDCService {
	save(data: ICreateSpouseDC): Promise<ChildDC>;

	update(id: string, data: IUpdateSpouseDC): Promise<ChildDC | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<ChildDC | null>;

	getChildsDC(queryOptions: IQueryOptionsDC): Promise<IResults<ChildDC>>;

	getOne(fields: object): Promise<ChildDC | null>;
}

export class ChildDCService implements IChildDCService {
	async save(data: ICreateSpouseDC): Promise<ChildDC> {
		return await new ChildDCRepo().save(data);
	}

	async update(id: string, data: IUpdateSpouseDC): Promise<ChildDC | null> {
		return await new ChildDCRepo().update(id, data);
	}

	async delete(id: string) {
		// Suppression d'une carte diplomatique avec tous ses fichiers associés
		const transaction = await db.sequelize.transaction();

		try {
			// Suppression des fichiers associés
			await db.ChildDCFile.destroy({
				where: { id },
				transaction,
			});

			// Suppression de la carte diplomatique
			await db.ChildDC.destroy({
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

	async getById(id: string): Promise<ChildDC | null> {
		return await new ChildDCRepo().getById(id);
	}

	async getChildsDC(queryOptions: IQueryOptionsDC): Promise<IResults<ChildDC>> {
		return await new ChildDCRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<ChildDC | null> {
		return await new ChildDCRepo().getOne(field);
	}

	/**
	 * Valide si une carte peut être marquée comme imprimée
	 * Une carte peut être imprimée si elle est CONFIRMED et non expirée
	 */
	validateCanPrint(card: ChildDC): void {
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
	validateCanUpdate(card: ChildDC, userRole: RoleEnum): void {
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
	validateCanDelete(card: ChildDC): void {
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
	validateCanUndoPrint(card: ChildDC): void {
		if (card.dataValues.documentStage !== EDocumentState.PRINTED || card.expired) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.CAN_NOT_UPDATE,
			};
		}
	}
}
