"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { isEmpty } from "@/components/utils/utilsClient";
import { toast } from "react-toastify";
import { createNewUser, updateUser } from "@/lib/actions/users";
import SelectOrganism from "./selectOrganism";
import SubmitButton from "@/components/submitButton";
import { PasswordInput } from "@/components/ui/password-input";
import { useQuery } from "@tanstack/react-query";
import { getAccessRoles } from "@/features/users/access-roles/lib/apis";
import { AccessRole, TPermission } from "@/features/users/access-roles/types";
import { useState } from "react";
import { translatePermission } from "@/features/users/access-roles/lib/utils";

interface UserFormProps {
  initialValues?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    organismId: string;
    accessGroupId: string;
  };
}

export default function UserForm({ initialValues }: UserFormProps) {
  const router = useRouter();
  const [accessRoleSelected, setAccessRoleSelected] = useState<
    AccessRole | undefined
  >();

  const { data, error } = useQuery({
    queryKey: ["access-groups"],
    queryFn: async () => {
      const response = await getAccessRoles();
      if (response.status === "error") {
        toast.error(response.message);
      }
      return response;
    },
  });

  async function formAction(formData: FormData) {
    let { message, errors, status } = initialValues
      ? await updateUser(formData)
      : await createNewUser(formData);

    if (message) {
      if (status === "success") {
        toast.success(message);
        router.push("/panel/users");
      } else if (status === "error") {
        toast.error(message);
      } else {
        toast(message);
      }
    }
    if (errors && !isEmpty(errors)) {
      toast.error(JSON.stringify(errors));
    }
  }

  return (
    <div className="mx-auto max-w-[700px] bg-white dark:bg-slate-800 p-10 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {initialValues ? "Editer un utilisateur" : "Créer un utilisateur"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Entrez les informations de l'utilisateur pour{" "}
          {initialValues ? "modifier" : "créer"} un compte
        </p>
      </div>
      <form action={formAction}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">Prénom</Label>
              <Input
                id="first-name"
                name="first_name"
                placeholder="Entrez un prénom"
                required
                defaultValue={initialValues?.first_name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Nom</Label>
              <Input
                id="last-name"
                name="last_name"
                placeholder="Entrez un nom"
                required
                defaultValue={initialValues?.last_name}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Entrez un email"
                required
                type="email"
                name="email"
                defaultValue={initialValues?.email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                placeholder="Entrez un numéro de téléphone"
                required
                type="phone"
                name="phone"
                defaultValue={initialValues?.phone}
              />
            </div>
          </div>
          {initialValues && (
            <Input type="hidden" name="userId" value={initialValues.id} />
          )}
          {data && data.data && (
            <Input type="hidden" name="accessGroupId" value={data.data[0].id} />
          )}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" required defaultValue={initialValues?.role}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <SelectOrganism
              name="organismId"
              initialOrganismId={initialValues?.organismId}
            />
          </div>
          {!initialValues && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <PasswordInput id="password" name="password" required={true} />
                {/* <Input
                  type="password"
                  id="password"
                  name="password"
                  required={true}
                /> */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-confirmation">
                  Confirmez le mot de passe
                </Label>
                <PasswordInput
                  id="password-confirmation"
                  name="passwordConfirmation"
                  required={true}
                />
                {/* <Input
                  type="password"
                  id="password-confirmation"
                  name="passwordConfirmation"
                  required={true}
                /> */}
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="accessGroupId">Groupe d'accès</Label>
            <Select
              name="accessGroupId"
              onValueChange={(value) => {
                setAccessRoleSelected(
                  data?.data.find((item: AccessRole) => item.id === value)
                );
              }}
              required
              defaultValue={initialValues?.accessGroupId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un groupe d'accès" />
              </SelectTrigger>
              <SelectContent position="popper">
                {data?.data.map((item: AccessRole) => (
                  <SelectItem value={item.id}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {accessRoleSelected && (
            <div>
              <h3 className="text-xl font-semibold">
                Permissions du groupe d'accès
              </h3>
              <ul className="list-disc pl-5">
                {accessRoleSelected.permissions.map((item) => (
                  <li className="text-muted-foreground">
                    {translatePermission(item)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-center">
            <SubmitButton
              label={
                initialValues
                  ? "Enregistrer les modifications"
                  : "Création de l'utilisateur"
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
}
