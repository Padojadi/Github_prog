"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormShad,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { BsFloppy } from "react-icons/bs";
import { createPlates, updatePlates } from "../lib/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TPlate } from "../types";
import { toast } from "react-toastify";

const formSchema = z.object({
  title: z.string().min(1, "Le nom est requis"),
  code: z
    .string()
    .min(1, "Le code est requis")
    .max(4, "Le code ne doit pas dépasser 4 caractères"),
});

type FormValues = z.infer<typeof formSchema>;

interface PlateFormProps {
  initialData?: TPlate;
  onClose: () => void;
}

export function PlateForm({ initialData, onClose }: PlateFormProps) {
  const queryQlient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData?.title || "",
          code: initialData?.code || "",
        }
      : { title: "", code: "" },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: unknown) => {
      let response = initialData
        ? await updatePlates(
            initialData?.id,
            data,
            "Erreur de modification de la plaque",
            "Plaque modifiée avec succès"
          )
        : await createPlates(
            data,
            "Erreur de création de la plaque",
            "Plaque créé avec succès"
          );
      if (response.status === "error") {
        throw new Error(
          response.message || "Une erreur inconnue s'est produite"
        );
      }
      return response;
    },
    onSuccess: ({ message }) => {
      queryQlient.invalidateQueries({
        queryKey: ["plates"],
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-flex items-center">Code</FormLabel>
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
            <Loader2 className="size-4 mr-2" />
          ) : (
            <BsFloppy size={16} className="mr-2" />
          )}
          {initialData ? "Modifier" : "Enregister"}
        </Button>
      </form>
    </FormShad>
  );
}
