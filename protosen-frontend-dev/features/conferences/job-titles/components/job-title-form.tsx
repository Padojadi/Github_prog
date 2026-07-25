"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { BsFloppy } from "react-icons/bs";
import { toast } from "sonner";
import * as z from "zod";
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
import { createJobTitles, updateJobTitles } from "../lib/apis";
import type { JobTitle } from "../types";

const formSchema = z.object({
	name: z.string().min(1, "Le nom est requis"),
});

type FormValues = z.infer<typeof formSchema>;

interface JobTitleFormProps {
	initialData?: JobTitle;
	onClose: () => void;
}

export function JobTitleForm({ initialData, onClose }: JobTitleFormProps) {
	const queryQlient = useQueryClient();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? {
					name: initialData?.name,
				}
			: { name: "" },
	});

	const submitMutation = useMutation({
		mutationFn: async (data: unknown) => {
			const response = initialData
				? await updateJobTitles(
						initialData?.id,
						data,
						"Erreur de modification de fonction",
						"Fonction modifiée avec succès",
					)
				: await createJobTitles(
						data,
						"Erreur de création de fonction",
						"Fonction créée avec succès",
					);
			if ("code" in response) {
				throw new Error(
					response.message || "Une erreur inconnue s'est produite",
				);
			}
			return response;
		},
		onSuccess: ({ message }) => {
			queryQlient.invalidateQueries({
				queryKey: ["job-titles"],
			});
			toast.success(message || "Succès");
			form.reset();
			onClose();
		},
		onError: ({ message }) => {
			toast.error(message || "Une erreur est survenue");
		},
	});

	const handleSubmit = async (data: FormValues) => {
		submitMutation.mutate(data);
	};

	return (
		<FormShad {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nom</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full"
					disabled={submitMutation.isPending}
				>
					{submitMutation.isPending ? (
						<Loader2 className="size-4 mr-2 animate-spin" />
					) : (
						<BsFloppy size={16} className="mr-2" />
					)}
					{initialData ? "Modifier" : "Enregister"}
				</Button>
			</form>
		</FormShad>
	);
}
