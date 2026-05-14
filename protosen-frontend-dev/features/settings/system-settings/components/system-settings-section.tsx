"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { SystemSettingsForm } from "./system-settings-form";
import { useQuery } from "@tanstack/react-query";
import { getSystemSettings } from "../lib/apis";
import ErrorComponent from "@/components/error";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Pencil } from "lucide-react";

export default function SystemSettingsSection() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      let response = await getSystemSettings();
      if (response.status === "error") {
        throw new Error(
          response.message || "Une erreur inconnue s'est produite"
        );
      }
      return response;
    },
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const currentUser = useCurrentUser();

  const systemSettings = data?.data;

  if (isLoading) {
    return (
      <div className="p-4 mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mx-auto">
        <ErrorComponent error={error} retry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto max-w-4xl">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Paramètres système</h1>
          {currentUser.isSuperAdmin && (
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <Pencil className="size-4 mr-2" />
              Modifier
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {systemSettings?.ministryName && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Nom du ministère
              </h3>
              <p className="text-lg font-semibold text-foreground">
                {systemSettings.ministryName}
              </p>
            </div>
          )}

          {systemSettings?.protocolDirectionName && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Nom de la direction du protocole
              </h3>
              <p className="text-lg font-semibold text-foreground">
                {systemSettings.protocolDirectionName}
              </p>
            </div>
          )}

          {systemSettings?.directorSignature && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Signature du directeur
              </h3>
              <div className="mt-2">
                <img
                  src={systemSettings.directorSignature}
                  alt="Signature du directeur"
                  className="max-w-full max-h-64 rounded-md border"
                />
              </div>
            </div>
          )}

          {!systemSettings?.ministryName &&
            !systemSettings?.protocolDirectionName &&
            !systemSettings?.directorSignature && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun paramètre configuré pour le moment.</p>
                {currentUser.isSuperAdmin && (
                  <p className="text-sm mt-2">
                    Cliquez sur "Modifier" pour ajouter des paramètres.
                  </p>
                )}
              </div>
            )}
        </div>

        {systemSettings?.createdAt && (
          <div className="pt-4 border-t text-sm text-muted-foreground">
            <p>
              Créé le:{" "}
              {new Date(systemSettings.createdAt).toLocaleDateString("fr-FR")}
            </p>
            {systemSettings?.updatedAt && (
              <p>
                Modifié le:{" "}
                {new Date(systemSettings.updatedAt).toLocaleDateString(
                  "fr-FR"
                )}
              </p>
            )}
          </div>
        )}
      </div>

      <ResponsiveModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      >
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>
              Modifier les paramètres système
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          <SystemSettingsForm
            initialData={systemSettings}
            onClose={() => setIsEditModalOpen(false)}
          />
        </ResponsiveModalContent>
      </ResponsiveModal>
    </div>
  );
}

