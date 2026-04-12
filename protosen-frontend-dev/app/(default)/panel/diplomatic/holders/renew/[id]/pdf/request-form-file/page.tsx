import dynamic from "next/dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import {
	fetchHolderCardById,
	fetchRenewHolderCardById,
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
		fetchRenewHolderCardById(id),
		fetchHolderCardById(previousCardId),
	]);

	const holder = res[1].data;
	const renewData = res[0].data;
	// Check if the user can edit the form
	const canPrint =
		renewData?.documentStage &&
		(renewData?.documentStage === "confirmed" ||
			renewData?.documentStage === "printed");

	if (canPrint === false) {
		redirect("/panel/diplomatic/holders/renew");
	}

	return (
		<>
			<Link
				href={`/panel/diplomatic/holders/renew/${id}?previousCard=${previousCardId}`}
				className="btn mr-3 bg-indigo-500 hover:bg-indigo-600 text-white"
			>
				<BsChevronLeft />
				<span className="ml-2">Retour</span>
			</Link>
			<MyPDFPreview holder={holder} />
		</>
	);
}
