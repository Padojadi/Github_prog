"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RegistrationForm } from "../../types/registration-schema";
import { useParams } from "next/navigation";
import { useGetConferenceAccommodations } from "../../hooks/use-get-accommodations";
import { Skeleton } from "@/components/ui/skeleton";
import HotelCard from "../conference-details/accommodation-card";
import { ConferencePublic } from "../../types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type SessionOption = {
  id: string;
  label: string;
};

type ConferenceParticipationFormProps = {
  conference: ConferencePublic;
};

const ConferenceParticipationForm = ({
  conference,
}: ConferenceParticipationFormProps) => {
  const form = useFormContext<RegistrationForm>();

  function onAddCustomAccomodation() {
    form.setValue("addCustomAccomodation", "oui");
  }

  function onChooseAccomodation() {
    form.setValue("addCustomAccomodation", "non");
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-lg font-medium text-foreground/80 border-b border-border pb-2">
        Participation à la Conférence
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="visaNeeded"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                Demande de Visas <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="oui" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Oui
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="non" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Non
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accommodationNeeded"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                Auriez vous besoin d'un Logement?{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="oui" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Oui
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="non" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Non
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Conditional sections based on user selections */}
      {form.watch("visaNeeded") === "oui" && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800/20">
          <h4 className="text-base font-medium text-blue-800 dark:text-blue-200 mb-2">
            Information sur la demande de visa
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Vous recevrez un email avec les informations nécessaires pour votre
            demande de visa dans les 48 heures.
          </p>
        </div>
      )}

      {form.watch("accommodationNeeded") === "oui" && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800/20">
          <h4 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
            Options d'hébergement
          </h4>
          <div>
            <FormLabel className="text-base text-green-800 dark:text-green-200 mb-4 block">
              Choisissez votre hébergement{" "}
              <span className="text-red-500">*</span>
            </FormLabel>

            <div className="grid lg:grid-cols-2 gap-8 py-3 h-full">
              {conference.conferenceAccommodations.map((accommodation) => (
                <div key={accommodation.id} className="relative isolate h-full">
                  <FormField
                    control={form.control}
                    name="conferenceAccommodationId"
                    render={({ field }) => (
                      <FormItem className="space-y-3 h-full">
                        <FormControl>
                          <input
                            type="hidden"
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => field.onChange(field.value === accommodation.id ? undefined : accommodation.id)}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") field.onChange(field.value === accommodation.id ? undefined : accommodation.id); }}
                          className="block cursor-pointer h-[90%]"
                        >
                          <HotelCard
                            key={accommodation.id}
                            accommodation={accommodation.accommodation}
                            canSelectAccommodation={false}
                            isSelected={
                              form.watch("conferenceAccommodationId") ===
                              accommodation.id
                            }
                            // onSelect={async (id) => {
                            //   field.onChange(id);
                            // }}
                            // disabled={false}
                            // onRemove={async (id) => {
                            //   field.onChange(id);
                            // }}
                          />
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium text-center text-green-800 dark:text-green-200 mb-2">
                Les options d'hébergement proposés ne vous conviennent pas ?
                <br />
                Ajouter les détails de l'hébergement (ex: téléphone, adresse,
                lien google maps...) en cliant sur le bouton ci-dessous
              </p>
              <div className="flex items-center justify-center w-full">
                {form.watch("addCustomAccomodation") === "oui" ? (
                  <Button type="button" onClick={onChooseAccomodation}>
                    Choisir parmis les options
                  </Button>
                ) : (
                  <Button type="button" onClick={onAddCustomAccomodation}>
                    Ajouter les détails
                  </Button>
                )}
              </div>

              {form.watch("addCustomAccomodation") === "oui" && (
                <FormField
                  control={form.control}
                  name="customAccommodation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Précisez les détails de l'hébergement{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ajouter les détails de l'hébergement (ex: téléphone, adresse, lien google maps...)"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* {form.watch("transportationNeeded") === "oui" && (
        <div className="p-4 bg-amber-50 rounded-md border border-amber-200">
          <h4 className="text-md font-medium text-amber-800 mb-2">
            Options de transport
          </h4>
          <p className="text-sm text-amber-700 mb-2">
            Notre équipe vous contactera pour organiser votre transport pendant
            la conférence.
          </p>
        </div>
      )} */}
    </div>
  );
};

export default ConferenceParticipationForm;
