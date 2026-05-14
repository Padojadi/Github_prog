import cron from 'node-cron';
import { Op } from 'sequelize';
import db from '@database/models';

export async function scheduleVerificationCodeCleanup() {
	cron.schedule('*/15 * * * *', async () => {
		const olderVerificationCodes = await db.User.findAll({
			where: {
				verification_code_ttl: { [Op.lte]: new Date() },
			},
		});

		await Promise.all(
			olderVerificationCodes.map(async (user) => {
				user.verification_code = null;
				user.verification_code_ttl = null;
				await user.save();
			}),
		);
	});
}
