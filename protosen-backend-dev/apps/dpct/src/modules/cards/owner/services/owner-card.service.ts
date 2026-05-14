import db, { OwnerDiplomaticCard } from 'database/models';
import { OwnerDCRepo } from '../repositories/owner-card.repository';
import { HttpStatusCode } from 'axios';
import {
	EDocumentState,
	ICreateOwnerDC,
	IQueryOptionsDC,
	IUpdateOwnerDC,
} from '@modules/cards/types';
import { IResults } from '@shared/types';
import { ERROR_MESSAGE } from '@constants/messages';
import { RoleEnum } from '@modules/user/types';

interface IOwnerDCService {
	save(data: ICreateOwnerDC): Promise<OwnerDiplomaticCard>;

	update(id: string, data: IUpdateOwnerDC): Promise<OwnerDiplomaticCard | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<OwnerDiplomaticCard | null>;

	getOwnersDC(queryOptions: IQueryOptionsDC): Promise<IResults<OwnerDiplomaticCard>>;

	getOne(fields: object): Promise<OwnerDiplomaticCard | null>;
}

export class OwnerDCService implements IOwnerDCService {
	async save(data: ICreateOwnerDC): Promise<OwnerDiplomaticCard> {
		const card = await db.OwnerDiplomaticCard.findOne({
			where: {
				firstName: data.firstName,
				lastName: data.lastName,
				dateOfBirth: new Date(data.dateOfBirth).toISOString().split('T')[0],
			},
		});
		if (card) {
			throw new Error('Cette carte existe déja');
		}

		return await new OwnerDCRepo().save(data);
	}

	async update(id: string, data: IUpdateOwnerDC): Promise<OwnerDiplomaticCard | null> {
		return await new OwnerDCRepo().update(id, data);
	}

	async delete(id: string) {
		// Suppression d'une carte diplomatique avec tous ses fichiers associés
		const transaction = await db.sequelize.transaction();

		try {
			// Suppression des fichiers associés
			await db.OwnerDiplomaticCardFile.destroy({
				where: { id },
				transaction,
			});

			// Suppression de la carte diplomatique
			await db.OwnerDiplomaticCard.destroy({
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

	async getById(id: string): Promise<OwnerDiplomaticCard | null> {
		return await new OwnerDCRepo().getById(id);
	}

	async getOwnersDC(queryOptions: IQueryOptionsDC): Promise<IResults<OwnerDiplomaticCard>> {
		return await new OwnerDCRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<OwnerDiplomaticCard | null> {
		return await new OwnerDCRepo().getOne(field);
	}

	/**
	 * Valide si une carte peut être marquée comme imprimée
	 * Une carte peut être imprimée si elle est CONFIRMED et non expirée
	 */
	validateCanPrint(card: OwnerDiplomaticCard): void {
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
	validateCanUpdate(card: OwnerDiplomaticCard, userRole: RoleEnum): void {
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
	validateCanDelete(card: OwnerDiplomaticCard): void {
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
	validateCanUndoPrint(card: OwnerDiplomaticCard): void {
		if (card.dataValues.documentStage !== EDocumentState.PRINTED || card.expired) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.CAN_NOT_UPDATE,
			};
		}
	}
}
