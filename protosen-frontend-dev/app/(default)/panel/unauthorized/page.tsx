import Image from "next/image";
import Link from "next/link";
import NotFoundImage from "@/public/images/404-illustration.svg";
import NotFoundImageDark from "@/public/images/404-illustration-dark.svg";

export default async function Page() {
	return (
		<main className="grow [&>*:first-child]:scroll-mt-16">
			<div className="relative bg-white dark:bg-slate-900 h-full">
				<div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
					<div className="max-w-2xl m-auto mt-16">
						<div className="text-center px-4">
							<div className="inline-flex mb-8">
								<Image
									className="dark:hidden"
									src={NotFoundImage}
									width={176}
									height={176}
									alt="404 illustration"
								/>
								<Image
									className="hidden dark:block"
									src={NotFoundImageDark}
									width={176}
									height={176}
									alt="404 illustration dark"
								/>
							</div>
							<div className="mb-6">
								Hmm...Vous n'etes pas autorisé à acceder à cette page. Essayez
								de chercher autre chose !
							</div>
							<Link
								href="/panel/diplomatic/holders"
								className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
							>
								Retour à la page d'accueil
							</Link>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
