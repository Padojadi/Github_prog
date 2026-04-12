import db from 'database/models';
import dayjs from 'dayjs';
import { Op } from 'sequelize';
import { EDocumentState } from '@modules/cards/types';

// Re-export shared utils from @protosen/shared for backward compatibility
export { generateRandomCode, generateUUID, convertExpireTimeToMilliseconds } from '@protosen/shared';

export async function generateDCCardNumber(code: string): Promise<string> {
	try {
		const currentYear = new Date().getFullYear();

		const modelNames = [
			'OwnerDiplomaticCard',
			'ChildDC',
			'SpouseDC',
			'OtherDependantDC',
			'OtherStaffDC',
			'DomesticAndRelativeDC',
		];

		// Récupérer tous les numéros de carte existants pour l'année en cours
		const existingCards = await Promise.all(
			modelNames.map((modelName: string) =>
				(db as any)[modelName].findAll({
					attributes: ['cardNumber', 'firstName', 'lastName'],
					where: {
						cardNumber: { [Op.like]: `%-${currentYear}` }, // On récupère seulement celles de l'année actuelle
						documentStage: { [Op.in]: [EDocumentState.CONFIRMED, EDocumentState.PRINTED] },
					},
					order: [['cardNumber', 'ASC']],
				}),
			),
		);

		// Extraire et trier les numéros
		const existingNumbers = existingCards
			.flat()
			.map((card) => {
				const parts = card.dataValues.cardNumber.split('-');
				if (parts.length === 3 && Number(parts[2]) === currentYear) {
					return Number(parts[1]); // Récupère l'ordre dans l'année
				}
				return NaN;
			})
			.filter((num) => !isNaN(num))
			.sort((a, b) => a - b);

		// Trouver le premier numéro manquant
		let newIndex = 1;
		for (let i = 0; i < existingNumbers.length; i++) {
			if (existingNumbers[i] !== newIndex) {
				break; // Trouvé un trou dans la séquence
			}
			if (existingNumbers[i + 1] !== newIndex) {
				newIndex++;
			}
		}

		// Générer le nouveau numéro de carte
		const newCardNumber = `${code}-${newIndex}-${currentYear}`;

		return newCardNumber;
	} catch {
		throw new Error('Error generating card number:');
	}
}

export function getDateThreeYearsFromNow() {
	const currentDate = new Date();
	const threeYearsFromNow = new Date(
		currentDate.getFullYear() + 3,
		currentDate.getMonth(),
		currentDate.getDate(),
	);

	return threeYearsFromNow;
}

export const currentYear = dayjs().year();
