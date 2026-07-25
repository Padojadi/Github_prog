import dynamic from "next/dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import {
	fetchDomesticAndRelativeCardById,
	fetchRenewDomesticAndRelativeCardById,
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
		fetchRenewDomesticAndRelativeCardById(id),
		fetchDomesticAndRelativeCardById(previousCardId),
	]);
	const domesticAndRelative = res[1].data;
	const domesticAndRelativeRenew = res[0].data;
	// Check if the user can edit the form
	const canPrint =
		domesticAndRelativeRenew?.documentStage &&
		(domesticAndRelativeRenew?.documentStage === "confirmed" ||
			domesticAndRelativeRenew?.documentStage === "printed");

	if (canPrint === false) {
		redirect("/panel/diplomatic/domestics-and-relatives/renew");
	}

	return (
		<>
			<Link
				href={`/panel/diplomatic/domestics-and-relatives/renew/${id}?previousCard=${previousCardId}`}
				className="btn mr-3 bg-indigo-500 hover:bg-indigo-600 text-white"
			>
				<BsChevronLeft />
				<span className="ml-2">Retour</span>
			</Link>
			<MyPDFPreview domesticAndRelative={domesticAndRelative} />
		</>
	);
}
