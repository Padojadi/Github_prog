import { OtherDependantDuplicataDC } from '@database/models';
import { OtherDependantDuplicataDCRepo } from '../repositories/otherDependant-duplicata.repository';
import { EDocumentState, ICreateDuplicataDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { BaseDCService } from '@shared/services/baseDC.service';
import { HttpStatusCode } from 'axios';
import { ERROR_MESSAGE } from '@constants/messages';

export class OtherDependantDuplicataDCService extends BaseDCService<
	OtherDependantDuplicataDC,
	ICreateDuplicataDC,
	IUpdateRenewSpouseDC
> {
	repo = OtherDependantDuplicataDCRepo;

	/**
	 * Valide si une carte duplicata peut être marquée comme imprimée
	 * Une carte peut être imprimée si elle est CONFIRMED et non expirée
	 */
	validateCanPrint(card: OtherDependantDuplicataDC): void {
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
	validateCanUndoPrint(card: OtherDependantDuplicataDC): void {
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
