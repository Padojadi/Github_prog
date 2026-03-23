"use client";
import {
	ArrowRight,
	Calendar,
	ChevronRight,
	FileText,
	Play,
	Search,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const quickLinks = [
	{
		icon: Calendar,
		title: "Conférences",
		description: "Consultez les événements à venir",
		href: "/conferences",
		color: "from-emerald-500 to-emerald-600",
	},
	{
		icon: FileText,
		title: "Inscriptions",
		description: "Inscrivez-vous aux conférences",
		href: "/conferences",
		color: "from-amber-500 to-amber-600",
	},
	// {
	//   icon: Users,
	//   title: "Espace Participant",
	//   description: "Accédez à votre espace",
	//   href: "/conferences/participant-gateway",
	//   color: "from-rose-500 to-rose-600",
	// },
];

const headlines = [
	"Conférences Gouvernementales",
	"Événements Officiels",
	"Forums & Séminaires",
];

export default function HeroGov() {
	const [searchQuery, setSearchQuery] = useState("");
	const [currentHeadline, setCurrentHeadline] = useState(0);
	const router = useRouter();

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentHeadline((prev) => (prev + 1) % headlines.length);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/conferences?search=${encodeURIComponent(searchQuery)}`);
		}
	};

	return (
		<section className="relative min-h-[90vh] flex items-center overflow-hidden">
			{/* Image de fond */}
			<div className="absolute inset-0">
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat"
					style={{
						backgroundImage: "url('/images/conferences/conferences-hero.jpg')",
					}}
				/>
				{/* Overlay dégradé */}
				<div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
				<div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
			</div>

			{/* Motifs décoratifs */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Cercles lumineux */}
				<div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#00853F]/20 rounded-full blur-[120px]" />
				<div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-[#FDEF42]/10 rounded-full blur-[100px]" />

				{/* Grille subtile */}
				<div
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
						backgroundSize: "60px 60px",
					}}
				/>
			</div>

			{/* Bande tricolore verticale à gauche */}
			<div className="absolute left-0 top-0 bottom-0 w-1.5 flex flex-col">
				<div className="flex-1 bg-[#00853F]" />
				<div className="flex-1 bg-[#FDEF42]" />
				<div className="flex-1 bg-[#E31B23]" />
			</div>

			{/* Contenu principal */}
			<div className="container-custom relative z-10 py-20 md:py-32">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					{/* Colonne gauche - Texte */}
					<div className="text-white">
						{/* Badge République */}
						<div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
							<img
								src="/images/logo.png"
								alt="Emblème"
								className="h-8 w-auto"
							/>
							<div className="h-4 w-px bg-white/30" />
							<span className="text-sm font-medium text-white/90 uppercase tracking-wider">
								République du Sénégal
							</span>
						</div>

						{/* Titre principal */}
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
							<span className="text-white">PROTOSEN</span>
						</h1>

						{/* Sous-titre animé */}
						<div className="h-12 md:h-14 mb-6 overflow-hidden">
							<p
								key={currentHeadline}
								className="text-2xl md:text-3xl font-semibold text-[#FDEF42] animate-fade-in"
							>
								{headlines[currentHeadline]}
							</p>
						</div>

						{/* Description */}
						<p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
							Plateforme officielle de gestion des conférences et événements
							gouvernementaux. Découvrez, inscrivez-vous et participez aux
							événements qui façonnent l'avenir du Sénégal.
						</p>

						{/* Boutons d'action */}
						<div className="flex flex-wrap gap-4 mb-10">
							<Link href="/conferences">
								<Button
									size="lg"
									className="bg-[#00853F] hover:bg-[#006B32] text-white px-8 h-14 text-base font-semibold shadow-lg shadow-[#00853F]/25 hover:shadow-xl hover:shadow-[#00853F]/30 transition-all"
								>
									Voir les conférences
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
							{/*<Link href="/conferences/participant-gateway">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/50 px-8 h-14 text-base font-semibold transition-all"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Espace Participant
                </Button>
              </Link>*/}
						</div>

						{/* Statistiques rapides */}
						<div className="flex items-center gap-8 pt-6 border-t border-white/10">
							<div>
								<p className="text-3xl font-bold text-white">150+</p>
								<p className="text-sm text-white/60">Conférences</p>
							</div>
							<div className="h-10 w-px bg-white/20" />
							<div>
								<p className="text-3xl font-bold text-white">25K+</p>
								<p className="text-sm text-white/60">Participants</p>
							</div>
							<div className="h-10 w-px bg-white/20" />
							<div>
								<p className="text-3xl font-bold text-white">45</p>
								<p className="text-sm text-white/60">Ministères</p>
							</div>
						</div>
					</div>

					{/* Colonne droite - Carte de recherche et accès rapides */}
					<div className="space-y-6">
						{/* Carte de recherche */}
						{/*<div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
							<h2 className="text-xl font-semibold text-white mb-4">
								Rechercher un événement
							</h2>
							<form onSubmit={handleSearch}>
								<div className="relative mb-4">
									<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
									<input
										type="text"
										placeholder="Nom de la conférence, thème, date..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full h-14 pl-12 pr-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 border-0 shadow-lg focus:ring-2 focus:ring-[#00853F] focus:outline-none text-base"
									/>
								</div>
								<Button
									type="submit"
									className="w-full h-12 bg-[#00853F] hover:bg-[#006B32] text-white font-semibold"
								>
									<Search className="mr-2 h-4 w-4" />
									Rechercher
								</Button>
							</form>
						</div>*/}

						{/* Accès rapides */}
						<div className="space-y-3">
							<p className="text-sm font-medium text-white/60 uppercase tracking-wider px-1">
								Accès rapides
							</p>
							{quickLinks.map((link) => (
								<Link
									key={link.title}
									href={link.href}
									className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
								>
									<div
										className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg`}
									>
										<link.icon className="h-6 w-6 text-white" />
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-white group-hover:text-[#FDEF42] transition-colors">
											{link.title}
										</h3>
										<p className="text-sm text-white/60 truncate">
											{link.description}
										</p>
									</div>
									<ChevronRight className="h-5 w-5 text-white/40 group-hover:text-[#FDEF42] group-hover:translate-x-1 transition-all" />
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Vague décorative en bas */}
			<div className="absolute bottom-0 left-0 right-0">
				<svg
					viewBox="0 0 1440 100"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full h-auto"
					preserveAspectRatio="none"
				>
					<path
						d="M0 100L48 95.8C96 91.7 192 83.3 288 79.2C384 75 480 75 576 77.1C672 79.2 768 83.3 864 83.3C960 83.3 1056 79.2 1152 75C1248 70.8 1344 66.7 1392 64.6L1440 62.5V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0Z"
						className="fill-white dark:fill-slate-950"
					/>
				</svg>
			</div>

			{/* Indicateur de défilement */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/50 animate-bounce">
				<span className="text-xs uppercase tracking-wider">Découvrir</span>
				<div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
					<div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" />
				</div>
			</div>
		</section>
	);
}
