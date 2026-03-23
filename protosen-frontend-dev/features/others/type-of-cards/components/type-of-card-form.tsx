"use client";

import { useState } from "react";
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
import { Info, Loader, Loader2, Trash } from "lucide-react";
import { BsFloppy } from "react-icons/bs";
import { createCardTypes, updateCardTypes } from "../lib/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CardType } from "../types";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  observation: z
    .array(
      z.object({
        value: z.string().min(1, "L'observation est requise"),
      })
    )
    .optional(),
  description: z.string().optional(),
  color: z.string().min(1, "La couleur est requise"),
});

type FormValues = z.infer<typeof formSchema>;

interface CardTypeFormProps {
  initialData?: CardType;
  onClose: () => void;
}

export function CardTypeForm({ initialData, onClose }: CardTypeFormProps) {
  const queryQlient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData?.name,
          observation: initialData?.observation.map((item) => {
            return { value: item };
          }),
          description: initialData?.description || "",
          color: initialData?.color || "",
        }
      : { name: "", description: "", observation: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "observation",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: unknown) => {
      let response = initialData
        ? await updateCardTypes(
            initialData?.id,
            data,
            "Erreur de modification de type de carte",
            "Type de carte modifié avec succès"
          )
        : await createCardTypes(
            data,
            "Erreur de création de type de carte",
            "Type de carte créé avec succès"
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
        queryKey: ["card-types"],
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
    const newData = {
      ...data,
      observation: data?.observation?.map((item) => item.value),
    };
    submitMutation.mutate(newData);
  };

  const addObservation = () => {
    append({ value: "" });
  };

  const removeObservation = (index: number) => {
    remove(index);
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

        {fields.map((fieldItem, index) => (
          <FormField
            key={fieldItem.id}
            control={form.control}
            name={`observation.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{index === 0 ? "Observations" : ""}</FormLabel>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => removeObservation(index)}
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          type="button"
          className="flex"
          variant="outline"
          onClick={addObservation}
        >
          Ajouter une observation
        </Button>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-flex items-center">
                Description{" "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 ml-2" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Ce texte sera affiché au dos de la carte</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-flex items-center">
                Couleur
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 ml-2" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>La couleur de la carte</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input type="color" {...field} />
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
