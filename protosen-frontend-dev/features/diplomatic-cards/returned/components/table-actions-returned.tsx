import Link from "next/link";
import { BsEye } from "react-icons/bs";
import { Button, buttonVariants } from "@/components/ui/button";
import useCurrentUser from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";

// const getLabel = (label: string) => {
// 	switch (label) {
// 		case "validate":
// 			return "Valider";
// 		case "details":
// 			return "Détails";
// 		case "edit":
// 			return "Modifier";
// 		case "delete":
// 			return "Supprimer";
// 		case "submit":
// 			return "Soumettre";
// 		default:
// 			return "Détails";
// 	}
// };

const TableActionsReturned = ({
	action,
	item,
}: {
	action: {
		label: string;
		href: string;
	};
	item: { [key: string]: any };
}) => {
	// define icon base on label

	// const getIcon = (label: string) => {
	// 	switch (label) {
	// 		case "validate":
	// 			return <BsCheck2All size={20} className="mr-2" />;
	// 		case "details":
	// 			return <BsEye size={20} className="mr-2" />;
	// 		case "edit":
	// 			return <BsPencil size={20} className="mr-2" />;
	// 		case "delete":
	// 			return <BsTrash size={20} className="mr-2" />;
	// 		case "submit":
	// 			return <BsSend size={20} className="mr-2" />;
	// 		default:
	// 			return <BsEye size={20} className="mr-2" />;
	// 	}
	// };
	const currentUser = useCurrentUser();

	const canView = currentUser?.isSuperAdmin || currentUser?.isAdmin;

	return (
		<div className="flex justify-start space-x-2 px-2">
			<Button
				type="button"
				asChild
				disabled={!canView}
				className="bg-blue-500 text-white hover:bg-blue-500/90 cursor-pointer py-2 px-4 [&_svg]:size-5"
			>
				<Link
					href={
						canView
							? `${action.href}/${item.id}?previousCard=${item?.previousCardId}`
							: "#"
					}
					className={cn(
						buttonVariants({ variant: "default" }),
						`flex justify-start focus-visible:ring-offset-0 focus-visible:ring-0 cursor-pointer`,
					)}
				>
					<BsEye size={20} className="mr-2" />
					Détails
				</Link>
			</Button>
		</div>
	);
};

export default TableActionsReturned;
