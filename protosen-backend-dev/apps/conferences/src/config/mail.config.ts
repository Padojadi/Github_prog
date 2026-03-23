/* eslint-disable prettier/prettier */
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  secure: true,
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  logger: false,
});

async function sendEmail({
  to,
  subject,
  html,
  attachments = [],
}) {
  transporter.sendMail(
  
  { to, subject, html, attachments, text: '', from: process.env.MAIL_USER,  },
    (err: { message: string }, info: { messageId: any }) => {
      if (err) {
        Logger.debug('Error occurred. ' + err.message);
        return;
      }
      Logger.debug('Message sent: %s', info);
    },
  );
}

export default sendEmail;
