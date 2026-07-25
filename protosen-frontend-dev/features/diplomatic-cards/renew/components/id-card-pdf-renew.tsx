"use client";
import {
	Document,
	Font,
	Image,
	Page,
	StyleSheet,
	Svg,
	Text,
	View,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { convertDate } from "@/components/utils/utils";
import type { CardType } from "@/features/others/type-of-cards/types";
import { fetchHolderCardById } from "@/lib/actions/diplomaticCards/holders";
import type { IPersonCardInfos, IPersonCardInfosRenew } from "@/lib/types";
import { formatName } from "@/lib/utils";
import { SystemSettings } from "@/features/settings/system-settings/types";

Font.register({
	family: "Open Sans",
	fonts: [
		{
			src: "/fonts/open-sans-regular.ttf",
			fontWeight: 400,
		},
		{
			src: "/fonts/open-sans-700.ttf",
			fontWeight: 700,
		},
	],
});

// Define styles using StyleSheet
const styles = StyleSheet.create({
	container: {
		fontFamily: "Open Sans",
		padding: 10,
		color: "black",
		margin: "auto",
		height: "100%",
		width: "100%",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 6,
	},
	idCardTitle: {
		fontSize: 6,
	},
	ministryTitle: {
		fontSize: 6,
		textAlign: "right",
	},
	infoSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 6,
	},
	avatarContainer: {
		flexDirection: "column",
		alignItems: "flex-end",
	},
	avatar: {
		width: 64,
		height: 74,
		backgroundColor: "#ccc",
		justifyContent: "center",
		alignItems: "center",
	},
	cardNumber: {
		fontSize: 6,
		marginTop: 2,
	},
	textRight: {
		textAlign: "right",
	},
	section: {
		// marginTop: 8,
	},
	twoColumn: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 2,
	},
	labelText: {
		fontSize: 6,
		marginTop: 4,
	},
	shuffleIcon: {
		width: 70,
		height: 10,
		backgroundColor: "#ccc",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 2,
	},
	note: {
		fontSize: 6,
		textAlign: "center",
	},
	assim: {
		textTransform: "uppercase",
		color: "black",
		fontWeight: 700,
		marginTop: 4,
		textAlign: "center",
		fontSize: 6,
	},
	text: {
		fontWeight: "bold",
		fontSize: 6,
		marginTop: 2,
	},
	watermark: {
		position: "absolute",
		top: "55%",
		right: -12,
		justifyContent: "center",
		alignItems: "center",
		transform: "rotate(90deg) ",
		pointerEvents: "none",
	},
	watermarkText: {
		fontSize: 6,
		fontWeight: "bold",
		textAlign: "center",
		color: "#000000",
	},
});

// const getContrastColor = (bgColor: string) => {
//   // Convert hex to RGB
//   const hexToRgb = (hex: string) => {
//     const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
//     const hex2 = hex.replace(
//       shorthandRegex,
//       (m, r, g, b) => r + r + g + g + b + b
//     );
//     const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex2);
//     return result
//       ? {
//           r: parseInt(result[1], 16),
//           g: parseInt(result[2], 16),
//           b: parseInt(result[3], 16),
//         }
//       : null;
//   };

//   // Calculate luminance to determine if background is light or dark
//   const rgb = hexToRgb(bgColor);
//   if (!rgb) return "#000000";

//   // For dark backgrounds, use a lighter watermark
//   const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
//   return luminance > 0.5 ? "#000000" : "#ffffff";
// };

const IdCardPDFRenew = ({
	person,
	personRenew,
	settings,
	bgColor = "#aefcac",
	diplomaticEntity,
	OIText,
	qrCode,
	photo,
	plaque,
	deliverDate,
	expirationDate,
	cardTitle,
	showWatermark = false,
	watermarkText = "DUPLICATA",
}: {
	person: IPersonCardInfos;
	personRenew: IPersonCardInfosRenew;
	settings: SystemSettings;
	bgColor?: string;
	diplomaticEntity: CardType | undefined;
	OIText?: { label: string; value: string };
	qrCode: string;
	photo?: string;
	plaque?: { label: string; value: string };
	deliverDate: string;
	expirationDate: string;
	cardTitle: string;
	showWatermark?: boolean;
	watermarkText?: string;
}) => {
	const [newPerson, setNewPerson] = useState<any>();

	// const watermarkColor = getContrastColor(bgColor);

	useEffect(() => {
		if (person.ownerDiplomaticCardId) {
			const fetchHolderCard = async () => {
				try {
					const response = await fetchHolderCardById(
						person.ownerDiplomaticCardId,
					);
					const holder = response.data;
					setNewPerson({
						...person,
						holderTitle: holder?.title,
						holderFileNumber: holder?.id,
						holderFirstName: holder?.firstName,
						holderLastName: holder?.lastName,
						holderCitizenship: holder?.citizenship,
						holderJobFunction: holder?.jobFunction,
					});
					// console.log(holder);
				} catch (error) {
					// console.log(error);
				}
			};
			fetchHolderCard();
		}
	}, [person]);

	const Watermark = () =>
		showWatermark ? (
			<View style={styles.watermark}>
				<Text style={{ ...styles.watermarkText }}>{watermarkText}</Text>
			</View>
		) : null;

	return (
		<Document>
			<Page size={[243.7813, 153.072]}>
				<View
					style={{
						...styles.container,
						backgroundColor: bgColor,
					}}
				>
					<Watermark />
					<View style={styles.header}>
						<View
							style={{
								flexDirection: "row",
								alignItems: "flex-start",
								width: "50%",
							}}
						>
							<Image
								src={"/images/flag-of-senegal.png"}
								style={{ width: 30, height: "auto", marginRight: 5 }}
							/>
							<Text
								style={{
									...styles.idCardTitle,
									width: "100px",
									textTransform: "uppercase",
								}}
							>
								{cardTitle || personRenew?.type_card}
							</Text>
						</View>
						<View style={{ width: "42%" }}>
							<Text style={styles.ministryTitle}>
								{settings?.ministryName || "Ministère de l’Intégration africaine et des Affaires étrangères"}
							</Text>
						</View>
					</View>

					<View style={styles.infoSection}>
						<View style={{ flexDirection: "column" }}>
							<Text style={styles.labelText}>Nom</Text>
							<Text style={{ ...styles.text, fontWeight: "bold" }}>
								{person?.lastName}
							</Text>
							<Text style={styles.labelText}>Prénom(s)</Text>
							<Text style={styles.text}>{person?.firstName}</Text>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "flex-start",
								}}
							>
								<View>
									<Text style={styles.labelText}>Date de naissance</Text>
									<Text style={styles.text}>
										{convertDate(person?.dateOfBirth, "fr")}
									</Text>
								</View>
								<View style={{ marginHorizontal: 5 }}>
									<Text style={styles.labelText}>/</Text>
								</View>
								<View>
									<Text style={styles.labelText}>Sexe</Text>
									<Text style={styles.text}>{person?.gender}</Text>
								</View>
							</View>
							<Text style={styles.labelText}>Mission</Text>
							<Text style={{ ...styles.text, width: "70%" }}>
								{person?.organism?.libelle || ""}
							</Text>
							<Text style={styles.labelText}>Qualité/Fonction</Text>
							<Text style={{ ...styles.text, width: "70%" }}>
								{person?.jobFunction
									? person?.jobFunction
									: newPerson?.childDCFiles
										? `Enfant de ${newPerson?.holderLastName ?? ""} ${
												formatName(newPerson?.holderFirstName) ?? ""
											}, ${newPerson?.holderJobFunction ?? ""}`
										: newPerson?.spouseDCFiles
											? `Époux(se) de ${newPerson?.holderLastName ?? ""} ${
													formatName(newPerson?.holderFirstName) ?? ""
												}, ${newPerson?.holderJobFunction ?? ""}`
											: ""}
							</Text>
						</View>
						<View style={styles.avatarContainer}>
							{/* <View style={styles.avatar}></View> */}
							{/* <Image
              src={{
                uri: person.photoLink,
                method: "GET",
                headers: { "Cache-Control": "no-cache" },
                body: "",
              }}
            /> */}
							{photo ? (
								<Image
									src={photo}
									style={{
										width: 64,
										height: 74,
									}}
								/>
							) : (
								<View style={styles.avatar}></View>
							)}
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									gap: "4px",
									marginTop: "8px",
								}}
							>
								<Text style={{ ...styles.cardNumber, fontSize: 5 }}>N°</Text>
								<Text style={{ ...styles.text, fontSize: 5 }}>
									{plaque ? `${plaque?.value}-` : ""}
									{personRenew?.cardNumber}
								</Text>
								{/* <Text style={styles.text}></Text> */}
							</View>
						</View>
					</View>
					{(personRenew?.type_card || (diplomaticEntity && OIText)) && (
						<Text style={styles.assim}>{OIText?.value}</Text>
					)}
				</View>
			</Page>
			<Page size={[243.7813, 153.072]}>
				<View style={{ ...styles.container, backgroundColor: bgColor }}>
					<Watermark />
					<View style={styles.header}>
						<Image
							src={qrCode}
							style={{
								width: 30,
								height: 30,
								marginRight: 5,
								backgroundColor: "#00000000",
							}}
						/>
						<View style={{ ...styles.textRight, width: "40%" }}>
							<Text style={{ fontSize: 6 }}>
								{settings?.protocolDirectionName || "Direction du Protocole, des Conférences et de la Traduction"}
							</Text>
						</View>
					</View>

					<View style={styles.section}>
						<View style={styles.twoColumn}>
							<View style={{ flexDirection: "column" }}>
								<View>
									<Text style={styles.labelText}>Date de délivrance</Text>
									<Text style={styles.text}>
										{convertDate(deliverDate || personRenew?.issueDate, "fr")}
									</Text>
								</View>
								<View>
									<Text style={styles.labelText}>Date d'expiration</Text>
									<Text style={styles.text}>
										{convertDate(
											expirationDate || personRenew?.validUntil,
											"fr",
										)}
									</Text>
								</View>
								<View>
									<Text style={styles.labelText}>Nationalité</Text>
									<Text style={styles.text}>{person?.citizenship}</Text>
								</View>
							</View>
							<View style={styles.textRight}>
								<Image
									src={settings?.directorSignature || "/images/sign_prot2.png"}
									style={{ width: 150, height: 76, marginRight: 5 }}
								/>
							</View>
						</View>

						<View>
							<Text style={styles.note}>{diplomaticEntity?.description}</Text>
						</View>
						{/* <View style={{ marginTop: 2 }}>
          </View> */}
					</View>
				</View>
			</Page>
		</Document>
	);
};

export default IdCardPDFRenew;
