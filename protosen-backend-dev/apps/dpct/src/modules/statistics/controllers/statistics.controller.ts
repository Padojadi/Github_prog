import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import {
	OwnerDiplomaticCard,
	SpouseDC,
	DomesticAndRelativeDC,
	OtherDependantDC,
	OtherStaffDC,
	ChildDC,
	RenewOwnerDC,
	RenewSpouseDC,
	RenewChildDC,
	RenewDomesticAndRelativeDC,
	RenewOtherDependantDC,
	RenewOtherStaffDC,
	OwnerDuplicataDC,
	SpouseDuplicataDC,
	ChildDuplicataDC,
	DomesticAndRelativeDuplicataDC,
	OtherDependantDuplicataDC,
	OtherStaffDuplicataDC,
} from '@database/models';
import { Op } from 'sequelize';
import { UsersService } from '@modules/user/services/user.service';
import { AUTH_MESSAGES } from '@constants/index';
import { EDocumentState } from '@modules/cards/types';

type ModelType = {
	previousCardModel?: any;
	model: any;
	name: string;
};

class StatistiqueController {
	async cardStats(req: Request, res: Response) {
		try {
			const models: ModelType[] = [
				{ model: OwnerDiplomaticCard, name: 'Titulaire' },
				{ model: SpouseDC, name: 'Conjoint' },
				{ model: ChildDC, name: 'Enfants du Titulaire' },
				{ model: DomesticAndRelativeDC, name: 'Personnel de service, domestiques et familles' },
				{ model: OtherDependantDC, name: 'Autres Dépendants' },
				{ model: OtherStaffDC, name: 'Autres Personnels' },
			];

			const user = res.locals.user;
			const currentUser = await new UsersService().getUserById(user.id);
			if (!currentUser) {
				return res.status(HttpStatusCode.NotFound).json({
					message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND,
				});
			}

			// const isAdmin = currentUser.role === RoleEnum.ADMIN;
			const counts = await Promise.all(
				models.map(async ({ model, name }) => {
					// const whereCondition = isAdmin ? { organismId: currentUser.organismId } : {};

					const stages = [
						EDocumentState.ONHOLD,
						EDocumentState.PENDING,
						EDocumentState.REJECTED,
						EDocumentState.APPROVED,
						EDocumentState.CONFIRMED,
						EDocumentState.PRINTED,
					];

					const countsByStage = await Promise.all(
						stages.map((stage) =>
							model.count({
								where: {
									documentStage: stage,
									//     ...whereCondition,
								},
							}),
						),
					);

					const [onHold, pending, rejected, accepted, confirmed] = countsByStage;

					return {
						name,
						total: onHold + pending + rejected + accepted + confirmed,
						onHold,
						pending,
						rejected,
						accepted,
						confirmed,
					};
				}),
			);

			return res.status(HttpStatusCode.Ok).json({
				data: counts,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message || 'Internal server error',
			});
		}
	}

	async renewedCardStats(req: Request, res: Response) {
		try {
			const models: ModelType[] = [
				{ model: RenewOwnerDC, previousCardModel: OwnerDiplomaticCard, name: 'Titulaire' },
				{ model: RenewSpouseDC, previousCardModel: SpouseDC, name: 'Conjoint' },
				{ model: RenewChildDC, previousCardModel: ChildDC, name: 'Enfants du Titulaire' },
				{
					model: RenewDomesticAndRelativeDC,
					previousCardModel: DomesticAndRelativeDC,
					name: 'Personnel de service, domestiques et familles',
				},
				{
					model: RenewOtherDependantDC,
					previousCardModel: OtherDependantDC,
					name: 'Autres Dépendants',
				},
				{ model: RenewOtherStaffDC, previousCardModel: OtherStaffDC, name: 'Autres Personnels' },
			];

			const user = res.locals.user;
			const currentUser = await new UsersService().getUserById(user.id);
			if (!currentUser) {
				return res.status(HttpStatusCode.NotFound).json({
					message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND,
				});
			}

			// const isAdmin = currentUser.role === RoleEnum.ADMIN;
			const counts = await Promise.all(
				models.map(async ({ model, name }) => {
					// const whereCondition = isAdmin ? { '$previousCard.organismId$': currentUser.organismId } : {};

					const stages = [
						EDocumentState.ONHOLD,
						EDocumentState.PENDING,
						EDocumentState.REJECTED,
						EDocumentState.APPROVED,
						EDocumentState.CONFIRMED,
						EDocumentState.PRINTED,
					];

					const countsByStage = await Promise.all(
						stages.map((stage) =>
							model.count({
								where: {
									documentStage: stage,
									//     ...whereCondition,
								},
								// include: [{
								//   model: previousCardModel,
								//   required: isAdmin,
								// }],
							}),
						),
					);

					const [onHold, pending, rejected, accepted, confirmed] = countsByStage;

					return {
						name,
						total: onHold + pending + rejected + accepted + confirmed,
						onHold,
						pending,
						rejected,
						accepted,
						confirmed,
					};
				}),
			);

			return res.status(HttpStatusCode.Ok).json({
				data: counts,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message || 'Internal server error',
			});
		}
	}

	async duplicataCardStats(req: Request, res: Response) {
		try {
			const models: ModelType[] = [
				{ model: OwnerDuplicataDC, previousCardModel: OwnerDiplomaticCard, name: 'Titulaire' },
				{ model: SpouseDuplicataDC, previousCardModel: SpouseDC, name: 'Conjoint' },
				{ model: ChildDuplicataDC, previousCardModel: ChildDC, name: 'Enfants du Titulaire' },
				{
					model: DomesticAndRelativeDuplicataDC,
					previousCardModel: DomesticAndRelativeDC,
					name: 'Personnel de service, domestiques et familles',
				},
				{
					model: OtherDependantDuplicataDC,
					previousCardModel: OtherDependantDC,
					name: 'Autres Dépendants',
				},
				{
					model: OtherStaffDuplicataDC,
					previousCardModel: OtherStaffDC,
					name: 'Autres Personnels',
				},
			];

			const user = res.locals.user;
			const currentUser = await new UsersService().getUserById(user.id);
			if (!currentUser) {
				return res.status(HttpStatusCode.NotFound).json({
					message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND,
				});
			}

			// const isAdmin = currentUser.role === RoleEnum.ADMIN;

			const counts = await Promise.all(
				models.map(async ({ model, name }) => {
					// const whereCondition = isAdmin ? { '$previousCard.organismId$': currentUser.organismId } : {};

					const stages = [
						EDocumentState.ONHOLD,
						EDocumentState.PENDING,
						EDocumentState.REJECTED,
						EDocumentState.APPROVED,
						EDocumentState.CONFIRMED,
						EDocumentState.PRINTED,
					];

					const countsByStage = await Promise.all(
						stages.map((stage) =>
							model.count({
								where: {
									documentStage: stage,
									//     ...whereCondition,
								},
								// include: [{
								//   model: previousCardModel,
								//   required: isAdmin,
								// }],
							}),
						),
					);

					const [onHold, pending, rejected, accepted, confirmed] = countsByStage;

					return {
						name,
						total: onHold + pending + rejected + accepted + confirmed,
						onHold,
						pending,
						rejected,
						accepted,
						confirmed,
					};
				}),
			);

			return res.status(HttpStatusCode.Ok).json({
				data: counts,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message || 'Internal server error',
			});
		}
	}

	async generateCardNumber(code: string) {
		try {
			const currentDate = new Date();
			const currentYear = currentDate.getFullYear();
			const startDate = new Date(`${currentYear}-01-01`);
			const endDate = new Date(`${currentYear}-12-31`);

			// Array of models to count
			const models = [
				OwnerDiplomaticCard,
				ChildDC,
				SpouseDC,
				OtherDependantDC,
				OtherStaffDC,
				DomesticAndRelativeDC,
			];

			// Array of promises for counting records
			const countPromises = models.map((model: any) =>
				model.count({
					where: {
						createdAt: {
							[Op.between]: [startDate, endDate],
						},
					},
				}),
			);

			const countAllPromises = models.map((model: any) => model.count());

			// Execute count operations concurrently
			const counts = await Promise.all(countPromises);
			const countsAll = await Promise.all(countAllPromises);

			// Calculate total number of cards
			const totalYearCards = counts.reduce((total, count) => total + count, 0);
			const totalAllCards = countsAll.reduce((total, count) => total + count, 0);

			const newCardNumber = `${code}-${totalAllCards + 1}-${totalYearCards + 1}-${currentYear}`;

			// Respond with success
			return newCardNumber;
		} catch {
			return null;
		}
	}
}

export default new StatistiqueController();
