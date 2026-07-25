import dynamic from "next/dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import {
	fetchDuplicateHolderCardById,
	fetchHolderCardById,
} from "@/lib/actions/diplomaticCards/holders";

const MyPDFPreview = dynamic(() => import("./myPDFPreview"), { ssr: false });

export default async function Page({
	params,
	searchParams,
}: {
	params: any;
	searchParams: { previousCard: string };
}) {
	const { id } = params;
	const previousCardId = searchParams.previousCard;
	const res = await Promise.all([
		fetchDuplicateHolderCardById(id),
		fetchHolderCardById(previousCardId),
	]);

	const holder = res[1].data;
	const duplicateData = res[0].data;
	// Check if the user can edit the form
	const canPrint =
		duplicateData?.documentStage &&
		(duplicateData?.documentStage === "confirmed" ||
			duplicateData?.documentStage === "printed");

	if (canPrint === false) {
		redirect("/panel/diplomatic/holders/duplicates");
	}

	return (
		<>
			<Link
				href={`/panel/diplomatic/holders/duplicates/${id}?previousCard=${previousCardId}`}
				className="btn mr-3 bg-indigo-500 hover:bg-indigo-600 text-white"
			>
				<BsChevronLeft />
				<span className="ml-2">Retour</span>
			</Link>
			<MyPDFPreview holder={holder} />
		</>
	);
}
