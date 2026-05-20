export const apiCodes = {
  "201": "Un utilisateur avec cet email existe déjà.",
  "202": "Erreur d'upload de fichier",
  "203": "Erreur lors de la création de la demande de conférence.",
  "204": "Erreur lors de la récupération des conférences.",
  "205": "Conférence introuvable.",
  "206": "Erreur lors de la mise à jour de la conférence.",
  "207": "Suppression impossible : conférence non trouvée ou non autorisée.",
  "208":
    "Suppression impossible : seul l'auteur peut supprimer une conférence en attente.",
  "209": "Erreur de générarion l'URL présignée",
  "210": "Echec de supression de fichier du bucket",
  "211":
    "Vous n'avez pas les permissions nécessaires pour effectuer cette action.",
  "212": "Erreur de validation de la demande de  conférence",
  "213": "Erreur de rejet de la demande de conférence",
  "214": "Erreur de rejet de la demande de conférence",
  "215":
    "Le statut de cette conférence ne vous permet pas d'effectuer cette action",
  "216": "Erreur lors de la création de l'hébergement",
  "217": "Erreur lors de la récupération des hébergements",
  "218": "Erreur lors de la récupération de l'hébergement",
  "219": "Erreur lors de la mise à jour de l'hébergement",
  "220": "Suppression impossible : hébergement non trouvé ou non autorisé",
  "221": "Erreur lors de la création de la conférence.",
  "222": "Erreur lors de la création du ticket",
  "223": "Erreur lors de la récupération des tickets",
  "224": "Erreur lors de la récupération du ticket ou le ticket n'existe pas",
  "225": "Erreur lors de la mise à jour du ticket",
  "226": "Suppression impossible : ticket non trouvé ou non autorisé",
  "227":
    "Ce ticket est entrain ou est deja acheté et ne peut plus donc etre modifié",
  "228": "Une erreur est survenue lors de l'enregistrement du participant.",
	"229": "Ticket non trouvé.",
	"230": "Le ticket n'appartient pas à la conférence sélectionnée.",
	"231": "Hébergement non trouvé.",
  "232": "L'hébergement n'est pas rattaché à la conférence sélectionnée.",
  "233": "Some accommodation Ids doesn't exist.",
	"234": "Insufficient permissions to perform this action.",
	"235": "No token provided",
	"236": "Invalid token format",
	"237": "Invalid token or user not confirmed",
	"238": "Erreur de récupération du participant",
  "239": "Vous avez déja une inscription en cours pour cette conférence",
  "240": "Erreur lors de l'envoi du code de connexion",
	"241": "Code de connexion incorrect",
	"242": "Erreur lors de la validation du code de connexion",
	"243": "Participant introuvable"
};

/**
 * Récupère le message d'erreur correspondant à un code d'API
 * @param code - Le code d'erreur (sous forme de nombre ou de chaîne)
 * @returns Le message d'erreur correspondant ou un message par défaut si le code n'existe pas
 */
export const getApiErrorMessage = (code: number | string): string => {
  // Convertir le code en chaîne au cas où il est fourni comme nombre
  const codeStr = code.toString();

  // Vérifier si le code existe dans notre objet apiCodes
  if (codeStr in apiCodes) {
    return apiCodes[codeStr as keyof typeof apiCodes];
  }

  // Message par défaut si le code n'est pas trouvé
  return "Une erreur inconnue s'est produite.";
};
