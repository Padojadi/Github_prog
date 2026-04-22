import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TempHome() {
	return (
		<main className="min-h-svh w-full grid place-content-center">
			<Card className=" dark:border-slate-700">
				<CardContent className="p-6 space-y-4 items-center flex flex-col">
					<div className="flex items-center justify-start">
						<img
							src="/images/logo.png"
							alt="Logo Protosen"
							className="h-8 w-auto"
						/>{" "}
						<span className="text-xl text-foreground font-bold hidden md:inline-block ml-2 uppercase">
							Protosen
						</span>
					</div>
					<h1 className="text-4xl font-semibold text-center">
						Bienvenue sur Protosen
					</h1>
					<Button className="w-full">
						<Link href="/panel/diplomatic/holders">
							Accéder aux cartes diplomatiques
						</Link>
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}
