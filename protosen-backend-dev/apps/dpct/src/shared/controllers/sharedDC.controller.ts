import { User } from 'database/models/user';
import { UsersService } from '../../modules/user/services/user.service';
import { SharedDCService } from '../services/sharedDC.service';
import { StatusEnum } from '../types/common.types';
import {
	EAdminDocumentState,
	ESuperAdminDocumentState,
} from '../../modules/cards/types/card.types';
import { RoleEnum } from '../../modules/user/types/user.types';

class SharedDCController {
	async handleDCStageEmailBySuperAdmin(
		data: { documentStage: ESuperAdminDocumentState },
		currentUserEmail: string,
		card: { id: string; organismId: string },
		applicant: string,
	): Promise<void> {
		if (
			data.documentStage === ESuperAdminDocumentState.REJECTED ||
			data.documentStage === ESuperAdminDocumentState.CONFIRMED
		) {
			const admin = await new UsersService().getOne({
				role: RoleEnum.ADMIN,
				organismId: card.organismId,
			});
			if (admin) {
				if (data.documentStage === ESuperAdminDocumentState.REJECTED) {
					await new SharedDCService().sendMailWhenSuperAdminRejectDC(
						currentUserEmail,
						admin.email,
						card.id,
						applicant,
					);
				} else {
					await new SharedDCService().sendMailWhenSuperAdminConfirmDC(
						currentUserEmail,
						admin.email,
						card.id,
						applicant,
					);
				}
			}
		}
	}

	async handleDCStageEmailByAdmin(
		data: { documentStage: EAdminDocumentState },
		card: { email: string; id: string },
		currentUserEmail: string,
		applicant: any,
	): Promise<void> {
		if (data.documentStage === EAdminDocumentState.REJECTED && card.email) {
			await new SharedDCService().sendMailWhenAdminRejectDC(card.email, currentUserEmail);
		}

		if (data.documentStage === EAdminDocumentState.APPROVED) {
			const superadmin = await new UsersService().getOne({ role: RoleEnum.SUPERADMIN });
			if (superadmin) {
				await new SharedDCService().sendMailWhenAdminApproveDC(
					superadmin.email,
					currentUserEmail,
					card.id,
					applicant,
				);
			}
		}
	}

	async getCardByNumberHelper(cardNumber: string, userAuth: User, Service: any) {
		let card;
		switch (userAuth.role) {
			case RoleEnum.USER:
				card = await new Service().getOne({
					cardNumber: cardNumber,
					creatorId: userAuth.id,
					organismId: userAuth.organismId,
					status: StatusEnum.ACTIVE,
				});
				break;
			case RoleEnum.ADMIN:
			case RoleEnum.SUPERADMIN:
				card = await new Service().getOne({ cardNumber });
				break;
		}
		return card;
	}

	async getDCByPreviousIdHelper(id: string, userAuth: User, Service: any) {
		let card;
		switch (userAuth.role) {
			case RoleEnum.USER:
				card = await new Service().getOne({
					id: id,
					creatorId: userAuth.id,
					organismId: userAuth.organismId,
					status: StatusEnum.ACTIVE,
				});
				break;
			case RoleEnum.ADMIN:
			case RoleEnum.SUPERADMIN:
				card = await new Service().getOne({ id: id });
				break;
		}
		return card;
	}
}

export default SharedDCController;
