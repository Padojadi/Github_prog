import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import {
	BsCheck2All,
	BsEye,
	BsLock,
	BsPencil,
	BsSend,
	BsTrash,
} from "react-icons/bs";
import { ChangePasswordModal } from "@/app/(default)/panel/users/_components/change-password-modal";
import DeleteButton from "@/components/deleteButton";
import DeleteCardButton from "@/components/table/delete-card-button";
import ReturnCardButton from "@/components/table/return-card-button";
import UnblockCardButton from "@/components/table/unblock-card-button";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCurrentUser from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";

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
		case "submit":
			return "Soumettre";
		default:
			return "Détails";
	}
};

const TableActionsRenew = ({
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
			case "submit":
				return <BsSend size={20} className="mr-2" />;
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
	const canSubmit = item?.documentStage === "onhold";
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
						if (action.label === "delete" && action.customAction) {
							return (
								<Fragment key={action.label}>
									<DropdownMenuItem asChild>
										<DeleteButton
											label="Supprimer"
											onDeleteAction={action.customAction}
											isDisabled={item?.role && item.role === "super_admin"}
											id={item.id}
										/>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
								</Fragment>
							);
						} else if (action.label === "password") {
							return (
								<DropdownMenuItem key={action.label} asChild>
									<Button
										type="button"
										onClick={() => {
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
								<DropdownMenuItem key={action.label} asChild>
									<UnblockCardButton
										item={item}
										action={action.customAction}
										label="Débloquer la carte"
									/>
								</DropdownMenuItem>
							);
						} else if (action.label === "delete-card" && action.customAction) {
							return (
								<Fragment key={action.label}>
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
							// const urlParam =
							//   action.param &&
							//   (action.param === "renew_id" || action.param === "duplicate_id")
							//     ? `?${action.param}=${item.id}`
							//     : "";
							return (
								<DropdownMenuItem
									key={action.label}
									asChild
									disabled={
										(action.label === "edit" && !canEdit) ||
										(action.label === "submit" && !canSubmit)
									}
								>
									<Link
										href={
											action.label === "edit" && !canEdit
												? "#"
												: action.href +
													"/" +
													item.id +
													(action.label === "edit"
														? `/edit?previousCard=${item.previousCardId}`
														: action.label === "validate"
															? `/validate?previousCard=${item.previousCardId}`
															: action.label === "submit" && canSubmit
																? `/submit?previousCard=${item.previousCardId}`
																: `?previousCard=${item.previousCardId}`)
										}
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

export default TableActionsRenew;
