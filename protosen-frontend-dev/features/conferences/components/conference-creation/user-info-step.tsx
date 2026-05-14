"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { TCreateConferenceSchema } from "../../types/schema";
import { useGetOrganism } from "@/features/others/organisms/hooks/use-get-organisms";
import { ComboboxCreatableSingle } from "@/components/ui/combox-creatable-single";
import { useMemo } from "react";

export function UserInfoStep() {
  const { control } = useFormContext<TCreateConferenceSchema>();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name="firstName"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className={error && "text-destructive"}>
                Prénom <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="John"
                  className={error && "border-destructive"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="lastName"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className={error && "text-destructive"}>
                Nom <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Doe"
                  className={error && "border-destructive"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* <FormField
          control={control}
          name="structure"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className={error && "text-destructive"}>
                Structure <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <ComboboxCreatableSingle
                  placeholder="Organisation/Département"
                  hidePlaceholderWhenSelected
                  error={!!error}
                  loading={isLoading}
                  options={institutions}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={control}
          name="job"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className={error && "text-destructive"}>
                Fonction <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Manager"
                  className={error && "border-destructive"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className={error && "text-destructive"}>
                Téléphone <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="+221728922902"
                  className={error && "border-destructive"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className={error && "text-destructive"}>
                Email <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="john.doe@example.com"
                  className={error && "border-destructive"}
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="matriculeNumber"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className={error && "text-destructive"}>
                Matricule <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Entrez votre matricule"
                  className={error && "border-destructive"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
