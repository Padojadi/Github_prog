export const permissions = [
  {
    label: "Accéder au module conférence",
    value: "ACCESS_CONFERENCE_MODULE",
    description: [
      "Voir les demandes de conférences de son organisme",
      "Voir les conférences créés dans le système sans pouvoir créer/modifier/supprimer",
    ],
  },
  {
    label: "Faire des demandes de conférence",
    value: "REQUEST_CONFERENCE",
    description: [
      "Créer, modifier et supprimer une demande de conférence faite par lui même.",
      "Suppression possible si pas encore de validation",
    ],
  },
  {
    label: "Accepter des demandes de conférences",
    value: "ACCEPT_CONFERENCE_REQUEST",
    description: [
      "Accepter une demande de conférence",
      "Vois toutes les demandes de conférences du système",
    ],
  },
  {
    label: "Valider des demandes de conférences",
    value: "VALIDATE_CONFERENCE_REQUEST",
    description: [
      "Valider une demande de conférence ou la rejeter ou la rejeter definitivement",
      "Vois toutes les demandes de conférences du système",
    ],
  },
  {
    label: "Confirmer des demandes de conférences (primature)",
    value: "CONFIRM_CONFERENCE_REQUEST",
    description: [
      "Peut confirmer les demandes de conférences",
    ],
  },
  {
    label: "Gérer les conférences",
    value: "MANAGE_CONFERENCES",
    description: [
      "Créer une conference une fois qu'elle est validée, la modifie aussi...",
      "Vois toutes les demandes de conférences du système",
      "Peut aussi voir les conférences crées",
      "Peut accepter les demandes de conférences",
    ],
  },
  {
    label: "Accès au module cartes",
    value: "ACCESS_CARD_MODULE",
    description: ["Accéder au module cartes"],
  },
  {
    label: "Accès au module VIP Lounge",
    value: "ACCESS_VIP_LOUNGE_MODULE",
    description: [
      "Consulter les salons VIP, créer des réservations et des demandes d'accès",
    ],
  },
  {
    label: "Gérer le module VIP Lounge",
    value: "MANAGE_VIP_LOUNGE",
    description: [
      "Administrer les salons VIP, traiter les réservations et valider/rejeter les demandes",
    ],
  },
] as const;
