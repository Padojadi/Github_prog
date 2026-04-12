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
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { BsFloppy } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ALargeSmall, Banknote, Loader2 } from "lucide-react";
import { ConferencePass } from "../../types";
import { createTicket, updateTicket } from "../../lib/ticket-apis";
import NumberInput from "@/components/ui/number-input";
import { TicketTemplate1 } from "./ticket-template-1";
import { TicketTemplate2 } from "./ticket-template-2";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ticketsTypes } from "../../lib/data";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom du ticket est requis")
    .max(20, "Le nom du ticket ne doit pas dépasser 20 caractères"),
  description: z
    .string()
    .min(1, "La description du ticket est requise")
    .max(100, "La description du ticket ne doit pas dépasser 100 caractères"),
  colorTheme: z.string().min(1, "Le type du ticket est requis"),
  price: z
    .number()
    .refine((value) => value === 0 || value > 250 || value >= 1, {
      message:
        "Le prix du ticket est requis et doit être supérieur à 250 ou égal à 0 si le ticket doit être gratuit.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface TicketFormProps {
  conferenceId: string;
  date: string;
  initialData?: ConferencePass;
  onClose: () => void;
}

export function TicketForm({
  conferenceId,
  date,
  initialData,
  onClose,
}: TicketFormProps) {
  const queryQlient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData?.name,
          description: initialData.description,
          colorTheme: initialData.colorTheme,
          price: initialData.price,
        }
      : {
          name: "",
          description: "",
          colorTheme: "",
          price: 0,
        },
  });

  const currentValues = form.watch();

  const submitMutation = useMutation({
    mutationFn: async (data: unknown) => {
      let response = initialData
        ? await updateTicket(
            initialData?.id,
            data,
            "Erreur de modification du ticket",
            "Ticket modifié avec succès"
          )
        : await createTicket(
            data,
            "Erreur de création du ticket",
            "Ticket créé avec succès"
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
        queryKey: ["tickets", conferenceId],
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
    let newData = initialData ? data : { ...data, conferenceId: conferenceId };
    submitMutation.mutate(newData);
  };

  return (
    <>
      {currentValues.colorTheme === "type-1" ? (
        <TicketTemplate1
          id="1"
          name={currentValues.name}
          conferenceId={conferenceId}
          description={currentValues.description}
          date={date}
          price={Number(currentValues.price.toFixed(2))}
          username="John Doe"
          zoom={true}
        />
      ) : currentValues.colorTheme === "type-2" ? (
        <TicketTemplate2
          id="1"
          name={currentValues.name}
          conferenceId={conferenceId}
          description={currentValues.description}
          date={date}
          price={Number(currentValues.price.toFixed(2))}
          username="John Doe"
          zoom={true}
        />
      ) : null}
      <FormShad {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="colorTheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Modèle du ticket <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un modèle..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketsTypes.map((item) => (
                        <SelectItem value={item.value}>{item.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nom du ticket <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Entrer le nom..."
                      className="peer pe-9 ps-9"
                      {...field}
                    />
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <ALargeSmall size={16} strokeWidth={2} />
                    </div>
                  </div>
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
                <FormLabel>
                  Description du ticket{" "}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Entrer une description..."
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Veuillez entrer les avantages en écrivant l'avantage avec une
                  virgule en fin de ligne et allez à la ligne. Exemple:
                  (Avantage1, Avantage2, etc..)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Prix du ticket <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative flex rounded-lg shadow-sm">
                    <NumberInput
                      placeholder="Entrez un prix..."
                      decimalSeparator="."
                      thousandSeparator=","
                      allowNegative={false}
                      className="peer pe-9 ps-9 -me-px rounded-e-none shadow-none"
                      {...field}
                    />
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <Banknote size={16} strokeWidth={2} />
                    </div>
                    <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-lg border px-3 text-sm">
                      FCFA
                    </span>
                  </div>
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
    </>
  );
}
