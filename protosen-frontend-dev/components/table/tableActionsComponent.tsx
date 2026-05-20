import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { BsCheck2All, BsEye, BsLock, BsPencil, BsTrash } from "react-icons/bs";
import { ChangePasswordModal } from "@/app/(default)/panel/users/_components/change-password-modal";
import useCurrentUser from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import DeleteButton from "../deleteButton";
import { Button, buttonVariants } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DeleteCardButton from "./delete-card-button";
import ReturnCardButton from "./return-card-button";
import UnblockCardButton from "./unblock-card-button";

const getLabel = (label: string) => {
	switch (label) {
		case "validate":
			return "Valider";
		case "details":
			return "Détails";
		case "edit":
			return "Modifier";
		case "delete":
			return "Supprimer";
		case "return":
			return "Restituer";
		default:
			return "Détails";
	}
};

const TableActionsComponent = ({
	actions,
	item,
}: {
	actions: {
		label: string;
		href: string;
		param?: string;
		customAction?: (id: string) => Promise<any>;
		openModal?: (item: { [key: string]: any }) => void;
	}[];
	item: { [key: string]: any };
}) => {
	// define icon base on label

	const [open, setOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(false);
	const getIcon = (label: string) => {
		switch (label) {
			case "validate":
				return <BsCheck2All size={20} className="mr-2" />;
			case "details":
				return <BsEye size={20} className="mr-2" />;
			case "edit":
				return <BsPencil size={20} className="mr-2" />;
			case "delete":
				return <BsTrash size={20} className="mr-2" />;
			default:
				return <BsEye size={20} className="mr-2" />;
		}
	};
	const currentUser = useCurrentUser();
	const canEdit =
		((item?.documentStage &&
			item?.documentStage !== "pending" &&
			item?.documentStage !== "accepted" &&
			item?.documentStage !== "printed" &&
			item?.documentStage !== "confirmed") ||
			(currentUser?.isSuperAdmin && item?.documentStage !== "printed")) &&
		!item?.expired;
	const canValidate = currentUser?.isSuperAdmin || currentUser?.isAdmin;
	if (!canValidate) {
		actions = actions.filter((action) => action.label !== "validate");
	}
	const canEditPassword = currentUser?.isSuperAdmin;

	return (
		<div className="flex justify-start space-x-2 px-2">
			<DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
				<DropdownMenuTrigger>
					<MoreHorizontal className="size-4" />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{actions.map((action, index) => {
						if (action.label === "return" && action.customAction) {
							return (
								<DropdownMenuItem key={action.label} asChild>
									<ReturnCardButton
										item={item}
										action={action.customAction}
										label="Restituer la carte"
									/>
								</DropdownMenuItem>
							);
						}
						if (action.label == "delete" && action.customAction) {
							return (
								<Fragment key={index}>
									<DropdownMenuItem key={index} asChild>
										<DeleteButton
											label="Supprimer"
											onDeleteAction={action.customAction}
											isDisabled={item?.role && item.role == "super_admin"}
											id={item.id}
										/>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
								</Fragment>
							);
						} else if (action.label === "password") {
							return (
								<DropdownMenuItem key={index} asChild>
									<Button
										type="button"
										onClick={(e) => {
											setOpenDropdown(false);
											setTimeout(() => setOpen(true), 0);
										}}
										className="bg-transparent text-accent-foreground hover:bg-accent cursor-pointer py-2 px-4 [&_svg]:size-5"
									>
										<BsLock size={20} className="mr-2" />
										Changer mot de passe
									</Button>
								</DropdownMenuItem>
							);
						} else if (action.label === "unlock" && action.customAction) {
							return (
								<DropdownMenuItem key={index} asChild>
									<UnblockCardButton
										item={item}
										action={action.customAction}
										label="Débloquer la carte"
									/>
								</DropdownMenuItem>
							);
						} else if (action.label === "return" && action.customAction) {
							return (
								<DropdownMenuItem key={index} asChild>
									<ReturnCardButton
										item={item}
										action={action.customAction}
										label="Restituer la carte"
									/>
								</DropdownMenuItem>
							);
						} else if (action.label === "delete-card" && action.customAction) {
							return (
								<Fragment key={index}>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<DeleteCardButton
											item={item}
											action={action.customAction}
											label="Supprimer la carte"
										/>
									</DropdownMenuItem>
								</Fragment>
							);
						} else {
							const urlParam =
								action.param &&
								(action.param == "renew_id" || action.param == "duplicate_id")
									? `?${action.param}=${item.id}`
									: "";
							return (
								<DropdownMenuItem
									key={index}
									asChild
									disabled={action.label === "edit" && !canEdit}
								>
									<Link
										href={
											action.label === "edit" && !canEdit
												? "#"
												: action.href +
													(action.param &&
													(action.param == "renew_id" ||
														action.param == "duplicate_id")
														? item["previousCardId"]
														: item.id) +
													(action.label === "edit"
														? "/edit" + urlParam
														: action.label === "validate"
															? "/validate" + urlParam
															: "" + urlParam)
										}
										key={index}
										className={cn(
											buttonVariants({ variant: "default" }),
											`flex rounded-none justify-start bg-transparent text-accent-foreground hover:bg-accent focus-visible:ring-offset-0 focus-visible:ring-0 cursor-pointer`,
										)}
									>
										{getIcon(action.label)}
										{getLabel(action.label)}
									</Link>
								</DropdownMenuItem>
							);
						}
					})}
				</DropdownMenuContent>
			</DropdownMenu>
			<ChangePasswordModal
				item={item}
				open={open}
				onClose={setOpen}
				label="Changer mot de passe"
			/>
		</div>
	);
};

export default TableActionsComponent;
