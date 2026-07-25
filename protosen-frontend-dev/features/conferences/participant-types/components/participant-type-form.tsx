"use client";

import { useState } from "react";
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
import { createParticipantTypes, updateParticipantTypes } from "../lib/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ParticipantType } from "../types";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  label: z.string().min(1, "Le label est requis"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ParticipantTypeFormProps {
  initialData?: ParticipantType;
  onClose: () => void;
}

export function ParticipantTypeForm({
  initialData,
  onClose,
}: ParticipantTypeFormProps) {
  const queryQlient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          label: initialData?.label,
          description: initialData?.description || "",
        }
      : { label: "", description: "" },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: unknown) => {
      let response = initialData
        ? await updateParticipantTypes(
            initialData?.id,
            data,
            "Erreur de modification de type de participant",
            "Type de participant modifié avec succès"
          )
        : await createParticipantTypes(
            data,
            "Erreur de création de type de participant",
            "Type de participant créé avec succès"
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
        queryKey: ["participant-types"],
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
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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
