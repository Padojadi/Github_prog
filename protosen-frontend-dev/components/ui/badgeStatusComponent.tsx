import Tooltip from "../tooltip";

export default function BadgeStatusComponent({
	status,
	rejectReason,
}: {
	status: string;
	rejectReason?: string | null;
}) {
	if (status === "rejected") {
		return (
			<div className="px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
				<span>{translateStatus("rejected")}</span>
				{rejectReason && (
					<Tooltip size="md" bg="light">
						<p className="text-xs">{rejectReason}</p>
					</Tooltip>
				)}
			</div>
		);
	}
	return (
		<span
			className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
				status === "onhold" || status === "processing"
					? "bg-gray-200 text-gray-800"
					: status === "pending"
						? "bg-yellow-100 text-yellow-800"
						: status === "confirmed"
							? "bg-green-100 text-green-800"
							: status === "accepted"
								? "bg-blue-100 text-blue-800"
								: status === "rejected"
									? "bg-red-100 text-red-800"
									: status === "printed"
										? "bg-orange-100 text-orange-800"
										: status === "RETURNED"
											? "bg-stone-100 text-stone-800"
											: "bg-indigo-100 text-indigo-800"
			}`}
		>
			{translateStatus(status)}
		</span>
	);
}

export function translateStatus(status: string) {
	switch (status) {
		case "pending":
			return "En attente";
		case "processing":
			return "En cours";
		case "confirmed":
			return "Confirmé";
		case "accepted":
			return "Accepté";
		case "rejected":
			return "Rejeté";
		case "printed":
			return "Imprimé";
		case "active":
			return "Actif";
		case "inactive":
			return "Inactif";
		case "RETURNED":
			return "Restitué";
		case "onhold":
			return "Brouillon"; // TODO: Normalement c'est "En attente"
		default:
			return status;
	}
}

export function translateStatusBack(status: any) {
	switch (status) {
		case "En attente":
			return "pending";
		case "En cours":
			return "processing";
		case "Confirmé":
			return "confirmed";
		case "Accepté":
			return "accepted";
		case "Rejeté":
			return "rejected";
		case "Imprimé":
			return "printed";
		case "Actif":
			return "active";
		case "Inactif":
			return "inactive";
		case "Restitué":
			return "RETURNED";
		case "Brouillon":
			return "onhold"; // TODO: Normalement c'est "En attente"
		default:
			return status;
	}
}
