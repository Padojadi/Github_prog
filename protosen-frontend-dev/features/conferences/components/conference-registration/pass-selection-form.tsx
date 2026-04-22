"use client";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RegistrationForm } from "../../types/registration-schema";
import { useParams } from "next/navigation";
import { useGetConferenceTickets } from "../../hooks/use-get-tickets";
import PassCard from "./pass-card";
import { ConferencePublic } from "../../types";

type PassSelectionFormProps = {
  date: string;
  conference: ConferencePublic;
};

const PassSelectionForm = ({ conference }: PassSelectionFormProps) => {
  const form = useFormContext<RegistrationForm>();

  return (
    <div className="space-y-8 animate-fade-in">
      <h3 className="text-xl font-medium text-foreground border-b border-border pb-2">
        Sélection du Pass et Finalisation
      </h3>

      <div>
        <FormLabel className="text-lg mb-4 block">
          Choisissez votre Pass <span className="text-red-500">*</span>
        </FormLabel>

        <div className="grid md:grid-cols-2 gap-4 place-content-center">
          {conference &&
            conference.tickets.map((ticket) => (
              <div key={ticket.id} className="relative">
                <FormField
                  control={form.control}
                  name="ticketId"
                  render={({ field }) => (
                    <FormItem className="h-full">
                      <FormControl>
                        <div className="absolute inset-0 opacity-0">
                          <input
                            type="radio"
                            id={ticket.id}
                            value={ticket.id}
                            checked={field.value === ticket.id}
                            onChange={() => field.onChange(ticket.id)}
                            className="sr-only"
                          />
                        </div>
                      </FormControl>
                      <label
                        htmlFor={ticket.id}
                        className={`block cursor-pointer h-full rounded-lg p-2`}
                      >
                        <PassCard
                          name={ticket.name}
                          price={ticket.price}
                          // conferenceId={params.id}
                          // date={date}
                          features={ticket.description.split(",")}
                          key={ticket.id}
                          isSelected={field.value === ticket.id}
                        />
                      </label>
                    </FormItem>
                  )}
                />
              </div>
            ))}
        </div>
        {form.formState.errors.ticketId && (
          <p className="mt-2 text-center text-sm font-medium text-destructive">
            {form.formState.errors.ticketId.message as string}
          </p>
        )}
      </div>

      <div className="space-y-4 bg-slate-50 dark:bg-slate-950  p-6 rounded-lg">
        <h4 className="text-lg font-medium text-foreground">
          Termes et Conditions
        </h4>

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal text-sm">
                J'accepte les{" "}
                <a
                  href="#"
                  className="text-blue-600 underline hover:text-blue-600/80"
                  onClick={(e) => e.preventDefault()}
                >
                  termes et conditions
                </a>{" "}
                de la conférence. <span className="text-red-500">*</span>
              </FormLabel>
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="gdprAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal text-sm">
                J'accepte que mes données personnelles soient traitées
                conformément à la{" "}
                <a
                  href="#"
                  className="text-blue-600 underline hover:text-blue-600/80"
                  onClick={(e) => e.preventDefault()}
                >
                  politique de confidentialité
                </a>
                . <span className="text-red-500">*</span>
              </FormLabel>
            </FormItem>
          )}
        /> */}
      </div>
    </div>
  );
};

export default PassSelectionForm;
