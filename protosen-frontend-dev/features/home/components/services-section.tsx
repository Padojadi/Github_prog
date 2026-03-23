"use client";
import {
	ArrowRight,
	Bell,
	Calendar,
	CreditCard,
	FileCheck,
	QrCode,
	Users,
} from "lucide-react";
import Link from "next/link";

const services = [
	{
		icon: Calendar,
		title: "Gestion des Conférences",
		description:
			"Consultez et inscrivez-vous aux conférences gouvernementales officielles organisées par les différents ministères.",
		href: "/conferences",
		color: "bg-[#00853F]",
	},
	{
		icon: Users,
		title: "Inscription en Ligne",
		description:
			"Processus d'inscription simplifié et sécurisé pour tous les événements officiels.",
		href: "/conferences",
		color: "bg-blue-600",
	},
	{
		icon: CreditCard,
		title: "Paiement Sécurisé",
		description:
			"Payez vos frais d'inscription en toute sécurité via nos partenaires de paiement agréés.",
		href: "/conferences",
		color: "bg-[#FDEF42] text-slate-900",
	},
	{
		icon: QrCode,
		title: "Tickets Numériques",
		description:
			"Recevez vos tickets électroniques avec QR code pour un accès rapide et sécurisé aux événements.",
		href: "/conferences/verify-ticket",
		color: "bg-purple-600",
	},
	{
		icon: FileCheck,
		title: "Vérification de Tickets",
		description:
			"Système de vérification instantanée des tickets pour les organisateurs d'événements.",
		href: "/conferences/verify-ticket",
		color: "bg-[#E31B23]",
	},
	{
		icon: Bell,
		title: "Notifications",
		description:
			"Restez informé des nouveaux événements et des rappels pour vos inscriptions.",
		href: "/conferences",
		color: "bg-orange-500",
	},
];

export default function ServicesSection() {
	return (
		<section className="py-16 bg-white dark:bg-slate-950">
			<div className="container-custom">
				{/* En-tête de section */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-2 mb-2">
						<div className="w-8 h-1 bg-[#00853F] rounded-full" />
						<span className="text-sm font-medium text-[#00853F] uppercase tracking-wider">
							Nos Services
						</span>
						<div className="w-8 h-1 bg-[#00853F] rounded-full" />
					</div>
					<h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
						Services Disponibles
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Découvrez l'ensemble des services proposés par PROTOSEN pour
						faciliter votre participation aux événements gouvernementaux.
					</p>
				</div>

				{/* Grille de services */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{services.map((service) => (
						<Link
							key={service.title}
							href={service.href}
							className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-[#00853F]/50 transition-all duration-300"
						>
							{/* Icône */}
							<div
								className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${service.color} text-white mb-4`}
							>
								<service.icon className="h-7 w-7" />
							</div>

							{/* Contenu */}
							<h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-[#00853F] transition-colors">
								{service.title}
							</h3>
							<p className="text-sm text-muted-foreground mb-4">
								{service.description}
							</p>

							{/* Lien */}
							<span className="inline-flex items-center gap-1 text-sm font-medium text-[#00853F] opacity-0 group-hover:opacity-100 transition-opacity">
								En savoir plus
								<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
							</span>

							{/* Décoration au survol */}
							<div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#00853F] via-[#FDEF42] to-[#E31B23] rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity" />
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
