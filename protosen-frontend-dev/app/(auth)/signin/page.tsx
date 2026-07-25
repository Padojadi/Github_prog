export const metadata = {
	title: "Sign In - Protosen",
	description: "Sign In - Protosen",
};

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AuthHeader from "../auth-header";
import AuthImage from "../auth-image";
import FlagSenegal from "@/public/images/flag-of-senegal.png";
import Image from "next/image";
import { authOptions } from "@/lib/auth/authOptions";
import SigninForm from "./form";

export default async function LoginPage() {
	const session = await getServerSession(authOptions);

	if (session?.backendTokens.accessToken) {
		redirect("/panel/dashboard");
	}

	return (
		<main className="bg-white dark:bg-slate-900">
			<div className="relative md:flex">
				{/* Content */}
				<div className="md:w-1/2">
					<div className="min-h-[100dvh] h-full flex flex-col">
						<AuthHeader />

						<div className="max-w-sm mx-auto w-full px-4 py-8">
							<h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">
								Bienvenue ! ✨
							</h1>
							{/* Form */}
							<SigninForm />
							{/* Footer */}
							{/* <div className="pt-5 mt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="text-sm">
                  Vous n'avez pas de compte?{" "}
                  <Link
                    className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                    href="/signup"
                  >
                    Créer un compte
                  </Link>
                </div>
                Warning
              </div> */}
						</div>
						<div className="flex-1"></div>
						<div className="mb-5">
							<div className=" flex items-center bg-gray-100 dark:bg-gray-400/30 text-slate-600 dark:text-slate-400 px-3 py-2 rounded">
								<Image
									src={FlagSenegal}
									width={100}
									height={66.7}
									alt="Senegal"
									className="mr-5"
								/>
								<div>
									<h1 className="uppercase">République du Sénégal</h1>
									<p className="text-sm">Ministère de l'Intégration Africaine et des Affaires Étrangères- MIAAE Protosen</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<AuthImage />
			</div>
		</main>
	);
}
