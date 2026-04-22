import dynamic from "next/dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import {
	fetchDuplicateDomesticAndRelativeCardById,
	fetchDomesticAndRelativeCardById,
} from "@/lib/actions/diplomaticCards/domesticAndRelatives";

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
		fetchDuplicateDomesticAndRelativeCardById(id),
		fetchDomesticAndRelativeCardById(previousCardId),
	]);

	const domesticAndRelative = res[1].data;
	const duplicateData = res[0].data;
	// Check if the user can edit the form
	const canPrint =
		duplicateData?.documentStage &&
		(duplicateData?.documentStage === "confirmed" ||
			duplicateData?.documentStage === "printed");

	if (canPrint === false) {
		redirect("/panel/diplomatic/domestics-and-relatives/duplicates");
	}

	return (
		<>
			<Link
				href={`/panel/diplomatic/domestics-and-relatives/duplicates/${id}?previousCard=${previousCardId}`}
				className="btn mr-3 bg-indigo-500 hover:bg-indigo-600 text-white"
			>
				<BsChevronLeft />
				<span className="ml-2">Retour</span>
			</Link>
			<MyPDFPreview domesticAndRelative={domesticAndRelative} />
		</>
	);
}

