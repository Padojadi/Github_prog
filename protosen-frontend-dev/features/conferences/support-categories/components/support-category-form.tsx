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
import { createSupportCategories, updateSupportCategories } from "../lib/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SupportCategory } from "../types";
import { toast } from "sonner";

const formSchema = z.object({
  label: z.string().min(1, "Le libellé est requis"),
});

type FormValues = z.infer<typeof formSchema>;

interface SupportCategoryFormProps {
  initialData?: SupportCategory;
  onClose: () => void;
}

export function SupportCategoryForm({
  initialData,
  onClose,
}: SupportCategoryFormProps) {
  const queryQlient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          label: initialData?.label,
        }
      : { label: "" },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: unknown) => {
      let response = initialData
        ? await updateSupportCategories(
            initialData?.id,
            data,
            "Erreur de modification de catégorie de prise en charge",
            "Catégorie de prise en charge modifiée avec succès"
          )
        : await createSupportCategories(
            data,
            "Erreur de création de catégorie de prise en charge",
            "Catégorie de prise en charge créée avec succès"
          );
      if ("code" in response) {
        throw new Error(
          response.message || "Une erreur inconnue s'est produite"
        );
      }
      return response;
    },
    onSuccess: ({ message }) => {
      queryQlient.invalidateQueries({
        queryKey: ["support-categories"],
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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Libellé</FormLabel>
              <FormControl>
                <Input placeholder="ex: hébergement" {...field} />
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
