import dynamic from "next/dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import {
	fetchChildCardById,
	fetchRenewChildCardById,
} from "@/lib/actions/diplomaticCards/childs";

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
		fetchRenewChildCardById(id),
		fetchChildCardById(previousCardId),
	]);
	const child = res[1].data;
	const childRenew = res[0].data;
	// Check if the user can edit the form
	const canPrint =
		childRenew?.documentStage &&
		(childRenew?.documentStage === "confirmed" ||
			childRenew?.documentStage === "printed");

	if (canPrint === false) {
		redirect("/panel/diplomatic/childs/renew");
	}

	return (
		<>
			<Link
				href={`/panel/diplomatic/childs/renew/${id}?previousCard=${previousCardId}`}
				className="btn mr-3 bg-indigo-500 hover:bg-indigo-600 text-white"
			>
				<BsChevronLeft />
				<span className="ml-2">Retour</span>
			</Link>
			<MyPDFPreview child={child} />
		</>
	);
}
