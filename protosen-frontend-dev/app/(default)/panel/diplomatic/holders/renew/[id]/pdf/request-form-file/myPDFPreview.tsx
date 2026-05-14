"use client";

import { PDFViewer } from "@react-pdf/renderer";
import type { IHolder } from "@/lib/types";
import PDFDocument from "./PDFDocument";

export default function MyPDFPreview({ holder }: { holder: IHolder }) {
	return (
		<div className="flex justify-center">
			<PDFViewer width={1000} height={1000}>
				<PDFDocument holder={holder} />
			</PDFViewer>
		</div>
	);
}
