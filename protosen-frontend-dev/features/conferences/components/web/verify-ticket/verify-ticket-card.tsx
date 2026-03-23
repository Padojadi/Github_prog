"use client";

import { Ticket } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import LoadingComponent from "@/components/loadingComponent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { useGetParticipantByCode } from "@/features/conferences/hooks/use-get-current-participant";
import { cn, formatDateFnsLocale } from "@/lib/utils";

export function VerifyTicketCard() {
	const [code] = useQueryState("code");
	const [participantId] = useQueryState("participant");

	const { data, isLoading } = useGetParticipantByCode(
		code?.toLowerCase() ?? "",
	);
	return (
		<Card
			className={cn(
				"overflow-hidden transition-all duration-300 animate-scale-in w-full",
				"border border-border shadow-lg",
				"bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 ",
			)}
		>
			{isLoading ? (
				<CardContent className="flex items-center justify-center p-6 h-[200px]">
					<LoadingComponent />
				</CardContent>
			) : data?.data.conference ? (
				<>
					<CardHeader className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
						<div className="text-center space-y-1">
							<h1 className="text-xl font-bold tracking-tight text-primary">
								{data.data.conference?.title}
							</h1>
							<p>
								{formatDateFnsLocale(data.data.conference.startDate)} -{" "}
								{formatDateFnsLocale(data.data.conference.endDate)}
							</p>
							<p>N° {data.data.code}</p>
						</div>
					</CardHeader>

					<CardContent className="p-6 space-y-6">
						<div className="flex items-start gap-4">
							<Avatar className="h-16 w-16 border-2 border-primary">
								<AvatarImage
									src={data.data.avatarUrl ?? ""}
									alt={`${data.data.lastName} ${data.data.firstName}`}
								/>
								<AvatarFallback className="bg-primary/10 text-primary text-xl">
									{data.data.lastName?.[0]} {data.data.firstName?.[0]}
								</AvatarFallback>
							</Avatar>
							<div>
								<h2 className="text-xl font-semibold">
									{data.data.lastName} {data.data.firstName}
								</h2>
								<p className="text-muted-foreground text-sm">Participant</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
								<Ticket className="h-5 w-5" />
							</div>
							<div className="max-w-sm">
								<h3 className="text-lg font-medium">
									{data.data.ticket?.name}
								</h3>
								{/* <ul className="space-y-2 mt-1">
                  {data.data.ticket?.description.split(",").map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start text-sm text-muted-foreground leading-relaxed"
                    >
                      <CheckCircle className={`h-5 w-5 mr-2 text-primary`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul> */}
								<p className="text-sm text-muted-foreground leading-relaxed mt-1">
									{data.data.ticket?.description}
								</p>
							</div>
						</div>
					</CardContent>

					<CardFooter className="p-6">
						<Link
							href={`/conferences/participant-gateway?participant=${
								participantId ? participantId : data.data.id
							}`}
							className="w-full block"
						>
							<Button variant="outline" className="w-full">
								Accéder à votre espace
							</Button>
						</Link>
					</CardFooter>
				</>
			) : (
				<CardContent>
					<div className="flex items-center justify-center flex-col p-6 h-[200px]">
						<p className="text-center">
							Ticket non trouvé veuillez entrer un code valide ou rééssayer plus
							tard!
						</p>
						<Link href="/" className="mt-3">
							<Button className="">Retour à l'acceuil</Button>
						</Link>
					</div>
				</CardContent>
			)}
		</Card>
	);
}
