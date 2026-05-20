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

// import type { IHolder } from "@/lib/types";

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

const PDFDocument = ({ otherDependant }: { otherDependant: any }) => (
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
					<Text style={styles.textLine}>Sexe: {otherDependant?.gender}</Text>
					<Text style={styles.textLine}>Nom: {otherDependant?.lastName}</Text>
					<Text style={styles.textLine}>Prénom(s): {otherDependant?.firstName}</Text>
					<Text style={styles.textLine}>
						Date de naissance: {convertDate(otherDependant?.dateOfBirth, "fr")}
					</Text>
					<Text style={styles.textLine}>
						Lieu de naissance: {otherDependant?.placeOfBirth}
					</Text>
					<Text style={styles.textLine}>
						Pays de naissance: {otherDependant?.countryOfBirth}
					</Text>
					<Text style={styles.textLine}>
						Nationalité: {otherDependant?.citizenship}
					</Text>
					<Text style={styles.textLine}>
						Téléphone: {otherDependant?.phone}
					</Text>
					<Text style={styles.textLine}>
						Email: {otherDependant?.email}
					</Text>
				</View>
			</View>

			{/* Titre de Voyage */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>TITRE DE VOYAGE</Text>
				<View style={{ flexDirection: "column" }}>
					<Text style={styles.textLine}>
						Type: {otherDependant?.travellingTitleType}
					</Text>
					<Text style={styles.textLine}>
						Numéro: {otherDependant?.travellingNumber}
					</Text>
					<Text style={styles.textLine}>Délivré à: {otherDependant?.deliverAt}</Text>
					<Text style={styles.textLine}>Par: {otherDependant?.deliverBy}</Text>
					<Text style={styles.textLine}>
						Le: {convertDate(otherDependant?.deliverThe, "fr")}
					</Text>
					<Text style={styles.textLine}>
						Valable jusqu'au:{" "}
						{convertDate(otherDependant?.travellingTitleValidUntil, "fr")}
					</Text>
				</View>
			</View>
		</Page>
		<Page size="A4" style={styles.page}>
			<View>
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
								{otherDependant?.photoLink && (
									<Image
										src={otherDependant?.photoLink}
										style={{
											width: 80,
											height: 80,
										}}
									/>
								)}
							</View>
						</View>
					</View>
				</View>

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

