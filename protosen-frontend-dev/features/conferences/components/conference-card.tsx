import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Conference } from "../types";

interface ConferenceCardProps {
	conference: Conference;
}

export function ConferenceCard({ conference }: ConferenceCardProps) {
	const date = new Date(conference.startDate);
	const formattedDate = date.toLocaleDateString("fr", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<Card className="overflow-hidden relative isolate flex flex-col border-border hover:border-primary/60">
			<CardHeader>
				<div className="space-y-1">
					<h3 className="font-semibold text-xl leading-tight tracking-tight line-clamp-2">
						<Link
							href={`/panel/conferences/${conference.id}`}
							className="w-full"
						>
							<span className="absolute inset-0 z-10"></span>
							{conference.title}
						</Link>
					</h3>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Calendar className="h-4 w-4" />
					{formattedDate}
				</div>
				<div className="mt-2 flex flex-wrap gap-2">
					<div className="flex items-center gap-1 text-sm">
						<MapPin className="h-4 w-4 text-muted-foreground" />
						<span>{conference.location}</span>
					</div>
					<div className="flex items-center gap-1 text-sm">
						<Users className="h-4 w-4 text-muted-foreground" />
						<span>{conference._count.participants ?? 0} participants</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
