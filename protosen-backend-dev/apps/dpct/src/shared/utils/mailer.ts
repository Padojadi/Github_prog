import nodemailer, { SendMailOptions } from 'nodemailer';
import log from './logger';
import env from '@appconfig/env.config';

export const smtp = {
	user: env.MAIL_USER,
	pass: env.MAIL_PASS,
	host: env.MAIL_HOST,
};

const transporter = nodemailer.createTransport({
	host: smtp.host,
	secure: false,
	port: 587,
	auth: {
		user: smtp.user,
		pass: smtp.pass,
	},
	logger: true,
	ignoreTLS: true,
});

const sendEmail = async (payload: SendMailOptions) => {
	transporter.sendMail(payload, (err, info) => {
		if (err) {
			log.error(err, 'Error sending email');
			return;
		}
		log.info(`preview URL: ${nodemailer.getTestMessageUrl(info)}`);
	});
};

export default sendEmail;
