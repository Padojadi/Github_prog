import { DomesticAndRelativeDuplicataDC } from 'database/models';
import { DomesticAndRelativeDuplicataDCRepo } from '../repositories/domesticAndRelative-duplicata.repository';
import { EDocumentState, ICreateDuplicataDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { BaseDCService } from '@shared/services/baseDC.service';
import { HttpStatusCode } from 'axios';
import { ERROR_MESSAGE } from '@constants/messages';

export class DomesticAndRelativeDuplicataDCService extends BaseDCService<
	DomesticAndRelativeDuplicataDC,
	ICreateDuplicataDC,
	IUpdateRenewSpouseDC
> {
	repo = DomesticAndRelativeDuplicataDCRepo;

	/**
	 * Valide si une carte duplicata peut être marquée comme imprimée
	 * Une carte peut être imprimée si elle est CONFIRMED et non expirée
	 */
	validateCanPrint(card: DomesticAndRelativeDuplicataDC): void {
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
	validateCanUndoPrint(card: DomesticAndRelativeDuplicataDC): void {
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
