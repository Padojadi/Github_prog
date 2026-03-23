export const ticketsTypes = [
  { value: "type-1", label: "Modèle 1" },
  { value: "type-2", label: "Modèle 2" },
  // { value: "#6366f1", label: "Model 3" },
] as const;

export enum RegistrationStatus {
  processing = "PROCESSING",
  pendingPayment = "PENDING_PAYMENT",
  rejected = "REJECTED",
  paid = "PAID",
  cancelled = "CANCELLED",
  refunded = "REFUNDED",
}

export const conferenceFunctions = [
  // Rôles officiels et Politiques
  {
    id: 1,
    label: "Chef d'État/de Gouvernement",
    value: "chef_etat_gouvernement",
    category: "Officiels et Politiques",
    description:
      "La plus haute autorité politique d'un pays, participant aux discussions de haut niveau et à la prise de décisions stratégiques.",
  },
  {
    id: 2,
    label: "Ministre",
    value: "ministre",
    category: "Officiels et Politiques",
    description:
      "Membre du gouvernement en charge d'un portefeuille spécifique (ex: Affaires Étrangères, Finances, Santé), représentant son ministère et son pays.",
  },
  {
    id: 3,
    label: "Secrétaire d'État",
    value: "secretaire_etat",
    category: "Officiels et Politiques",
    description:
      "Membre du gouvernement ou haut fonctionnaire assistant un ministre dans un domaine précis.",
  },
  {
    id: 4,
    label: "Député/Sénateur",
    value: "depute_senateur",
    category: "Officiels et Politiques",
    description:
      "Représentant élu du peuple, membre du pouvoir législatif, participant aux débats et à l'élaboration des lois.",
  },
  {
    id: 5,
    label: "Ambassadeur/Représentant diplomatique",
    value: "ambassadeur_representant_diplomatique",
    category: "Officiels et Politiques",
    description:
      "Représentant officiel d'un pays auprès d'un autre État ou d'une organisation internationale.",
  },
  {
    id: 6,
    label: "Haut fonctionnaire/Directeur général",
    value: "haut_fonctionnaire_directeur_general",
    category: "Officiels et Politiques",
    description:
      "Cadre supérieur de l'administration publique, responsable de la mise en œuvre des politiques gouvernementales dans un domaine donné.",
  },
  {
    id: 7,
    label: "Conseiller ministériel/présidentiel",
    value: "conseiller_ministeriel_presidentiel",
    category: "Officiels et Politiques",
    description:
      "Expert apportant son expertise et ses recommandations à un ministre ou au chef d'État.",
  },
  {
    id: 8,
    label: "Représentant d'organisation internationale",
    value: "representant_organisation_internationale",
    category: "Officiels et Politiques",
    description:
      "Délégué officiel d'une entité comme l'ONU, l'Union Africaine, la CEDEAO, participant aux discussions multilatérales.",
  },

  // Experts et Spécialistes
  {
    id: 9,
    label: "Expert thématique/Spécialiste",
    value: "expert_thematique_specialiste",
    category: "Experts et Spécialistes",
    description:
      "Personne possédant une connaissance approfondie dans un domaine spécifique, apportant son savoir technique et ses analyses.",
  },
  {
    id: 10,
    label: "Chercheur/Académicien",
    value: "chercheur_academicien",
    category: "Experts et Spécialistes",
    description:
      "Membre d'une institution de recherche ou d'une université, présentant des études, des données et des perspectives basées sur la recherche.",
  },
  {
    id: 11,
    label: "Consultant",
    value: "consultant",
    category: "Experts et Spécialistes",
    description:
      "Professionnel indépendant ou d'une firme de conseil, offrant des services d'expertise et des recommandations stratégiques.",
  },

  // Société Civile et Secteur Privé
  {
    id: 12,
    label: "Représentant d'ONG/OSC",
    value: "representant_ong_osc",
    category: "Société Civile et Secteur Privé",
    description:
      "Délégué d'une organisation non gouvernementale ou d'une organisation de la société civile, portant la voix des communautés ou de causes spécifiques.",
  },
  {
    id: 13,
    label: "Dirigeant d'entreprise/Entrepreneur",
    value: "dirigeant_entreprise_entrepreneur",
    category: "Société Civile et Secteur Privé",
    description:
      "Cadre supérieur d'une entreprise ou fondateur d'une startup, représentant les intérêts du secteur privé et explorant les opportunités de collaboration.",
  },
  {
    id: 14,
    label: "Représentant de syndicat",
    value: "representant_syndicat",
    category: "Société Civile et Secteur Privé",
    description:
      "Délégué d'une organisation syndicale, défendant les droits et les intérêts des travailleurs.",
  },
  {
    id: 15,
    label: "Représentant d'association professionnelle",
    value: "representant_association_professionnelle",
    category: "Société Civile et Secteur Privé",
    description:
      "Délégué d'une entité regroupant des professionnels d'un même secteur, partageant des perspectives spécifiques à leur domaine.",
  },
  {
    id: 16,
    label: "Activiste/Militant",
    value: "activiste_militant",
    category: "Société Civile et Secteur Privé",
    description:
      "Personne engagée dans la promotion ou la défense d'une cause sociale, environnementale ou politique.",
  },

  // Médias et Communication
  {
    id: 17,
    label: "Journaliste",
    value: "journaliste",
    category: "Médias et Communication",
    description:
      "Professionnel de l'information chargé de couvrir l'événement, de recueillir des informations et de les diffuser au public.",
  },
  {
    id: 18,
    label: "Photographe/Vidéaste",
    value: "photographe_videaste",
    category: "Médias et Communication",
    description:
      "Professionnel chargé de la capture visuelle (photos et vidéos) de la conférence pour documentation ou diffusion médiatique.",
  },
  {
    id: 19,
    label: "Professionnel de la communication/RP",
    value: "professionnel_communication_rp",
    category: "Médias et Communication",
    description:
      "Spécialiste de la communication et des relations publiques, gérant l'image et le message de son organisation.",
  },
  {
    id: 20,
    label: "Blogueur/Influenceur",
    value: "blogueur_influenceur",
    category: "Médias et Communication",
    description:
      "Créateur de contenu digital ayant une audience significative, partageant ses perspectives sur la conférence.",
  },

  // Personnel de Soutien et Organisation
  {
    id: 21,
    label: "Personnel d'organisation/Logistique",
    value: "personnel_organisation_logistique",
    category: "Personnel de Soutien et Organisation",
    description:
      "Membre de l'équipe organisatrice, responsable de la planification et de l'exécution des aspects logistiques de l'événement.",
  },
  {
    id: 22,
    label: "Traducteur/Interprète",
    value: "traducteur_interprete",
    category: "Personnel de Soutien et Organisation",
    description:
      "Professionnel assurant la communication multilingue en traduisant les discours ou documents en temps réel.",
  },
  {
    id: 23,
    label: "Agent de sécurité",
    value: "agent_securite",
    category: "Personnel de Soutien et Organisation",
    description:
      "Personnel chargé d'assurer la sûreté et la sécurité de tous les participants et des lieux de la conférence.",
  },
  {
    id: 24,
    label: "Hôte/Hôtesse",
    value: "hote_hotesse",
    category: "Personnel de Soutien et Organisation",
    description:
      "Personnel d'accueil et d'orientation, assistant les participants tout au long de l'événement.",
  },
  {
    id: 25,
    label: "Technicien audiovisuel/IT",
    value: "technicien_audiovisuel_it",
    category: "Personnel de Soutien et Organisation",
    description:
      "Spécialiste gérant les équipements audio, vidéo et informatiques nécessaires au bon déroulement de la conférence.",
  },

  // Autres et Public Général
  {
    id: 26,
    label: "Étudiant",
    value: "etudiant",
    category: "Autres et Public Général",
    description:
      "Personne inscrite dans un cursus d'enseignement supérieur, présente pour apprendre et s'informer.",
  },
  {
    id: 27,
    label: "Retraité",
    value: "retraite",
    category: "Autres et Public Général",
    description:
      "Ancien professionnel ou citoyen ayant pris sa retraite, intéressé par les thématiques de la conférence.",
  },
  {
    id: 28,
    label: "Citoyen intéressé/Public général",
    value: "citoyen_interesse_public_general",
    category: "Autres et Public Général",
    description:
      "Toute personne du public non affiliée à une organisation spécifique, mais ayant un intérêt pour les sujets abordés.",
  },
  {
    id: 29,
    label: "Bénévole",
    value: "benevole",
    category: "Autres et Public Général",
    description:
      "Personne offrant son temps et ses services volontairement pour aider à l'organisation et au bon déroulement de la conférence.",
  },
  {
    id: 30,
    label: "Autre",
    value: "autre",
    category: "Autres et Public Général",
    description: "Autre type de personne",
  },
];

export const participantCategories = [
  {
    id: 1,
    label: "Officiels et Politiques",
    value: "officiels_politiques",
    description:
      "Comprend les chefs d'État ou de gouvernement, ministres, secrétaires d'État, parlementaires (députés, sénateurs), ambassadeurs, hauts fonctionnaires et conseillers gouvernementaux.",
    requiresValidation: true,
  },
  {
    id: 2,
    label: "Experts et Spécialistes",
    value: "experts_specialistes",
    description:
      "Regroupe les chercheurs, universitaires, consultants indépendants, et tout spécialiste d'un domaine pertinent à la conférence, apportant une expertise technique ou scientifique.",
    requiresValidation: true,
  },
  {
    id: 3,
    label: "Société Civile et Secteur Privé",
    value: "societe_civile_secteur_prive",
    description:
      "Inclut les représentants d'organisations non gouvernementales (ONG), d'organisations de la société civile (OSC), de syndicats, d'associations professionnelles, ainsi que les dirigeants d'entreprises et entrepreneurs.",
    requiresValidation: true,
  },
  {
    id: 4,
    label: "Médias et Communication",
    value: "medias_communication",
    description:
      "Concerne les journalistes, reporters, photographes, vidéastes, professionnels des relations publiques et de la communication, ainsi que les blogueurs et influenceurs.",
    requiresValidation: false,
  },
  {
    id: 5,
    label: "Personnel de Soutien et Organisation",
    value: "personnel_soutien_organisation",
    description:
      "Désigne le personnel chargé de la logistique, de la sécurité, de l'accueil, de la traduction/interprétation, et du support technique ou audiovisuel de la conférence.",
    requiresValidation: false,
  },
  {
    id: 6,
    label: "Autres et Public Général",
    value: "autres_public_general",
    description:
      "Cette catégorie englobe les étudiants, retraités, bénévoles, et tout citoyen souhaitant assister à la conférence sans appartenir aux catégories précédentes.",
    requiresValidation: false,
  },
];

export const supportCategories = [
  { id: 1, label: "Hébergement", value: "hebergement" },
  { id: 2, label: "Transport international", value: "transport_international" },
  { id: 3, label: "Transport local (sur place)", value: "transport_local" },
  { id: 4, label: "Restauration", value: "restauration" },
  { id: 5, label: "Frais de visa", value: "frais_visa" },
  { id: 6, label: "Per diem / Indemnités journalières", value: "per_diem" },
  { id: 7, label: "Assurance voyage", value: "assurance_voyage" },
  {
    id: 8,
    label: "Frais d'inscription (si applicable)",
    value: "frais_inscription",
  },
  {
    id: 9,
    label: "Accès à des services spécifiques (ex: interprétation, accès PMR)",
    value: "services_specifiques",
  },
];
