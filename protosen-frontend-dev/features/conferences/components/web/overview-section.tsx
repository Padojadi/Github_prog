import { MapPin } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import PlateStatic from "@/components/editor/plate-static";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ConferencePublic } from "../../types";

type OverviewSectionProps = {
	conference: ConferencePublic;
};

export function OverviewSectionWeb({ conference }: OverviewSectionProps) {
	const { theme } = useTheme();

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div className="lg:col-span-2 space-y-8">
				<div className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 animate-fade-in">
					<h3 className="text-xl font-medium mb-4">
						À propos de la conference
					</h3>
					<div
						className={cn(
							"w-full rounded-lg border-0",
							theme === "dark" && "dark",
						)}
						data-registry="plate"
					>
						{conference.description && (
							<PlateStatic value={conference.description} />
						)}
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<div
					className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 animate-fade-in"
					style={{ animationDelay: "150ms" }}
				>
					<h3 className="text-xl font-medium mb-4">Inscription</h3>

					<div className="space-y-4">
						{/* <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Participants</span>
              <span className="font-medium">
                {conference.attendees}/{conference.capacity}
              </span>
            </div> */}

						{/* <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (conference.attendees / conference.capacity) * 100
                  }%`,
                }}
              ></div>
            </div> */}

						{/* {conference.registrationStatus === "REGISTERED" ? (
              <div className="bg-success/10 border border-success/30 text-success rounded-md p-3 text-sm">
                <p className="font-medium">
                  Vous êtes inscrit pour cette conference
                </p>
                <p className="mt-1">
                  Your registration is confirmed and you're all set to attend.
                </p>
              </div>
            ) : ( */}
						<Link href={`/conferences/${conference.id}/register`}>
							<Button className="w-full">S'inscrire maintenant</Button>
						</Link>
						{/* )} */}
					</div>
				</div>

				<div
					className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 animate-fade-in"
					style={{ animationDelay: "100ms" }}
				>
					<h3 className="text-xl font-medium mb-4">Informations sur le lieu</h3>
					<div className="flex items-center text-foreground/90 text-sm">
						<MapPin className="h-4 w-4 mr-2" />
						<span>{conference.location}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
