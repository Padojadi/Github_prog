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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ALargeSmall, Link, Loader2, Mail, Map, Phone } from "lucide-react";
import { ConferenceHotel } from "../../types";
import {
  createAccommodation,
  updateAccommodation,
} from "../../lib/accomodations-apis";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Le nom de l'hôtel est requis"),
  email: z.string().email("Entrez un email valide"),
  phone: z
    .string()
    .min(10, "Le numéro de téléphone doit comporter au moins 10 caractères"),
  location: z.string().min(1, "L'adresse de l'hôtel est requise"),
  geolocation: z.string().optional(),
  reservationLink: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface HotelFormProps {
  initialData?: ConferenceHotel;
  onClose: () => void;
}

export function AccommodationForm({ initialData, onClose }: HotelFormProps) {
  const queryQlient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData?.name,
          email: initialData.email || "",
          phone: initialData.phone,
          location: initialData.location,
          geolocation: initialData.geolocation || "",
          reservationLink: initialData.reservationLink || undefined,
        }
      : {
          name: "",
          email: "",
          phone: "",
        },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const newObj = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      ) as Partial<typeof data>;

      let response = initialData
        ? await updateAccommodation(
            initialData?.id,
            newObj,
            "Erreur de modification de l'hébergement",
            "Hébergement modifié avec succès"
          )
        : await createAccommodation(
            newObj,
            "Erreur de création de l'hébergement",
            "Hébergement créé avec succès"
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
        queryKey: ["accommodations"],
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nom de l&apos;hôtel <span className="text-destructive">*</span>
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email de l&apos;hôtel{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Entrer l'email..."
                    className="peer pe-9 ps-9"
                    {...field}
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <Mail size={16} strokeWidth={2} />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Téléphone <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="Téléphone..."
                    className="peer pe-9 ps-9"
                    {...field}
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <Phone size={16} strokeWidth={2} />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Adresse <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="Entrer une l'adresse..."
                    className="peer pe-9 ps-9"
                    {...field}
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <Map size={16} strokeWidth={2} />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="geolocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Géolocation</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="url"
                    placeholder="Lien google maps..."
                    className="peer pe-9 ps-9"
                    {...field}
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <Link size={16} strokeWidth={2} />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reservationLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lien de réservation</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="url"
                    placeholder="Lien de réservation..."
                    className="peer pe-9 ps-9"
                    {...field}
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <Link size={16} strokeWidth={2} />
                  </div>
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
  );
}
