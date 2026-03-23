import { OwnerDuplicataDC } from 'database/models';
import {
	IOwnerDuplicataDCRepo,
	OwnerDuplicataDCRepo,
} from '../repositories/owner-duplicata.repository';
import {
	EDocumentState,
	ICreateDuplicataDC,
	IQueryOptionsDC,
	IUpdateRenewSpouseDC,
} from '@modules/cards/types';
import { IResults } from '@shared/types';
import { HttpStatusCode } from 'axios';
import { ERROR_MESSAGE } from '@constants/messages';

interface IOwnerDuplicataDC extends IOwnerDuplicataDCRepo {}

export class OwnerDuplicataDCService implements IOwnerDuplicataDC {
	async save(data: ICreateDuplicataDC): Promise<OwnerDuplicataDC> {
		return await new OwnerDuplicataDCRepo().save(data);
	}

	async update(id: string, data: IUpdateRenewSpouseDC): Promise<OwnerDuplicataDC> {
		return await new OwnerDuplicataDCRepo().update(id, data);
	}

	async hardDelete(id: string) {
		return await new OwnerDuplicataDCRepo().hardDelete(id);
	}

	async softDelete(id: string) {
		return await new OwnerDuplicataDCRepo().softDelete(id);
	}

	async getById(id: string): Promise<OwnerDuplicataDC> {
		return await new OwnerDuplicataDCRepo().getById(id);
	}

	async getAll(queryOptions: IQueryOptionsDC): Promise<IResults<OwnerDuplicataDC>> {
		return await new OwnerDuplicataDCRepo().getAll(queryOptions);
	}

	async getOne(fields: object): Promise<OwnerDuplicataDC | null> {
		return await new OwnerDuplicataDCRepo().getOne(fields);
	}

	/**
	 * Valide si une carte duplicata peut être marquée comme imprimée
	 * Une carte peut être imprimée si elle est CONFIRMED et non expirée
	 */
	validateCanPrint(card: OwnerDuplicataDC): void {
		const sourceCard = (card as any).renewCard ?? card.previousCard;
		if (!sourceCard) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: 'Carte originale non trouvée',
			};
		}

		if (card.dataValues.documentStage !== EDocumentState.CONFIRMED || sourceCard.expired) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.CAN_NOT_UPDATE,
			};
		}
	}

	/**
	 * Valide si l'annulation d'impression est possible
	 * Seulement les cartes PRINTED non expirées peuvent être remises à CONFIRMED
	 */
	validateCanUndoPrint(card: OwnerDuplicataDC): void {
		const sourceCard = (card as any).renewCard ?? card.previousCard;
		if (!sourceCard) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: 'Carte originale non trouvée',
			};
		}

		if (card.dataValues.documentStage !== EDocumentState.PRINTED || sourceCard.expired) {
			throw {
				status: HttpStatusCode.BadRequest,
				message: ERROR_MESSAGE.CAN_NOT_UPDATE,
			};
		}
	}
}
