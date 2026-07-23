import Link from "next/link";

export default function TempHome() {
	return (
		<main className="min-h-svh w-full grid place-content-center bg-slate-50">
			<div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
				<div className="flex items-center justify-center">
					<img
						src="/images/logo.png"
						alt="Logo Protosen"
						className="h-8 w-auto"
					/>
					<span className="ml-2 text-xl font-bold uppercase text-slate-900">
						Protosen
					</span>
				</div>
				<h1 className="mt-4 text-3xl font-semibold text-slate-900">
					Bienvenue sur Protosen
				</h1>
				<Link
					href="/panel/diplomatic/holders"
					className="mt-6 inline-flex rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
				>
					Accéder aux cartes diplomatiques
				</Link>
			</div>
		</main>
	);
}
