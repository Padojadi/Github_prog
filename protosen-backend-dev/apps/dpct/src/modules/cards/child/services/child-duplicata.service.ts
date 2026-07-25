import { ChildDuplicataDC } from 'database/models';
import { ChildDuplicataDCRepo } from '../repositories/child-duplicata.repository';
import { BaseDCService } from '@shared/services/baseDC.service';
import { EDocumentState, ICreateDuplicataDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { HttpStatusCode } from 'axios';
import { ERROR_MESSAGE } from '@constants/messages';

export class ChildDuplicataDCService extends BaseDCService<
	ChildDuplicataDC,
	ICreateDuplicataDC,
	IUpdateRenewSpouseDC
> {
	repo = ChildDuplicataDCRepo;

	/**
	 * Valide si une carte duplicata peut être marquée comme imprimée
	 * Une carte peut être imprimée si elle est CONFIRMED et non expirée
	 */
	validateCanPrint(card: ChildDuplicataDC): void {
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
	validateCanUndoPrint(card: ChildDuplicataDC): void {
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
