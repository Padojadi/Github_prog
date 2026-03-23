interface APIError {
  code: number;
  message: string;
}

export function isAPIError(error: any): error is APIError {
  return (
    error && typeof error.code === 'number' && typeof error.message === 'string'
  );
}

export const api_code: Record<string, APIError> = {
  MSG_201: { code: 201, message: 'Un utilisateur avec cet email existe déjà.' },

  // files
  MSG_202: { code: 202, message: "Erreur d'upload de fichier" },
  MSG_209: { code: 209, message: "Erreur de générarion l'URL présignée" },
  MSG_210: { code: 210, message: 'Echec de supression de fichier du bucket' },

  // conferences
  MSG_203: {
    code: 203,
    message: 'Erreur lors de la création de la demande de conférence.',
  },
  MSG_204: {
    code: 204,
    message: 'Erreur lors de la récupération des conférences.',
  },
  MSG_205: { code: 205, message: 'Conférence introuvable.' },
  MSG_206: {
    code: 206,
    message: 'Erreur lors de la mise à jour de la conférence.',
  },
  MSG_207: {
    code: 207,
    message:
      'Suppression impossible : conférence non trouvée ou non autorisée.',
  },
  MSG_208: {
    code: 208,
    message:
      "Suppression impossible : seul l'auteur peut supprimer une conférence en attente.",
  },
  MSG_211: {
    code: 211,
    message:
      "Vous n'avez pas les permissions nécessaires pour effectuer cette action.",
  },
  MSG_212: {
    code: 212,
    message: 'Erreur de validation de la demande de  conférence',
  },
  MSG_213: {
    code: 213,
    message: 'Erreur de rejet de la demande de conférence',
  },
  MSG_214: {
    code: 214,
    message: 'Erreur de rejet de la demande de conférence',
  },
  MSG_215: {
    code: 215,
    message:
      "Le statut de cette conférence ne vous permet pas d'effectuer cette action",
  },
  MSG_216: {
    code: 216,
    message: "Erreur lors de la création de l'hébergement",
  },
  MSG_217: {
    code: 217,
    message: 'Erreur lors de la récupération des hébergements',
  },
  MSG_218: {
    code: 218,
    message: "Erreur lors de la récupération de l'hébergement",
  },
  MSG_219: {
    code: 219,
    message: "Erreur lors de la mise à jour de l'hébergement",
  },
  MSG_220: {
    code: 220,
    message: 'Suppression impossible : hébergement non trouvé ou non autorisé',
  },
  MSG_221: {
    code: 221,
    message: 'Erreur lors de la création de la conférence.',
  },
  MSG_222: {
    code: 222,
    message: 'Erreur lors de la création du ticket',
  },
  MSG_223: {
    code: 223,
    message: 'Erreur lors de la récupération des tickets',
  },
  MSG_224: {
    code: 224,
    message:
      "Erreur lors de la récupération du ticket ou le ticket n'existe pas",
  },
  MSG_225: {
    code: 225,
    message: 'Erreur lors de la mise à jour du ticket',
  },
  MSG_226: {
    code: 226,
    message: 'Suppression impossible : ticket non trouvé ou non autorisé',
  },
  MSG_227: {
    code: 227,
    message:
      'Ce ticket est entrain ou est deja acheté et ne peut plus donc etre modifié',
  },
  MSG_228: {
    code: 228,
    message: "Une erreur est survenue lors de l'enregistrement du participant.",
  },
  MSG_229: {
    code: 229,
    message: 'Ticket non trouvé.',
  },
  MSG_230: {
    code: 230,
    message: "Le ticket n'appartient pas à la conférence sélectionnée.",
  },
  MSG_231: {
    code: 231,
    message: 'Hébergement non trouvé.',
  },
  MSG_232: {
    code: 232,
    message: "L'hébergement n'est pas rattaché à la conférence sélectionnée.",
  },
  MSG_233: {
    code: 233,
    message: "Some accommodation Ids doesn't exist.",
  },
  MSG_234: {
    code: 234,
    message: 'Insufficient permissions to perform this action.',
  },
  MSG_235: {
    code: 235,
    message: 'No token provided',
  },
  MSG_236: {
    code: 236,
    message: 'Invalid token format',
  },
  MSG_237: {
    code: 237,
    message: 'Invalid token or user not confirmed',
  },
  MSG_238: {
    code: 238,
    message: 'Erreur de récupération du participant',
  },
  MSG_239: {
    code: 239,
    message: 'Vous avez déja une inscription en cours pour cette conférence',
  },
  MSG_240: {
    code: 240,
    message: "Erreur lors de l'envoi du code de connexion",
  },
  MSG_241: {
    code: 241,
    message: 'Code de connexion incorrect',
  },
  MSG_242: {
    code: 242,
    message: 'Erreur lors de la validation du code de connexion',
  },
  MSG_243: {
    code: 243,
    message: 'Participant introuvable',
  },
  MSG_244: {
    code: 244,
    message: 'Erreur lors de la création de la fonction',
  },
  MSG_245: {
    code: 245,
    message: 'Erreur lors de la récupération des fonctions',
  },
  MSG_246: {
    code: 246,
    message: 'Erreur lors de la mise à jour de la fonction',
  },
  MSG_247: {
    code: 247,
    message: 'La fonction n’existe pas',
  },
  MSG_248: {
    code: 248,
    message:
      'La fonction n’existe pas ou ne peut pas être supprimée car, utilisée par des participants',
  },
  MSG_249: {
    code: 249,
    message: 'Erreur lors de la création de l’option de prise en charge',
  },
  MSG_250: {
    code: 250,
    message: 'Erreur lors de la récupération des options de prise en charge',
  },
  MSG_251: {
    code: 251,
    message: 'Erreur lors de la mise à jour de l’option de prise en charge',
  },
  MSG_252: {
    code: 252,
    message: 'L’option de prise en charge n’existe pas',
  },
  MSG_253: {
    code: 253,
    message: 'Erreur lors de la suppression de l’option de prise en charge',
  },
  MSG_254: {
    code: 254,
    message: 'Erreur lors de la création du type de participant',
  },
  MSG_255: {
    code: 255,
    message: 'Erreur lors de la récupération des types de participant',
  },
  MSG_256: {
    code: 256,
    message: 'Le type de participant n’existe pas',
  },
  MSG_257: {
    code: 257,
    message: 'Erreur lors de la mise à jour du type de participant',
  },
  MSG_258: {
    code: 258,
    message: 'Erreur lors de la suppression du type de participant',
  },
  MSG_259: {
    code: 259,
    message: 'Erreur lors de l’affectation des types de participant',
  },
  MSG_260: {
    code: 260,
    message: 'Erreur lors de la récupération des types de participant assignés',
  },
};

export const api_code_to_json = Object.values(api_code).reduce(
  (acc, { code, message }) => {
    acc[code] = message;
    return acc;
  },
  {},
);
