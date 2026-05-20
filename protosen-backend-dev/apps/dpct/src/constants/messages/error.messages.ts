/**
 * Messages d'erreur globaux
 */

export const ERROR_MESSAGES = {
	// Erreurs générales
	INTERNAL_SERVER_ERROR: 'Erreur interne du serveur',
	BAD_REQUEST: 'Requête invalide',
	NOT_FOUND: 'Ressource non trouvée',
	VALIDATION_ERROR: 'Erreur de validation des données',

	// Erreurs de base de données
	DATABASE_ERROR: 'Erreur de base de données',
	QUERY_FAILED: 'Échec de la requête',
	DUPLICATE_ENTRY: 'Entrée dupliquée',

	// Erreurs de fichier
	FILE_UPLOAD_ERROR: 'Erreur lors du téléchargement du fichier',
	FILE_TOO_LARGE: 'Fichier trop volumineux',
	INVALID_FILE_TYPE: 'Type de fichier non autorisé',

	// Erreurs de validation
	REQUIRED_FIELD: 'Ce champ est requis',
	INVALID_FORMAT: 'Format invalide',
	INVALID_EMAIL: 'Adresse email invalide',
	INVALID_DATE: 'Date invalide',
} as const;
