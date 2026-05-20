import dynamic from "next/dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import {
	fetchOtherDependantCardById,
	fetchRenewOtherDependantCardById,
} from "@/lib/actions/diplomaticCards/otherDependants";

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
		fetchRenewOtherDependantCardById(id),
		fetchOtherDependantCardById(previousCardId),
	]);
	const otherDependant = res[1].data;
	const otherDependantRenew = res[0].data;
	// Check if the user can edit the form
	const canPrint =
		otherDependantRenew?.documentStage &&
		(otherDependantRenew?.documentStage === "confirmed" ||
			otherDependantRenew?.documentStage === "printed");

	if (canPrint === false) {
		redirect("/panel/diplomatic/other-dependants/renew");
	}

	return (
		<>
			<Link
				href={`/panel/diplomatic/other-dependants/renew/${id}?previousCard=${previousCardId}`}
				className="btn mr-3 bg-indigo-500 hover:bg-indigo-600 text-white"
			>
				<BsChevronLeft />
				<span className="ml-2">Retour</span>
			</Link>
			<MyPDFPreview otherDependant={otherDependant} />
		</>
	);
}
