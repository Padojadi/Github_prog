import { UsersService } from '@modules/user/services/user.service';
import sendEmail, { smtp } from '@shared/utils/mailer';
import { AUTH_MESSAGES } from 'src/constants';
import log from '@shared/utils/logger';

export class SharedDCService {
	async sendMailWhenUserSubmitDCProccess(
		userEmail: string,
		organismId: string,
		cardId: string,
		applicant: string,
	) {
		try {
			const admin = await new UsersService().getOne({ organismId: organismId });
			if (admin) {
				await sendEmail({
					from: smtp.user,
					to: admin.email,
					subject: AUTH_MESSAGES.DC_CARD,
					text: `La carte ${cardId} pour ${applicant} est en attente de validation`,
				});
			}
			await sendEmail({
				from: smtp.user,
				to: userEmail,
				subject: AUTH_MESSAGES.DC_CARD,
				text: 'Votre demande a été bien soumise pour validation',
			});

			return;
		} catch (error) {
			log.error({ error, userEmail, organismId }, 'Failed to send submit DC email');
			throw error;
		}
	}
	async sendMailWhenAdminRejectDC(userEmail: string, adminEmail: string) {
		try {
			await sendEmail({
				from: adminEmail,
				to: userEmail,
				subject: AUTH_MESSAGES.DC_CARD,
				text: 'Votre demande de carte a été refusé',
			});

			return;
		} catch (error) {
			log.error({ error, userEmail }, 'Failed to send admin reject DC email');
			throw error;
		}
	}
	async sendMailWhenAdminApproveDC(
		superadminEmail: string,
		adminEmail: string,
		cardId: string,
		applicant: string,
	) {
		try {
			await sendEmail({
				from: adminEmail,
				to: superadminEmail,
				subject: AUTH_MESSAGES.DC_CARD,
				text: `La carte ${cardId} pour ${applicant} est en attente de validation`,
			});

			return;
		} catch (error) {
			log.error({ error, cardId }, 'Failed to send admin approve DC email');
			throw error;
		}
	}
	async sendMailWhenSuperAdminConfirmDC(
		superadminEmail: string,
		adminEmail: string,
		cardId: string,
		applicant: string,
	) {
		try {
			await sendEmail({
				from: superadminEmail,
				to: adminEmail,
				subject: AUTH_MESSAGES.DC_CARD,
				text: `La carte ${cardId} pour ${applicant} à été confirmée et prête pour impression`,
			});

			return;
		} catch (error) {
			log.error({ error, cardId }, 'Failed to send superadmin confirm DC email');
			throw error;
		}
	}

	async sendMailWhenSuperAdminRejectDC(
		superadminEmail: string,
		adminEmail: string,
		cardId: string,
		applicant: string,
	) {
		try {
			await sendEmail({
				from: superadminEmail,
				to: adminEmail,
				subject: AUTH_MESSAGES.DC_CARD,
				text: `La carte ${cardId} pour ${applicant} à été réjétée`,
			});

			return;
		} catch (error) {
			log.error({ error, cardId }, 'Failed to send superadmin reject DC email');
			throw error;
		}
	}
}
