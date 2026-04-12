"use client";

import {
	Document,
	Image,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import { convertDate } from "@/components/utils/utils";

// import type { Ichild } from "@/lib/types";

const styles = StyleSheet.create({
	page: {
		padding: 20,
	},
	signContainer: {
		border: "1px solid gray",
		height: "100px",
		width: "170px",
		marginTop: "5px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	signTitle: { fontWeight: "bold", fontSize: "14px" },
	title: { fontSize: 12, fontWeight: "bold" },
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		backgroundColor: "#ccc",
		fontSize: 14,
		fontWeight: "bold",
		padding: 8,
		marginBottom: 10,
	},
	textLine: {
		fontSize: 12,
		marginBottom: 5,
	},
	twoColumn: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	text: {
		fontSize: 12,
		marginTop: 5,
	},
	boldText: {
		fontWeight: "bold",
	},
	italicText: {
		fontStyle: "italic",
	},
	border: {
		border: 1,
		height: 24,
	},
	link: {
		textDecoration: "underline",
		color: "blue",
	},
	textCenter: {
		textAlign: "center",
		fontSize: 10,
	},
});

const PDFDocument = ({ child }: { child: any }) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.twoColumn}>
				<View>
					<Text style={styles.title} wrap>
						MINISTERE DES AFFAIRES ETRANGERES ET DES SENEGALAIS DE L'EXTERIEUR
					</Text>
					<Text style={{ fontSize: 10 }}>
						DIRECTION DU PROTOCOLE, DES CONFERENCES ET DE LA TRADUCTION
					</Text>
				</View>
				<Image
					src={"/images/flag-of-senegal.png"}
					style={{ width: 100, height: 66.7, marginRight: 5 }}
				/>
			</View>

			{/* Informations Personnelles */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>INFORMATIONS PERSONNELLES</Text>
				<View style={{ flexDirection: "column" }}>
					<Text style={styles.textLine}>Titre: {child?.title}</Text>
					<Text style={styles.textLine}>Nom: {child?.lastName}</Text>
					<Text style={styles.textLine}>Prénom(s): {child?.firstName}</Text>
					<Text style={styles.textLine}>
						Date de naissance: {convertDate(child?.dateOfBirth, "fr")}
					</Text>
					<Text style={styles.textLine}>
						Lieu de naissance: {child?.placeOfBirth}
					</Text>
					<Text style={styles.textLine}>
						Pays de naissance: {child?.countryOfBirth}
					</Text>
					<Text style={styles.textLine}>
						Nationalité: {child?.citizenship}
					</Text>
				</View>
			</View>

			{/* Informations Professionnelles */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>INFORMATIONS PROFESSIONNELLES</Text>
				<View style={{ flexDirection: "column" }}>
					<Text style={styles.textLine}>Rang/Grade: {child?.grade}</Text>
					<Text style={styles.textLine}>Fonction: {child?.jobFunction}</Text>
					<Text style={styles.textLine}>
						Personne remplacée: {child?.personReplaced}
					</Text>
					<Text style={styles.textLine}>
						Carte numéro: {child?.cardNumber}
					</Text>
					<Text style={{ fontSize: 10, fontStyle: "italic" }}>
						(Grade à préciser pour personnel des OI et personnel militaire)
					</Text>
				</View>
			</View>

			{/* Titre de Voyage */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>TITRE DE VOYAGE</Text>
				<View style={{ flexDirection: "column" }}>
					<Text style={styles.textLine}>
						Type: {child?.travellingTitleType}
					</Text>
					<Text style={styles.textLine}>
						Numéro: {child?.travellingNumber}
					</Text>
					<Text style={styles.textLine}>Délivré à: {child?.deliverAt}</Text>
					<Text style={styles.textLine}>Par: {child?.deliverBy}</Text>
					<Text style={styles.textLine}>
						Le: {convertDate(child?.deliverThe, "fr")}
					</Text>
					<Text style={styles.textLine}>
						Valable jusqu'au:{" "}
						{convertDate(child?.travellingTitleValidUntil, "fr")}
					</Text>
				</View>
			</View>
		</Page>
		<Page size="A4" style={styles.page}>
			<View>
				<View style={styles.section}>
					<View style={styles.twoColumn}>
						<View>
							<Text style={styles.boldText}>Date d'arrivée au Sénégal</Text>
							<Text style={styles.text}>
								{convertDate(child?.dateArrivalSenegal, "fr")}
							</Text>
						</View>
						<View>
							<Text style={styles.boldText}>Date de prise de fonction</Text>
							<Text style={styles.text}>
								{convertDate(child?.dateTakingOffice, "fr")}
							</Text>
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>DERNIÈRE ADRESSE À L'ÉTRANGER</Text>
					<View style={styles.twoColumn}>
						<View>
							<Text style={styles.boldText}>Ville</Text>
							<Text style={styles.text}>{child?.lastCityAbroad}</Text>
						</View>
						<View>
							<Text style={styles.boldText}>Pays</Text>
							<Text style={styles.text} wrap>
								{child?.lastCountryAbroad}
							</Text>
						</View>
					</View>
					<Text style={styles.boldText}>Rue</Text>
					<Text style={styles.text}>{child?.lastStreetAbroad}</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>PRÉCÉDENT EMPLOI</Text>
					<View style={styles.twoColumn}>
						<View>
							<Text style={styles.boldText}>Ville</Text>
							<Text style={[styles.text, { color: "gray" }]}>-</Text>
						</View>
						<View>
							<Text style={styles.boldText}>Pays</Text>
							<Text style={styles.text} wrap>
								{child?.latestOfWorkCountry}
							</Text>
						</View>
					</View>
					<View style={styles.twoColumn}>
						<View>
							<Text style={styles.boldText}>Structure</Text>
							<Text style={styles.text}>{child?.latestWorkStructure}</Text>
						</View>
						<View
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-end",
							}}
						>
							<Text style={{ ...styles.boldText, textAlign: "right" }}>
								Date
							</Text>
							<Text style={styles.text}>
								{convertDate(child?.lastestWorkDate, "fr")}
							</Text>
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "flex-end",
						}}
					>
						<View>
							<Text style={styles.signTitle}>Signature du titulaire</Text>
							<View style={styles.signContainer}></View>
						</View>
						<View>
							<Text style={styles.signTitle}>Signature du chef de mission</Text>
							<View style={styles.signContainer}></View>
						</View>
						<View>
							<Text style={styles.signTitle}>Photographie récente</Text>
							<Text style={{ fontSize: "10px", color: "gray" }}>
								Format 35x40 à COLLER
							</Text>
							<View style={styles.signContainer}>
								<Image
									src={child?.photoLink}
									style={{
										width: 80,
										height: 80,
									}}
								/>
							</View>
						</View>
					</View>
				</View>

				{/* ... (Other sections) ... */}

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Cadre réservé au Protocole</Text>
					<View style={styles.twoColumn}>
						<View>
							<Text style={styles.boldText}>Dossier N°</Text>
							<Text style={[styles.text, { color: "gray" }]}>-</Text>
						</View>
						<View>
							<Text style={styles.boldText}>Date de réception</Text>
							<Text style={[styles.text, { color: "gray" }]}>-</Text>
						</View>
					</View>
				</View>
			</View>

			<View style={styles.textCenter}>
				<Text>
					Formulaire à télécharger au <Text style={styles.link}>Consulat</Text>{" "}
					et à photographier/scanner et{" "}
					<Text style={styles.link}>télécharger</Text>.
				</Text>
				<Text>
					Direction des Protocoles des Conférences et de la Traduction - 2 Place
					de l'Indépendance BP 404 Dakar, Sénégal
				</Text>
			</View>
		</Page>
	</Document>
);

export default PDFDocument;
