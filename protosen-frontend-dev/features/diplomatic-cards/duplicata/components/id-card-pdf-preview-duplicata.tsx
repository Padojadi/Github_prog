"use client";

import { PDFViewer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import React, { useEffect } from "react";
import { usePrintContext } from "@/app/print-context";
import type { IPersonCardInfos, IPersonCardInfosRenew } from "@/lib/types";
import IdCardPDFDuplicata from "./id-card-pdf-duplicata";
import { SystemSettings } from "@/features/settings/system-settings/types";

export default function MyPDFPreviewDuplicata({
	holder,
	holderDuplicata,
	settings,
}: {
	holder: IPersonCardInfos;
	holderDuplicata: IPersonCardInfosRenew;
	settings: SystemSettings;
}) {
	const {
		diplomaticEntity,
		printColor,
		OIText,
		photo,
		plaque,
		deliverDate,
		expirationDate,
		cardTitle,
	} = usePrintContext();
	const qrCodeData = `${holder.firstName} ${holder.lastName}`;
	const [QRCodeString, setQRCodeString] = React.useState<string>("");

	useEffect(() => {
		QRCode.toDataURL(qrCodeData, { margin: 0, color: { light: "#0000" } }).then(
			(data: any) => {
				setQRCodeString(data);
			},
		);
	}, [qrCodeData]);

	return (
		<div className="flex justify-center">
			<PDFViewer width={1000} height={1000}>
				<IdCardPDFDuplicata
					person={holder}
					personDuplicata={holderDuplicata}
					bgColor={printColor}
					diplomaticEntity={diplomaticEntity}
					OIText={OIText}
					photo={photo}
					plaque={plaque}
					qrCode={QRCodeString}
					deliverDate={deliverDate}
					expirationDate={expirationDate}
					cardTitle={cardTitle}
					settings={settings}
				/>
			</PDFViewer>
		</div>
	);
}
