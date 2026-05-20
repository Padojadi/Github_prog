import { Op } from 'sequelize';
import db, { OwnerDiplomaticCard, Institution } from 'database/models';
import log from '../shared/utils/logger';
import { RenewOwnerDCService } from '../modules/cards/owner/services/owner-renew.service';
import { generateDCCardNumber } from '../shared/utils/functions';
import { EDocumentState } from '../modules/cards/types/card.types';
import { StatusEnum } from '../shared/types/common.types';
import { RenewSpouseDCService } from '../modules/cards/spouse/services/spouse-renew.service';
import { RenewChildDCService } from '../modules/cards/child/services/child-renew.service';
import { RenewOtherDependantDCService } from '../modules/cards/otherDependant/services/otherDependant-renew.service';
import { RenewDomesticAndRelativeDCService } from '../modules/cards/domesticAndRelative/services/domesticAndRelative-renew.service';
import { RenewOtherStaffDCService } from '../modules/cards/otherStaff/services/otherStaff-renew.service';

export async function updateExpiredStatusOwner() {
	try {
		const currentDate = new Date();
		const oneMonthLater = new Date();
		oneMonthLater.setMonth(currentDate.getMonth() + 1);

		const cardsToUpdate = await db.OwnerDiplomaticCard.findAll({
			where: {
				validUntil: {
					[Op.lte]: currentDate,
				},
				expired: false,
				documentStage: {
					[Op.in]: [EDocumentState.CONFIRMED, EDocumentState.PRINTED],
				},
			},
			include: [{ model: Institution, as: 'organism' }],
		});

		for (const card of cardsToUpdate) {
			await card.update({
				expired: true,
			});
			const code = card.organism?.code;

			if (code) {
				const newCardNumber = await generateDCCardNumber(code);
				await new RenewOwnerDCService().save({
					previousCardId: card.id,
					cardNumber: newCardNumber,
				});
			}
		}

		log.info(
			`${cardsToUpdate.length} demande de renouvellement  de carte expirees pour titulaires crées`,
		);
		return;
	} catch (error: unknown) {
		log.error(error, 'Error updating expired status:');
		return;
	}
}

async function updateExpiredStatusForDC(modelName: string, service: any, cardType: string) {
	try {
		const currentDate = new Date();
		const oneMonthLater = new Date();
		oneMonthLater.setMonth(currentDate.getMonth() + 1);
		const cardsToUpdate = await (db as any)[modelName].findAll({
			where: {
				validUntil: {
					[Op.lte]: currentDate,
				},
				expired: false,
				documentStage: {
					[Op.in]: [EDocumentState.CONFIRMED, EDocumentState.PRINTED],
				},
			},
			include: [{ model: Institution, as: 'organism' }, OwnerDiplomaticCard],
		});

		for (const card of cardsToUpdate) {
			await card.update({
				expired: true,
			});
			const organism = await card.ownerDiplomaticCard.$get('organism');
			const code = organism?.code;
			if (code) {
				const newCardNumber = await generateDCCardNumber(code);
				await new service().save({
					previousCardId: card.id,
					cardNumber: newCardNumber,
				});
			}
		}

		log.info(
			`${cardsToUpdate.length} demande de renouvellement  de carte expirees de ${cardType} crees.`,
		);
		return;
	} catch (error) {
		console.error(`Error updating expired status for ${cardType}:`, error);
		return;
	}
}

export async function updateExpiredStatusSpouse() {
	await updateExpiredStatusForDC('SpouseDC', RenewSpouseDCService, 'epoux(ses)');
}

export async function updateExpiredStatusOtherStaff() {
	await updateExpiredStatusForDC('OtherStaffDC', RenewOtherStaffDCService, 'autre staff');
}

export async function updateExpiredStatusOtherDependant() {
	await updateExpiredStatusForDC(
		'OtherDependantDC',
		RenewOtherDependantDCService,
		'autres dependants',
	);
}

export async function updateExpiredStatusChild() {
	await updateExpiredStatusForDC('ChildDC', RenewChildDCService, 'enfants');
}

export async function updateExpiredStatusDomesticeAndRelative() {
	await updateExpiredStatusForDC(
		'DomesticAndRelativeDC',
		RenewDomesticAndRelativeDCService,
		'domestic and relative',
	);
}

//check for expired renewed diplomatic card
export async function updateExpiredStatusForRenewedDC(
	modelName: string,
	service: any,
	cardType: string,
	includeModelName: string,
) {
	try {
		const currentDate = new Date();
		const oneMonthLater = new Date();
		oneMonthLater.setMonth(currentDate.getMonth() + 1);
		const cardsToUpdate = await (db as any)[modelName].findAll({
			where: {
				[Op.or]: [
					{
						newDateEndOfMission: {
							[Op.lt]: currentDate,
						},
					},
					{
						newDateEndOfMission: {
							[Op.between]: [currentDate, oneMonthLater],
						},
					},
				],
				expired: false,
				documentStage: EDocumentState.CONFIRMED,
				status: StatusEnum.ACTIVE,
			},
			include: [(db as any)[includeModelName]],
		});

		for (const card of cardsToUpdate) {
			const code = card.cardNumber.split('-')[0];

			if (code) {
				await card.update({
					expired: true,
				});
				const newCardNumber = await generateDCCardNumber(code);
				await new service().save({
					previousCardId: card.previousCardId,
					cardNumber: newCardNumber,
				});
			}
		}

		log.info(`${cardsToUpdate.length} cartes renouvellees expiré de ${cardType} crees.`);
		return;
	} catch (error: unknown) {
		log.error(error, `Error updating expired status for renewed ${cardType} carts:`);
		return;
	}
}

export async function updateExpiredStatusOwnerRenewed() {
	await updateExpiredStatusForRenewedDC(
		'RenewOwnerDC',
		RenewOwnerDCService,
		'titulaires',
		'OwnerDiplomaticCard',
	);
}

export async function updateExpiredStatusSpouseRenewed() {
	await updateExpiredStatusForRenewedDC(
		'RenewSpouseDC',
		RenewSpouseDCService,
		'expoux(ses)',
		'SpouseDC',
	);
}

export async function updateExpiredStatusChildRenewed() {
	await updateExpiredStatusForRenewedDC('RenewChildDC', RenewChildDCService, 'enfants', 'ChildDC');
}

export async function updateExpiredStatusOtherStaffRenewed() {
	await updateExpiredStatusForRenewedDC(
		'RenewOtherStaffDC',
		RenewOtherStaffDCService,
		'autre staff',
		'OtherStaffDC',
	);
}

export async function updateExpiredStatusOtherDependantRenewed() {
	await updateExpiredStatusForRenewedDC(
		'RenewOtherDependantDC',
		RenewOtherDependantDCService,
		'autre staff',
		'OtherDependantDC',
	);
}

export async function updateExpiredStatusDomesticAndRelativeRenewed() {
	await updateExpiredStatusForRenewedDC(
		'RenewDomesticAndRelativeDC',
		RenewDomesticAndRelativeDCService,
		'domestic et relative',
		'DomesticAndRelativeDC',
	);
}
