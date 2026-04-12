"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Mail, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormShad,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	ResponsiveModal,
	ResponsiveModalContent,
} from "@/components/ui/responsive-modal";
import { confirmLoginCode } from "@/features/conferences/lib/participants-apis";
import { sendLoginCode } from "@/features/conferences/lib/participants-apis-client";
import type { ParticipantTokenData } from "@/features/conferences/types";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { PARTICIPANT_TOKEN_KEY } from "@/lib/constants";
import { ConferenceAndRegistrationDetailsWeb } from "./conference-details";

type SendCodeState =
	| { status: "success"; error: null }
	| { status: "error"; error: string }
	| { status: "pending"; error: null }
	| { status: "idle"; error: null };

const codeSchema = z.object({
	code: z
		.string({
			required_error: "Le code est requis",
		})
		.min(1, "Le code est requis"),
});

type FormValue = z.infer<typeof codeSchema>;

export function WrapperLayerParticipantGateway() {
	const [participantId] = useQueryState("participant");
	const router = useRouter();
	const [token, setToken, removeValue] =
		useSessionStorage<ParticipantTokenData>(PARTICIPANT_TOKEN_KEY);

	const [sendCodeState, setSendCodeState] = useState<SendCodeState>({
		status: "idle",
		error: null,
	});
	const [showCodeModal, setShowCodeModal] = useState(true);

	// rensend code time
	const [timeLeft, setTimeLeft] = useState(60);

	const form = useForm<FormValue>({
		resolver: zodResolver(codeSchema),
		defaultValues: {
			code: "",
		},
	});

	const isTokenValid = useCallback(() => {
		if (!token) return false;

		// Check if token is older than 24 hours
		const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
		const isValid = Date.now() - token.createdAt < TWENTY_FOUR_HOURS;
		// console.log(isValid);

		if (!isValid) {
			removeValue();
			// console.log("removed");
		}

		return isValid;
	}, [token, removeValue]);

	const sendCode = useCallback(async () => {
		try {
			setSendCodeState({
				status: "pending",
				error: null,
			});
			if (!participantId) {
				toast.error("Vous n'êtes pas autorisé à accéder à cette page");
				router.replace("/");
				return;
			}
			const response = await sendLoginCode(
				participantId,
				"Erreur lors de l'envoi du code",
				"Code envoyé avec succès",
			);
			if ("code" in response) {
				console.error(response.code, response.message);
				setSendCodeState({
					status: "error",
					error: "Une erreur inconnue est survenue!",
				});
				toast.error("Une erreur inconnue est survenue!");
				return;
			}
			toast.success("Un code a été envoyé à votre mail", {
				description:
					"Veuillez le consulter et entrer le code pour accéder à votre espace",
			});
			setSendCodeState({ status: "success", error: null });
		} catch (error) {
			console.error(error);
			setSendCodeState({
				status: "error",
				error: "Une erreur inconnue est survenue!",
			});
			toast.error("Une erreur inconnue est survenue!");
		}
	}, [participantId, router]);

	// resend code
	const resendCodeMutation = useMutation({
		mutationFn: async () => {
			const response = await sendLoginCode(
				participantId!,
				"Erreur lors de l'envoi du code",
				"Code envoyé avec succès",
			);

			if ("code" in response) {
				console.error(response.code, response.message);
				throw new Error(response.message || "Erreur lors de l'envoi du code");
			}

			return response;
		},
		onSuccess: () => {
			toast.success("Le code à été envoyé");
			setTimeLeft(60);
		},
		onError: ({ message }) => {
			toast.error(message);
		},
	});

	const confirmMutation = useMutation({
		mutationFn: async (data: FormValue) => {
			const response = await confirmLoginCode(
				participantId!,
				{ code: data.code },
				"Erreur lors de la confirmation du code",
				"Confirmation éffectuée avec succès",
			);

			if ("code" in response) {
				console.error(response.code, response.message);
				throw new Error(
					response.message || "Erreur lors de la confirmation du code",
				);
			}

			return response;
		},
		onSuccess: ({ message, data }) => {
			toast.success(message, {
				description: "Bienvenue sur votre espace!",
			});

			if (token && token.participantId !== participantId) {
				removeValue();
				setToken({
					participantId: participantId!,
					token: data.data,
					createdAt: Date.now(),
				});
			} else {
				setToken({
					participantId: participantId!,
					token: data.data,
					createdAt: Date.now(),
				});
			}
			setShowCodeModal(false);
			// console.log(data);
		},
		onError: ({ message }) => {
			toast.error(message);
		},
	});

	const onSubmit = useCallback(
		async (data: FormValue) => {
			confirmMutation.mutate(data);
		},
		[confirmMutation.mutate],
	);

	useEffect(() => {
		if (!participantId) {
			router.replace("/");
			return;
		}

		// Check token validity
		const tokenIsValid = isTokenValid();

		if (!tokenIsValid || !token || token.participantId !== participantId) {
			setShowCodeModal(true);
		} else {
			setShowCodeModal(false);
		}
	}, [participantId, token, isTokenValid, router]);

	useEffect(() => {
		if (timeLeft > 0 && sendCodeState.status === "success") {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [timeLeft, sendCodeState.status]);
	return (
		<>
			{showCodeModal ? (
				<ResponsiveModal open={showCodeModal}>
					<ResponsiveModalContent className="[&>button]:hidden border-border">
						<div className="flex items-center justify-center">
							{sendCodeState.status === "idle" ? (
								<div className="flex flex-col w-full">
									<div className="flex flex-col justify-center items-center space-y-2 mb-6">
										<Mail className="size-10 text-primary" />
										<h2 className="text-xl font-semibold text-center ">
											Accédez à votre espace!
										</h2>
										<p className="text-sm font-medium text-center max-w-sm">
											Pour accéder à votre espace veuillez cliquer sur le bouton
											ci-dessous pour recevoir votre code de confirmation par
											mail
										</p>
									</div>

									<div className="space-y-4 w-full">
										<Button
											onClick={() => sendCode()}
											className="bg-primary hover:bg-primary/90 w-full"
										>
											Envoyer le code de confirmation
										</Button>
									</div>
								</div>
							) : sendCodeState.status === "pending" ? (
								<div className="flex flex-col justify-center items-center space-y-3">
									<Loader2 className="size-10 animate-spin text-primary" />
									<p className="font-semibold">Envoi en cours...</p>
								</div>
							) : sendCodeState.status === "error" ? (
								<div className="flex flex-col justify-center items-center space-y-3">
									<XCircle className="size-10 text-destructive" />
									<p className="font-semibold text-lg text-destructive">
										{sendCodeState.error}
									</p>
									<Link href="/">
										<Button className="w-full">Retour à l'acceuil</Button>
									</Link>
								</div>
							) : (
								<div className="flex flex-col w-full">
									<div className="flex flex-col justify-center items-center max-w-sm mx-auto space-y-2 mb-6">
										<Mail className="size-10 text-primary" />
										<h2 className="text-xl font-semibold text-center ">
											Un code de confirmation à été envoyé à votre mail
										</h2>
										<p className="text-sm font-medium text-center max-w-sm">
											Veuillez le consulter et entrer le code dans le champ
											ci-dessous pour accéder à votre espace.
										</p>
									</div>

									<FormShad {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className="w-full block max-w-full"
										>
											<div className="space-y-4 w-full">
												<FormField
													control={form.control}
													name="code"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-left">
																Code de confirmation{" "}
																<span className="text-red-500">*</span>
															</FormLabel>
															<FormControl>
																<div className="relative">
																	<Input placeholder="Code" {...field} />
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<Button
													type="submit"
													disabled={confirmMutation.isPending}
													className="bg-primary hover:bg-primary/90 w-full"
												>
													Confirmer
													{confirmMutation.isPending && (
														<Loader2 className="size-4 ml-2 animate-spin" />
													)}
												</Button>
											</div>
										</form>
									</FormShad>
									<Button
										disabled={resendCodeMutation.isPending}
										variant="outline"
										onClick={() => resendCodeMutation.mutate()}
										className="w-full mt-4"
									>
										{timeLeft > 0
											? `Renvoyer le code dans ${timeLeft}s`
											: "Renvoyer le code"}
										{resendCodeMutation.isPending && (
											<Loader2 className="size-4 ml-2 animate-spin" />
										)}
									</Button>
								</div>
							)}
						</div>
					</ResponsiveModalContent>
				</ResponsiveModal>
			) : (
				<ConferenceAndRegistrationDetailsWeb />
			)}
		</>
	);
}
