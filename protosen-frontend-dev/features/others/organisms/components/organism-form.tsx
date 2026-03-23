"use client";

import { useFieldArray, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { BsFloppy } from "react-icons/bs";
import { Organism } from "../types";
import { ComboboxCreatable } from "./combox-creatable";
import { institutionTypes } from "../lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganism, updateOrganism } from "../lib/apis";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  libelle: z.string().min(1, "Le nom est requis"),
  code: z.string().min(1, "Le code est requis"),
  institutionType: z.string().min(1, "Le type d'institution est requis"),
  service: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface OrganismFormProps {
  initialData?: Organism;
  onClose: () => void;
}

export function OrganismForm({ initialData, onClose }: OrganismFormProps) {
  const queryQlient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          libelle: initialData?.libelle,
          code: initialData.code,
          institutionType: initialData.institutionType,
          service: initialData.service,
        }
      : {
          libelle: "",
          code: "",
          institutionType: "",
          service: "",
        },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      let response = initialData
        ? await updateOrganism(
            initialData?.id,
            data,
            "Erreur de modification d'institution",
            "Institution modifiée avec succès"
          )
        : await createOrganism(
            data,
            "Erreur de création d'institution",
            "Institution créée avec succès"
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
        queryKey: ["organisms"],
      });
      toast.success(message || "Succès");
      form.reset();
      onClose();
    },
    onError: ({ message }) => {
      toast.error(message || "Une erreur est survenue");
    },
  });

  const handleSubmit = (data: FormValues) => {
    submitMutation.mutate(data);
  };

  return (
    <FormShad {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="libelle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Libellé</FormLabel>
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
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="institutionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d'institution</FormLabel>
              <FormControl>
                <ComboboxCreatable options={institutionTypes} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
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
