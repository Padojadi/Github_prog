"use client";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import LoadingComponent from "@/components/loadingComponent";
import { CreateForm } from "@/features/conferences/components/conference-creation/create-form";
import { useGetConference } from "@/features/conferences/hooks/use-get-conferences";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BsChevronLeft } from "react-icons/bs";
import { ConferenceEditForm } from "@/features/conferences/components/conference-edition/conference-edit-form";
import { TGetConferencesByIdResponse } from "../../types/responses-types";

export default function EditConferenceSection({ id }: { id: string }) {
  const { data, isLoading, error, refetch } = useGetConference(id);
  const router = useRouter();
  return (
    <div className="container max-w-5xl py-10">
      <Button variant="primary" className="mb-4" onClick={() => router.back()}>
        <BsChevronLeft size={20} className="mr-2" />
        Retour
      </Button>
      <Card className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center tracking-tight mb-2">
            Modification de la demande de conference
          </h1>
          <p className="text-muted-foreground text-base text-center">
            Nous vous prions de renseigner les champs obligatoire (
            <span className="text-red-500">*</span>) sinon votre demande ne sera
            pas prise en compte. En cas de difficultés, veuillez SVP contacter
            le responsable des conférences{" "}
            <span className="font-semibold">Mr N&apos;diaye Diouf</span> au
            +221781326700
          </p>
        </div>

        <Suspense fallback={<LoadingComponent />}>
          {data && (
            <ConferenceEditForm
              submitButtonText="Modifier"
              initialData={data?.data}
            />
          )}
        </Suspense>
      </Card>
    </div>
  );
}
