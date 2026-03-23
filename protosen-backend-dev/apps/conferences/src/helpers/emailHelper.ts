import { Conference } from '@prisma/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Génère le contenu HTML du mail de rejet d'inscription à une conférence.
 * @param {Object} oldConference - Données de la conférence
 * @param {string} oldConference.title - Titre de la conférence
 * @param {string|Date} oldConference.startDate - Date de début
 * @param {string|Date} oldConference.endDate - Date de fin
 * @param {string} oldConference.location - Lieu
 * @param {string} oldConference.rejectionReason - Motifs du rejet
 * @returns {string} - HTML du mail
 */
export function generateRejectionEmailHtml(
  oldConference: Conference,
  rejectionReason: string,
): string {
  const startDateFormatted = format(
    new Date(oldConference.startDate),
    'dd/MM/yyyy',
    { locale: fr },
  );
  const endDateFormatted = format(
    new Date(oldConference.endDate),
    'dd/MM/yyyy',
    { locale: fr },
  );

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
      <h2 style="color: #c0392b;">Inscription rejetée</h2>
      <p>
        La demande d’inscription de <strong>${oldConference.title}</strong><br/>
        prévue <strong>du ${startDateFormatted} au ${endDateFormatted}</strong><br/>
        à <strong>${oldConference.location}</strong><br/>
        a été malheureusement rejetée pour les motifs suivants :
      </p>
      <blockquote style="background-color: #f8d7da; padding: 15px; border-left: 5px solid #c0392b; color: #721c24; margin: 20px 0;">
        ${rejectionReason}
      </blockquote>
      <p>Merci et à bientôt.</p>
      <a href="https://votre-lien-de-retour.com" style="display: inline-block; margin-top: 15px; padding: 10px 15px; background-color: #6c757d; color: #fff; text-decoration: none; border-radius: 5px;">Retour</a>
    </div>
  `;
}

/**
 * Génère le contenu HTML du mail de confirmation d'inscription à une conférence.
 * @param {Object} oldConference - Données de la conférence
 * @param {string} oldConference.title - Titre de la conférence
 * @param {string|Date} oldConference.startDate - Date de début
 * @param {string|Date} oldConference.endDate - Date de fin
 * @param {string} oldConference.location - Lieu
 * @returns {string} - HTML du mail
 */
export function generateConfirmationEmailHtml(
  oldConference: Conference,
): string {
  const startDateFormatted = format(
    new Date(oldConference.startDate),
    'dd/MM/yyyy',
    { locale: fr },
  );
  const endDateFormatted = format(
    new Date(oldConference.endDate),
    'dd/MM/yyyy',
    { locale: fr },
  );

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
      <h2 style="color: #2c3e50;">Confirmation d'inscription à la conférence</h2>
      <p>
        La demande d’inscription de la conférence <strong>${oldConference.title}</strong><br/>
        prévue <strong>du ${startDateFormatted} au ${endDateFormatted}</strong><br/>
        à <strong>${oldConference.location}</strong> a été confirmée et publiée avec succès.
      </p>
      <p>Merci et à bientôt.</p>
    </div>
  `;
}

/**
 * Génère le contenu HTML du mail de réception de la demande d'inscription.
 * @param {Object} oldConference - Données de la conférence
 * @param {string} oldConference.title - Titre de la conférence
 * @param {string|Date} oldConference.startDate - Date de début
 * @param {string|Date} oldConference.endDate - Date de fin
 * @param {string} oldConference.location - Lieu
 * @returns {string} - HTML du mail
 */
export function generateReceptionEmailHtml(oldConference: Conference): string {
  const startDateFormatted = format(
    new Date(oldConference.startDate),
    'dd/MM/yyyy',
    { locale: fr },
  );
  const endDateFormatted = format(
    new Date(oldConference.endDate),
    'dd/MM/yyyy',
    { locale: fr },
  );

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
      <h2 style="color: #2c3e50;">Réception de votre demande</h2>
      <p>
        La demande d’inscription de <strong>${oldConference.title}</strong><br/>
        prévue <strong>du ${startDateFormatted} au ${endDateFormatted}</strong><br/>
        à <strong>${oldConference.location}</strong> a été prise en compte.
      </p>
      <p>Un e-mail vous sera envoyé pour vous informer de la suite donnée à votre demande.</p>
      <p>Merci et à bientôt.</p>
    </div>
  `;
}

/**
 * Génère le contenu HTML de l'email de confirmation d'inscription avec liens.
 * @param {Object} options - Détails de la conférence et de l'utilisateur
 * @param {string} options.title - Nom de la conférence
 * @param {Date|string} options.startDate
 * @param {Date|string} options.endDate
 * @param {string} options.location
 * @param {string} options.ticketUrl - Lien vers le ticket PDF ou page
 * @param {string|null} options.paymentUrl - Lien vers la page de paiement (null si gratuit)
 * @returns {string} - Contenu HTML
 */
export function generateAcceptedEmailHtml({
  title,
  startDate,
  endDate,
  location,
  ticketUrl,
  paymentUrl,
}: {
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  location: string;
  ticketUrl: string | null;
  paymentUrl: string | null;
}): string {
  const startDateFormatted = format(new Date(startDate), 'dd/MM/yyyy', {
    locale: fr,
  });
  const endDateFormatted = format(new Date(endDate), 'dd/MM/yyyy', {
    locale: fr,
  });

  return `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #2c3e50; text-align: center;">🎉 Inscription Confirmée</h2>

      <p style="font-size: 16px;">
        Bonjour,
        <br><br>
        Votre demande d'inscription à <strong>${title}</strong> a été <span style="color: #27ae60; font-weight: bold;">acceptée</span> !
      </p>

      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p><strong>📅 Dates :</strong> du ${startDateFormatted} au ${endDateFormatted}</p>
        <p><strong>📍 Lieu :</strong> ${location}</p>
      </div>

      ${
        paymentUrl
          ? `
        <p style="font-size: 16px;">Veuillez finaliser votre inscription en procédant au paiement :</p>
        <p style="text-align: center;">
          <a href="${paymentUrl}" style="background-color: #27ae60; color: #fff; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Payer maintenant</a>
        </p>
      `
          : `
        <p style="font-size: 16px;">Aucun paiement requis : la participation est <strong>gratuite</strong>.</p>
      `
      }

      ${
        ticketUrl
          ? `
        <p style="font-size: 16px;">Accédez à votre ticket ici :</p>
        <p style="text-align: center;">
          <a href="${ticketUrl}" style="background-color: #2980b9; color: #fff; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Voir mon ticket</a>
        </p>
        `
          : ''
      }

      <p style="margin-top: 30px;">Merci et à très bientôt,</p>
      <p>L’équipe organisatrice</p>
    </div>
  `;
}

/**
 * Génère le contenu HTML du mail de rejet de la demande d’inscription.
 * @returns {string}
 */
export function generateRejectedEmailHtml({
  title,
  startDate,
  endDate,
  location,
  reason,
}): string {
  const startDateFormatted = format(new Date(startDate), 'dd/MM/yyyy', {
    locale: fr,
  });
  const endDateFormatted = format(new Date(endDate), 'dd/MM/yyyy', {
    locale: fr,
  });

  return `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #c0392b; text-align: center;">😕 Demande rejetée</h2>

      <p style="font-size: 16px;">
        Bonjour,
        <br><br>
        Nous avons bien reçu votre demande pour la conférence <strong>${title}</strong> prévue du <strong>${startDateFormatted}</strong> au <strong>${endDateFormatted}</strong> à <strong>${location}</strong>.
      </p>

      <p style="font-size: 16px; color: #c0392b; font-weight: bold;">
        Malheureusement, votre demande a été rejetée.
      </p>

      <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-left: 5px solid #c0392b; border-radius: 5px; margin: 20px 0;">
        <strong>Motif :</strong><br/> ${reason}
      </div>

      <p>Merci de votre compréhension.</p>
      <p>L’équipe organisatrice</p>
    </div>
  `;
}

/**
 * Génère un email après paiement réussi : accès à la conférence, ticket et modification profil.
 * @param {Object} options
 * @param {string} options.title - Nom de la conférence
 * @param {Date|string} options.startDate
 * @param {Date|string} options.endDate
 * @param {string} options.location
 * @param {string} options.conferenceUrl - Lien d'accès à la conférence
 * @param {string} options.ticketUrl - Lien pour voir/télécharger le ticket
 * @param {string} options.editProfileUrl - Lien pour modifier ses infos (email, nom, etc.)
 * @returns {string} - Contenu HTML
 */
export function generatePaymentSuccessEmailHtml({
  title,
  startDate,
  endDate,
  location,
  conferenceUrl,
  ticketUrl,
  editProfileUrl,
}) {
  const startDateFormatted = format(new Date(startDate), 'dd/MM/yyyy', {
    locale: fr,
  });
  const endDateFormatted = format(new Date(endDate), 'dd/MM/yyyy', {
    locale: fr,
  });

  return `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #27ae60; text-align: center;">✅ Paiement confirmé</h2>

      <p style="font-size: 16px;">
        Bonjour,
        <br><br>
        Votre paiement pour <strong>${title}</strong> a bien été reçu.<br/>
        La conférence aura lieu du <strong>${startDateFormatted}</strong> au <strong>${endDateFormatted}</strong> à <strong>${location}</strong>.
      </p>

      <div style="background-color: #f0f8f5; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p><strong>🎟️ Accédez à la conférence :</strong></p>
        <p style="text-align: center;">
          <a href="${conferenceUrl}" style="background-color: #2980b9; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Entrer dans la conférence</a>
        </p>

        <p><strong>📄 Télécharger votre ticket :</strong></p>
        <p style="text-align: center;">
          <a href="${ticketUrl}" style="background-color: #2ecc71; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Voir mon ticket</a>
        </p>

        <p><strong>📝 Modifier vos informations :</strong></p>
        <p style="text-align: center;">
          <a href="${editProfileUrl}" style="background-color: #f39c12; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Modifier mes infos</a>
        </p>
      </div>

      <p style="margin-top: 30px;">Merci pour votre inscription, et à très bientôt !</p>
      <p>L’équipe organisatrice</p>
    </div>
  `;
}

/**
 * Construit un template HTML d'email contenant un code de connexion.
 * @param code - Le code de connexion à afficher dans l'email (ex: '123456').
 * @returns Une string contenant le HTML complet prêt à être envoyé par email.
 */
export function buildLoginCodeEmailTemplate(code: number): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Code de connexion</title>
      <style>
        body {
          background-color: #f4f4f7;
          font-family: Arial, sans-serif;
          padding: 20px;
          margin: 0;
        }
        .container {
          max-width: 500px;
          background-color: #ffffff;
          margin: 0 auto;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #333333;
          font-size: 24px;
        }
        .code-box {
          background-color: #f0f0f5;
          padding: 15px;
          text-align: center;
          font-size: 32px;
          letter-spacing: 6px;
          border-radius: 6px;
          font-weight: bold;
          color: #333;
          margin: 20px 0;
        }
        .text {
          font-size: 16px;
          color: #555555;
          line-height: 1.5;
          text-align: center;
        }
        .footer {
          text-align: center;
          font-size: 13px;
          color: #999999;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Voici votre code de connexion</h1>
        </div>
        <div class="text">
          Utilisez le code ci-dessous pour vous connecter à votre conférence. Ce code expire dans 15 minutes.
        </div>
        <div class="code-box">${code}</div>
        <div class="text">
          Si vous n’avez pas demandé ce code, vous pouvez ignorer cet e-mail.
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} PROTOSEN. Tous droits réservés.
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generatePaiementConfirmationHtml({
  conferenceName,
  startDate,
  endDate,
  location,
  receiptUrl,
  ticketUrl,
}) {
  const startDateFormatted = format(new Date(startDate), 'dd/MM/yyyy', {
    locale: fr,
  });
  const endDateFormatted = format(new Date(endDate), 'dd/MM/yyyy', {
    locale: fr,
  });
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Paiement confirmé - ${conferenceName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      padding: 40px;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #fff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      text-align: center;
    }
    h1 {
      color: #2e7d32;
    }
    .info {
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #2e7d32;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      margin-top: 40px;
      font-size: 14px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Paiement validé ✅</h1>
    <p class="info">
      Merci pour votre inscription à la conférence <strong>${conferenceName}</strong><br>
      du <strong>${startDateFormatted}</strong> au <strong>${endDateFormatted}</strong> à <strong>${location}</strong>.
    </p>
    <p class="info">
      Votre paiement a bien été reçu.
      ${
        receiptUrl
          ? `Vous pouvez <a href="${receiptUrl}" target="_blank">télécharger votre reçu ici</a>.`
          : `Vous allez recevoir votre reçu par email dans quelques instants.`
      }
    </p>
    <a href=${ticketUrl} class="button">Accédez à votre ticket ici</a>

    <div class="footer">
      Si vous ne recevez pas votre reçu, merci de vérifier votre dossier spam ou contactez notre support.
    </div>
  </div>
</body>
</html>
  `;
}
