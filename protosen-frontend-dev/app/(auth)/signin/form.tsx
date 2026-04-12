"use client";

import Link from "next/link";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import LoadingIcon from "@/components/ui/icons/loadingIcon";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	FormShad,
} from "@/components/ui/form";
import {
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	Tooltip,
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

const formSchema = z.object({
	email: z.string().email("Entrer un email valide"),
	password: z
		.string()
		.min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const SigninForm = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => setShowPassword(!showPassword);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		// e.preventDefault();

		// const formData = new FormData(e.currentTarget);

		try {
			setLoading(true);
			const response = await signIn("credentials", {
				email: values.email,
				password: values.password,
				redirect: false,
			});
			// const res = await fetch("https://protosen.sec.gouv.sn/api" + "/auth/login", {
			//   method: "POST",
			//   body: JSON.stringify({
			//     email,
			//     password,
			//   }),
			//   headers: {
			//     "Content-Type": "application/json",
			//   },
			// });
			setLoading(false);

			// console.log("la response", response);

			if (response?.error) {
				toast.error(
					response?.error === "CredentialsSignin"
						? "Email ou mot de passe incorrect"
						: "Une erreur est survenue"
				);
			}

			// If no error, redirect to homepage
			if (!response?.error) {
				router.push("/panel/diplomatic/holders");
				// router.refresh();
			}
		} catch (error) {
			setLoading(false);
		}
	};

	return (
		<FormShad {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<label
									className="block text-sm font-medium mb-1"
									htmlFor="email"
								>
									Adresse e-mail
								</label>
								<FormControl>
									<input
										id="email"
										className="form-input w-full"
										type="email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<label
									className="block text-sm font-medium mb-1"
									htmlFor="password"
								>
									Mot de passe
								</label>
								<FormControl>
									<div className="relative flex-1">
										<input
											id="password"
											className="form-input w-full"
											type={showPassword ? "text" : "password"}
											autoComplete="on"
											{...field}
										/>
										<div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
											{showPassword ? (
												<BsFillEyeFill
													className="h-4 w-4"
													onClick={togglePasswordVisibility}
												/>
											) : (
												<BsFillEyeSlashFill
													className="h-4 w-4"
													onClick={togglePasswordVisibility}
												/>
											)}
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex items-center justify-between mt-6">
					<div className="mr-1">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className="text-sm underline hover:no-underline">
										Mot de passe oublié ?
									</span>
								</TooltipTrigger>
								<TooltipContent>
									<p>
										Veuillez contacter la DPCT pour un nouveau mot de passe.
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					{loading ? (
						<button
							className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3 disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
							disabled
						>
							<LoadingIcon />
							<span className="ml-2">Se connecter</span>
						</button>
					) : (
						<button
							className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
							type="submit"
						>
							Se connecter
						</button>
					)}
				</div>
				{/* <Button type="submit">Submit</Button> */}
			</form>
		</FormShad>
		// <form onSubmit={handleSubmit}>
		//   <div className="space-y-4">
		//     <div>
		//       <label className="block text-sm font-medium mb-1" htmlFor="email">
		//         Adresse e-mail
		//       </label>
		//       <input
		//         name="email"
		//         id="email"
		//         className="form-input w-full"
		//         type="email"
		//       />
		//     </div>
		//     <div>
		//       <label className="block text-sm font-medium mb-1" htmlFor="password">
		//         Mot de passe
		//       </label>
		//       <input
		//         name="password"
		//         id="password"
		//         className="form-input w-full"
		//         type="password"
		//         autoComplete="on"
		//       />
		//     </div>
		//   </div>
		//   <div className="flex items-center justify-between mt-6">
		//     <div className="mr-1">
		//       <Link
		//         className="text-sm underline hover:no-underline"
		//         href="/reset-password"
		//       >
		//         Mot de passe oublié ?
		//       </Link>
		//     </div>
		//     {loading ? (
		//       <button
		//         className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3 disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
		//         disabled
		//       >
		//         <LoadingIcon />
		//         <span className="ml-2">Se connecter</span>
		//       </button>
		//     ) : (
		//       <button
		//         className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
		//         type="submit"
		//       >
		//         Se connecter
		//       </button>
		//     )}
		//   </div>
		// </form>
	);
};

export default SigninForm;
