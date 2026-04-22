export interface InstitutionData {
	Code: string;
	Libelle: string;
	TypeOrganisme: string;
	Service?: string;
}

const embassies: InstitutionData[] = [
	{
		Code: '0',
		Libelle: 'PROTOSEN',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '1',
		Libelle: 'AMBASSADE FRANCE',
		TypeOrganisme: 'AMBASSADE',
		Service:
			'Chancellerie, Défense et Sécurité,Coopération et Action Culturelle,Commerce et Economie, Presse et Communication',
	},
	{
		Code: '2',
		Libelle: "AMBASSADE DE LA REPUBLIQUE ARABE D'EGYPTE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '3',
		Libelle: "AMBASSADE DE LA REPUBLIQUE FEDERALE D'ALLEMAGNE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '4',
		Libelle: "AMBASSADE DE L'ETAT D'ISRAEL",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '5',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE POPULAIRE DE CHINE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '5',
		Libelle: "AMBASSADE DU SULTANAT D'OMAN",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '6',
		Libelle: 'AMBASSADE DE GRANDE-BRETAGNE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '7',
		Libelle: 'AMBASSADE DU ROYAUME DE BELGIQUE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '8',
		Libelle: "AMBASSADE DES ETATS UNIS D'AMERIQUE",
		TypeOrganisme: 'AMBASSADE',
		Service:
			'Chancellerie, Défense et Sécurité,Coopération et Action Culturelle,Commerce et Economie, Presse et Communication',
	},
	{
		Code: '9',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DE KOSOVO',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '10',
		Libelle: 'AMBASSADE DU ROYAUME DES PAYS BAS',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '11',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE BOLIVARIENNE DU VENEZUELA',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '12',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE CENTRAFRICAINE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '12',
		Libelle: 'AMBASSADE DU ROYAUME DU MAROC',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '14',
		Libelle: "AMBASSADE D'ITALIE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '15',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE LIBANAISE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '16',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE FEDERATIVE DUBRESIL',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '17',
		Libelle: "AMBASSADE DU ROYAUME D'ARABIE SAOUDITE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '19',
		Libelle: "AMBASSADE DE LA REPUBLIQUE DE L'INDE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '20',
		Libelle: 'AMBASSADE DE LA CONFEDERATION SUISSE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '21',
		Libelle: 'AMBASSADE DU VATICAN',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '22',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE FEDERALE DUNIGERIA',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '23',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE TUNISIENNE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '24',
		Libelle: 'AMBASSADE DU JAPON',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '25',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE ISLAMIQUE DEMAURITANIE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '26',
		Libelle: 'AMBASSADE DE LA FEDERATION DE RUSSIE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '27',
		Libelle: "AMBASSADE DU ROYAUME D'ESPAGNE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '28',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DE POLOGNE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '29',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DE TURQUIE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '30',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DU MALI',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '31',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE',
		TypeOrganisme: 'AMBASSADE',
		Service:
			'Chancellerie, Défense et Sécurité, Coopération et Action Culturelle, Commerce et Economie, Presse et Communication',
	},
	{
		Code: '32',
		Libelle: "AMBASSADE DE LA REPUBLIQUE D'AUTRICHE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '33',
		Libelle: 'HAUT COMISSARIAT DE LA REPUBLIQUE DE GAMBIE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '34',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DEMOCRATIQUE DU CONGO',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '36',
		Libelle: "AMBASSADE DE REPUBLIQUE FEDERALE ET DEMOCRATIQUE D'ETHIOPIE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '37',
		Libelle: 'AMBASSADE DU CANADA',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '38',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE ISLAMIQUE DEPAKISTAN',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '40',
		Libelle: "AMBASSADE DE L'ORDRE SOUVERAIN DE MALTE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '42',
		Libelle: "AMBASSADE DE LA REPUBLIQUE ISLAMIQUE D'IRAN",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '43',
		Libelle: 'AMBASSADE DE ROUMANIE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '45',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE POPULAIRE DEMOCRATIQUE DE COREE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '46',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DU GABON',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '47',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DE COREE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '49',
		Libelle: "AMBASSADE D'UKRAINE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '52',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DE GUINEE BISSAU',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '54',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE PORTUGAISE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '55',
		Libelle: "AMBASSADE DE LA REPUBLIQUE D'IRAK",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '56',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DE CABO VERDE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '58',
		Libelle: "AMBASSADE DE L'ETAT DELIBYE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '59',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE ARABE SYRIENNE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '60',
		Libelle: "AMBASSADE DE LA REPUBLIQUE DE COTE D'IVOIRE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '63',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DE GUINEE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '64',
		Libelle: "AMBASSADE DE L'ETAT DU KOWEIT",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '67',
		Libelle: "AMBASSADE DE L'ETAT DEPALESTINE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '68',
		Libelle: 'AMBASSADE DU ROYAUME DE THAILANDE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '70',
		Libelle: "AMBASSADE DE LA REPUBLIQUE D'INDONESIE",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '72',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DU CAMEROUN',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '73',
		Libelle: 'AMBASSADE DE REPUBLIQUE DU CONGO',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '77',
		Libelle: 'AMBASSADE DE MALAISIE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '78',
		Libelle: "AMBASSADE REPUBLIQUE D'AFRIQUE DU SUD",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '80',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DU SOUDAN',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '81',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DU BURKINA FASO',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '84',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DE SIERRALEONE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '90',
		Libelle: 'AMBASSADE DES EMIRATS ARABES UNIS',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '93',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DU RWANDA',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '96',
		Libelle: 'AMBASSADE DU GRANDDUCHE DE LUXEMBOURG',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '97',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DE CUBA',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '98',
		Libelle: "AMBASSADE DE L'ETAT DUQATAR",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '99',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DE MADAGASCAR',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '100',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DU GHANA',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '102',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DU LIBERIA',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '103',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DU ZIMBABWE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '107',
		Libelle: 'DÉLÉGATION UNION EUROPÉENNE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '110',
		Libelle: 'DÉLÉGATION GÉNÉRALE DU QUÉBEC',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '112',
		Libelle: 'AMBASSADE DE LA RÉPUBLIQUE DU KENYA',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '113',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE FEDERALE DE SOMALIE',
		TypeOrganisme: 'AMBASSADE',
		Service: 'Chancellerie',
	},
	{
		Code: '115',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE HELLENIQUE',
		TypeOrganisme: 'AMBASSADE',
		Service: 'Chancellerie',
	},
	{
		Code: '118',
		Libelle: 'AMBASSDE DE LA REPUBLIQUE ARGENTINE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '121',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE TCHEQUE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '146',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DU NIGER',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '177',
		Libelle: "AMBASSADE DE L'UNION DES COMORES",
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '205',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DE NAMIBIE',
		TypeOrganisme: 'AMBASSADE',
		Service: '',
	},
	{
		Code: '206',
		Libelle: "AMBASSADE DE LA REPUBLIQUE D'ANGOLA",
		TypeOrganisme: 'AMBASSADE',
		Service: 'Chancellerie',
	},
	{
		Code: '207',
		Libelle: 'AMBASSADE DE LA REPUBLIQUE DE FINLANDE',
		TypeOrganisme: 'AMBASSADE',
		Service: 'Chancellerie',
	},
	{
		Code: 'HU',
		Libelle: 'HONGRIE',
		TypeOrganisme: 'AMBASSADE',
		Service: 'Chancellerie',
	},
];

const consultat: InstitutionData[] = [
	{
		Code: '001 (2)',
		Libelle: 'CONSULAT DE FRANCE A SAINT LOUIS',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '025 (1)',
		Libelle: 'CONSULAT GENERAL DE LA REPUBLIQUE ISLAMIQUE DE MAURITANIE',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '001C',
		Libelle: 'CONSULAT GENERAL DE FRANCE A DAKAR',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '114',
		Libelle: 'CONSULAT GENERAL DE GUINEE EQUATORIALE',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '027C',
		Libelle: "CONSULAT GENERAL D'ESPAGNE A DAKAR",
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: 'CH103',
		Libelle: 'CONSULAT GENERAL HONORAIRE DU ROYAUME DENORVEGE',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '117',
		Libelle: 'CONSULAT HONORAIRE DE LA REPUBLIQUE DU NIGER',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '94',
		Libelle: 'CONSULAT HONORAIRE DEDJIBOUTI',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '104',
		Libelle: "CONSULAT HONORAIRE DE L'ANGOLA",
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '181',
		Libelle: 'CONSULAT HONORAIRE DE MAURITANIE A ST LOUIS',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: 'CH109',
		Libelle: 'CONSULAT HONORAIRE DEMEXIQUE',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: 'CHMZ',
		Libelle: 'CONSULAT HONORAIRE DEMOZAMBIQUE',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '120',
		Libelle: 'CONSULAT HONORAIRE DE ROUMANIE A KAOLACK',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '180',
		Libelle: 'CONSULAT HONORAIRE DES COMORES',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '79',
		Libelle: 'CONSULAT HONORAIRE DE SUEDE',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '211',
		Libelle: 'CONSULAT HONORAIRE DU BENIN',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: 'CH119',
		Libelle: 'CONSULAT HONORAIRE DU KAZAKHSTAN',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '116',
		Libelle: 'CONSULAT HONORAIRE DU LIBERIA',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: '182',
		Libelle: 'CONSULAT HONORAIRE DU TCHAD',
		TypeOrganisme: 'CONSULAT',
	},
	{
		Code: 'CH101',
		Libelle: 'CONSULAT HONORAIRE DU TOGO',
		TypeOrganisme: 'CONSULAT',
	},
];

const un: InstitutionData[] = [
	{
		Code: 'UNOWAS',
		Libelle: 'Bureau des Nations Unies pour l’Afrique de l’Ouest et du Sahel',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'UNOPS',
		Libelle: 'Bureau des Services d’Appui aux Projets des Nations Unies',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'BIT',
		Libelle: 'Bureau International du Travail',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES(SNU)',
	},
	{
		Code: 'OCHA',
		Libelle: 'Bureau Rég. Nations Unies de Coordinationdes Aff. Hum.',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'CINU',
		Libelle: 'Centre d’Information des Nations Unies',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES(SNU)',
	},
	{
		Code: 'COORD',
		Libelle: 'Coord. Résidente Activités OpsSNU',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES(SNU)',
	},
	{
		Code: 'UNDSS',
		Libelle: 'Département de la Sûreté et de la Sécurité des Nations Unies',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'NUFEM',
		Libelle: 'Entité Nations Unies Egalité sexes et Autonomisation femmes',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'UNICEF',
		Libelle: 'Fonds des Nations Unies pour l’Enfance',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'UNFPA',
		Libelle: 'Fonds des Nations Unies pour la Population',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'UNCDF',
		Libelle: 'Fonds des Nations Unies pour le Développement des Capitaux',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'FIDA',
		Libelle: 'Fonds International de Développement Agricole',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES(SNU)',
	},
	{
		Code: 'HCR',
		Libelle: 'Haut-Commissariat des Nations Unies pour les réfugiés',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'HCDH',
		Libelle: 'Haut-Commissariat ONU aux Droits de l’homme',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'IDEP',
		Libelle: 'Institut de Développement Économique de la Planification',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'ONUDC',
		Libelle: 'Office des Nations Unies contre la Drogue et le Crime',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'FAO',
		Libelle: 'ONU pour l’Alimentation et l’Agriculture',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES(SNU)',
	},
	{
		Code: 'OACI',
		Libelle: 'Organisation de l’Aviation Civile Internationale',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'ONUDI',
		Libelle: 'Organisation des Nations Unies pour le Développement Industriel',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'UNESCO',
		Libelle: 'Organisation des Nations Unies pour Education, Science et Culture',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'OIM',
		Libelle: 'Organisation Internationale de la Migration',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'OMS',
		Libelle: 'Organisation Mondiale de la Santé',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'PAM',
		Libelle: 'Programme Alimentaire Mondial',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'NUSIDA',
		Libelle: 'Programme commun des Nations Unies surle VIH-SIDA',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'PNUD',
		Libelle: 'Programme des Nations Unies pour le Développement',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
	{
		Code: 'VNU',
		Libelle: 'VNU - Programme des Volontaires des Nations Unies',
		TypeOrganisme: 'SYSTEME DES NATIONS UNIES (SNU)',
	},
];

const au: InstitutionData[] = [
	{
		Code: 'AR',
		Libelle: 'AFRICARICE',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'AGC',
		Libelle: 'Agence Gestion et Coopération Sénégal Guinée Bissau',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'PANAPRESS',
		Libelle: "Agence Panafricaine d'Information",
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'EAA',
		Libelle: 'Agence Panafricaine Intergouv. Eau et Assainissement',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'ASECNA',
		Libelle: 'Agence Sécurité Navigation Aérienne Afrique et Madagascar',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'AFAO',
		Libelle: "Association des femmes de l'Afrique de l'Ouest",
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'AFRICARICE',
		Libelle: 'Association pour Développement Riziculture Afrique Ouest',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'UEMOA',
		Libelle: "Bureau de la Commission de l'UEMOA",
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'CDE',
		Libelle: 'Bureau Rég. Centre Développement des Entreprises',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'CCDG',
		Libelle: 'Centre de la CEDEAO pour le Développement du Genre',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'CAE',
		Libelle: 'Chambres Africaines Extraordinaires',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'CAFAC',
		Libelle: "Commission Africaine de l'Aviation Civile",
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'CACMP',
		Libelle: 'Commission Africaine du Conseil Mondial de la Paix',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'CRS',
		Libelle: 'Commission Sous Régionale des Pêches',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'CAA',
		Libelle: "Confédération Africaine d'Athlétisme",
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'CORAF',
		Libelle: 'Conseil Ouest Africain Recherche et Développement Agricoles',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'CDA',
		Libelle: 'CONSEIL POUR LE DÉVELOPPEMENT DE LA RECHERCHE EN SCIENCES SOCIALESEN AFRIQUE',
		TypeOrganisme: 'ORGANISATIONAFRICAINE',
	},
	{
		Code: 'CRAT',
		Libelle: 'Direction Exécutive du Centre Régional Africain de Technologie',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'EISMV',
		Libelle: 'Ecole Inter-Etats des Sciences et Médecine Vétérinaires',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'ESMT',
		Libelle: 'Ecole Supérieure Multinationale des Télécommunications',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'GIABA',
		Libelle: "Groupe Intergouv. d'Action contre le Blanchissement d'Argent",
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'GIMUM',
		Libelle: "Groupement Interbancaire Monétique del'UEMOA",
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'IAG',
		Libelle: 'Institut Africain de la Gouvernance',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'IAR',
		Libelle: 'Institut Africain de Réadaptation',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'IPAO',
		Libelle: "Institut Panos de Afrique de l'Ouest",
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'NEPAD',
		Libelle: "Nouveau partenariat pour le Développement de l'Afrique",
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'OMVG',
		Libelle: 'Organisation pour la Mise en Valeur du Fleuve Gambie',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'OMVS',
		Libelle: 'Organisation pour la Mise en Valeur du Fleuve Sénégal',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'UAR',
		Libelle: 'Union Africaine de la Radiodiffusion',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'UGAACO',
		Libelle: "Union des Gestionnaires Aéroports Afriquede l'Ouest",
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'UCAO',
		Libelle: "Université Catholique de l'Afrique de l'Ouest",
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
	{
		Code: 'UVA',
		Libelle: 'Université Virtuelle Africaine',
		TypeOrganisme: 'ORGANISATION AFRICAINE',
	},
];

const orgInternationale: InstitutionData[] = [
	{
		Code: 'AUF',
		Libelle: 'Agence Universitaire de la Francophonie',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'AISEFR',
		Libelle: 'Assoc. Internationale Secours Enfance et Femme rurale',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'IATA',
		Libelle: 'Association du Transport Aérien International',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'AMAI',
		Libelle: "Association Mondiale de l'Appui Islamique",
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'AUPELF',
		Libelle: 'Association Universités en langue française',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'CRDI',
		Libelle: 'Centre Recherches Développement International',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'CICR',
		Libelle: 'Comité International de la Croix Rouge',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'CFMN',
		Libelle: 'Conf. Ministres Education Ayant le Françaisen Partage',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'CFJ',
		Libelle: 'CONFÉRENCE DES MINISTRES DE LA JEUNESSE ET DES SPORTS DE LA FRANCOPHONIE',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'FIFA',
		Libelle: 'Fédération internationale de Football',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'FISCR',
		Libelle: 'Fédération Internationale des Sociétés de la Croix Rouge',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'IFEF',
		Libelle: 'Institut de Francophonie pour Education et Formation',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'IRD',
		Libelle: 'Institut de Recherche pour le Développement',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'IFPRI',
		Libelle: 'Institut International Recherche Politiques Alimentaires',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'GGGI',
		Libelle: 'INSTITUT MONDIAL POUR LA CROISSANCE VERTE',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'LIM',
		Libelle: 'Organisation de la Ligue Islamique Mondiale',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'OIF',
		Libelle: 'Organisation Internationale de la Francophonie',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'SITA',
		Libelle: 'Sté Internationale Télécommunications Aéronautiques',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'UIT',
		Libelle: 'Union Internationale des Télécommunications',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
	{
		Code: 'UICN',
		Libelle: 'Union Internationale pour la Conservation de la Nature',
		TypeOrganisme: 'ORGANISATION INTERNATIONALE',
	},
];

const bankAndFI: InstitutionData[] = [
	{
		Code: 'BAD',
		Libelle: 'Banque Africaine de Développement',
		TypeOrganisme: 'BANQUE OU INSTITUTION FINANCIÈRE',
	},
	{
		Code: 'BCEAO',
		Libelle: "Banque Centrale des Etats de l'Afrique de l'Ouest",
		TypeOrganisme: 'BANQUE OU INSTITUTION FINANCIÈRE',
	},
	{
		Code: 'BEI',
		Libelle: "Banque Européenne d'Investissement",
		TypeOrganisme: 'BANQUE OU INSTITUTION FINANCIÈRE',
	},
	{
		Code: 'BID',
		Libelle: 'Banque Islamique pour le Développement',
		TypeOrganisme: 'BANQUE OU INSTITUTION FINANCIÈRE',
	},
	{
		Code: 'BM',
		Libelle: 'Banque Mondiale',
		TypeOrganisme: 'BANQUE OU INSTITUTION FINANCIÈRE',
	},
	{
		Code: 'BOAD',
		Libelle: 'Banque Ouest Africaine de Développement',
		TypeOrganisme: 'BANQUE OU INSTITUTION FINANCIÈRE',
	},
	{
		Code: 'BSIC',
		Libelle: 'BSIC HOLDING UEMOA',
		TypeOrganisme: 'BANQUE OU INSTITUTION FINANCIÈRE',
	},
	{
		Code: 'FMI',
		Libelle: 'Fonds Monétaire International',
		TypeOrganisme: 'BANQUE OU INSTITUTION FINANCIÈRE',
	},
	{
		Code: 'SFI',
		Libelle: 'Société Financière Internationale',
		TypeOrganisme: 'BANQUE OU INSTITUTION FINANCIÈRE',
	},
];

const foundationsAndOng: InstitutionData[] = [
	{
		Code: 'TAFR',
		Libelle: 'TRUSTAFRICA',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: 'Coopération etAction Culturelle',
	},
	{
		Code: 'ACF',
		Libelle: 'Action conte la Faim',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'AAI',
		Libelle: 'Aide et Action internationale',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'WAMY',
		Libelle: 'Assemblée mondiale de la Jeunesse Musulmane',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'AMAI',
		Libelle: "Association Mondiale de l'Appel Islamique",
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'FTM',
		Libelle: 'Bureau africain du Forum du Tiers Monde',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'CRS',
		Libelle: 'Catholic Relief Services',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'CFI',
		Libelle: 'ChildFund international',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: '208',
		Libelle: 'CHRISTIAN BROADCASTING NETWORK AFRIQUE',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'CPI',
		Libelle: 'COUNTERPART INTERNATIONAL',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'DAS',
		Libelle: 'Direct Aid Society',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'ENDA',
		Libelle: 'Enda Tiers Monde',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'FFES',
		Libelle: 'FONDATION FRIEDRICH EBERTSTIFTUNG',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'FFN',
		Libelle: 'Fondation Friedrich Nauman',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'FHB',
		Libelle: 'Fondation Heinrich Bôll',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'FKA',
		Libelle: 'FONDATION KONRAD ADENAUER',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'FM',
		Libelle: 'Fondation Maarif de Turquie',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'FM',
		Libelle: 'Fondation Mastercard',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'FRL',
		Libelle: 'Fondation Rosa Luxembourg',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'FS',
		Libelle: 'Fondation Saemaul',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'HI',
		Libelle: 'Handicap international',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'HKI',
		Libelle: 'HELEN KELLER INTERNATIONAL',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'LIM',
		Libelle: 'LIGUE ISLAMIQUE MONDIALE',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'MS',
		Libelle: 'Mercy Ship',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'MP',
		Libelle: 'Millénium Promise',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'SCH',
		Libelle: 'ONG SAVE THE CHILDREN',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'OSIWA',
		Libelle: 'Open Society Initiative for West Africa',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'MAWA',
		Libelle: "Organisation de l'Appel islamique",
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'OXFAM',
		Libelle: 'OXFAM AMERICA',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'PI',
		Libelle: 'Plan International',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'PATH',
		Libelle: 'Programme de Technologie appropriée en Santé',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'RARS',
		Libelle: 'Réseau Africain de Recherche sur le Sida',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'SOSKDI',
		Libelle: 'SOS KINDERDORF INTERNATIONAL',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'TA',
		Libelle: 'Trust Africa',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'VECO',
		Libelle: 'Vredeseilanden',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'WIA',
		Libelle: 'Wetlands International Afrique',
		TypeOrganisme: 'FONDATIONS ET ONG',
		Service: '',
	},
	{
		Code: 'WVI',
		Libelle: 'World Vision international',
		TypeOrganisme: 'FONDATIONS ET ONG',
	},
];


export {
  embassies,
  consultat,
  un,
  au,
  orgInternationale,
  bankAndFI,
  foundationsAndOng,
};
