/**
 * Enumération des permissions d'un user
 * @description ACCESS_CONFERENCE_MODULE : Acceder au module conférence
 * @description REQUEST_CONFERENCE : Creer, modifier et supprimer une demande de conférence
 * @description ACCEPT_CONFERENCE_REQUEST : Accepter des demandes de conférences
 * @description VALIDATE_CONFERENCE_REQUEST : Valider une demande de conférence
 * @description CONFIRM_CONFERENCE_REQUEST : Confirmer des demandes de conférences (primature)
 * @description MANAGE_CONFERENCES : Gérer les conférences (protosen)
 * @description ACCESS_CARD_MODULE : Accéder au module cartes
 * @description ACCESS_HONOR_LOUNGE_MODULE : Accéder au module salon d'honneur
 */
export enum UserPermission {
	ACCESS_CONFERENCE_MODULE = 'ACCESS_CONFERENCE_MODULE',
	REQUEST_CONFERENCE = 'REQUEST_CONFERENCE',
	ACCEPT_CONFERENCE_REQUEST = 'ACCEPT_CONFERENCE_REQUEST',
	VALIDATE_CONFERENCE_REQUEST = 'VALIDATE_CONFERENCE_REQUEST',
	CONFIRM_CONFERENCE_REQUEST = 'CONFIRM_CONFERENCE_REQUEST',
	MANAGE_CONFERENCES = 'MANAGE_CONFERENCES',
	ACCESS_CARD_MODULE = 'ACCESS_CARD_MODULE',
	ACCESS_HONOR_LOUNGE_MODULE = 'ACCESS_HONOR_LOUNGE_MODULE',
}
