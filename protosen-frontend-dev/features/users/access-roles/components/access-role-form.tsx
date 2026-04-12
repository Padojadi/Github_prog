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
  FormDescription,
} from "@/components/ui/form";
import { Info, Loader, Loader2, Trash } from "lucide-react";
import { BsFloppy } from "react-icons/bs";
import { createAccessRole, updateAccessRole } from "../lib/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccessRole } from "../types";
import { Textarea } from "@/components/ui/textarea";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { permissions } from "../lib/data";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  permissions: z
    .array(z.string().min(1, "Veuillez sélectionner au moins une permission"))
    .min(1, "Veuillez sélectionner au moins une permission"),
});

type FormValues = z.infer<typeof formSchema>;

interface AccessRoleFormProps {
  initialData?: AccessRole;
  onClose: () => void;
}

const conferencesPermissionList = [
  "REQUEST_CONFERENCE",
  "VALIDATE_CONFERENCE_REQUEST",
  "CONFIRM_CONFERENCE_REQUEST",
  "ACCEPT_CONFERENCE_REQUEST",
  "MANAGE_CONFERENCES",
];

export function AccessRoleForm({ initialData, onClose }: AccessRoleFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData?.name,
          permissions: initialData?.permissions,
        }
      : { name: "", permissions: [] },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const response = initialData
        ? await updateAccessRole(
            initialData?.id,
            data,
            "Erreur de modification du groupe d'accès",
            "Groupes d'accès modifié avec succès"
          )
        : await createAccessRole(
            data,
            "Erreur de création du groupe d'accès",
            "Groupes d'accès créé avec succès"
          );
      if (response.status === "error") {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: ["access-roles"],
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
    };
    submitMutation.mutate(newData);
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
        <div className="space-y-2">
          <FormLabel>Permissions</FormLabel>
          {form.formState.errors.permissions && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.permissions?.message}
            </p>
          )}
          <div className="space-y-4">
            {permissions.map((permission) => (
              <FormField
                key={permission.value}
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {permission.label}
                        </FormLabel>
                        <FormDescription>
                          {permission.description.join(", ")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value.includes(permission.value)}
                          onCheckedChange={(value) => {
                            if (
                              field.value.includes(permission.value) &&
                              !value
                            ) {
                              let newValue = field.value.filter(
                                (item) => item !== permission.value
                              );
                              if (
                                permission.value === "ACCESS_CONFERENCE_MODULE"
                              ) {
                                newValue = newValue.filter(
                                  (item) =>
                                    !conferencesPermissionList.includes(item)
                                );
                              }
                              field.onChange(newValue);
                            } else {
                              if (
                                conferencesPermissionList.includes(
                                  permission.value
                                ) &&
                                !field.value.includes(
                                  "ACCESS_CONFERENCE_MODULE"
                                )
                              ) {
                                field.onChange([
                                  ...field.value,
                                  permission.value,
                                  "ACCESS_CONFERENCE_MODULE",
                                ]);
                                return;
                              }
                              field.onChange([
                                ...field.value,
                                permission.value,
                              ]);
                            }
                          }}
                        />
                      </FormControl>
                    </div>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full "
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
