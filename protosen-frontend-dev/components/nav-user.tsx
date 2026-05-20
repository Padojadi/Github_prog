"use client";

import { ChevronsUpDown, Cog, Grid2X2, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCurrentUser from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function NavUser({ isScrolled }: { isScrolled: boolean }) {
	const currentUser = useCurrentUser();
	// const callbackUrl = process.env.NODE_ENV === "production" ? "https://protosen.gouv.sn/signin" : "/signin";
	const router = useRouter();

	const onLogout = async () => {
		await signOut({ redirect: false });
		// router.push("/signin");
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="gap-2">
					<Image
						className="w-8 h-8 rounded-full"
						src="/images/user-avatar-32.png"
						width={32}
						height={32}
						alt="User"
					/>
					<div
						className={cn(
							"grid flex-1 text-left text-sm leading-tight text-foreground",
							!isScrolled && "text-white",
						)}
					>
						<span className="truncate font-semibold">
							{currentUser?.fullName || "User"}
						</span>
						<span className="truncate text-xs">
							{currentUser?.email || "N/A"}
						</span>
					</div>
					<ChevronsUpDown className="ml-auto size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Image
							className="w-8 h-8 rounded-full"
							src="/images/user-avatar-32.png"
							width={32}
							height={32}
							alt="User"
						/>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">
								{currentUser?.fullName || "User"}
							</span>
							<span className="truncate text-xs">
								{currentUser?.email || "N/A"}
							</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<Link href="/panel/dashboard">
						<DropdownMenuItem>
							<Grid2X2 />
							Dashboard
						</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<Link href="/panel/settings">
						<DropdownMenuItem>
							<Cog />
							Paramètres
						</DropdownMenuItem>
					</Link>

					{/* <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={onLogout}>
					<LogOut />
					Se déconnecter
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
