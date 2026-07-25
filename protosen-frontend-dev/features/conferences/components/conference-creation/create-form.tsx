"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { date, ZodSchema } from "zod";
import { FormShad as ShadCnForm } from "@/components/ui/form";

import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Loader2,
  RotateCcw,
  Save,
} from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  createConferenceDefaultValues,
  createConferenceSchema,
  TCreateConferenceSchema,
} from "../../types/schema";
import { FormErrorSummary } from "./form-error-summary";
import { useState } from "react";
import { StepIndicator } from "./stepper";
import { UserInfoStep } from "./user-info-step";
import { ConferenceInfoStep } from "./conference-info-step";
import { uploadFile } from "@/lib/actions/uploads";
import { requestConference } from "../../lib/apis";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Conference } from "../../types";
import { ConferenceDescriptionStep } from "./conference-description-step";
import { toast } from "sonner";

type FormProps = {
  title?: string;
  showResetButton?: boolean;
  submitButtonText?: string;
  initialData?: Conference;
};

const steps = [
  {
    id: 1,
    label: "Informations sur le demandeur",
  },
  {
    id: 2,
    label: "Informations sur la conférence",
  },
  {
    id: 3,
    label: "Description de la conference",
  },
];

const CreateForm = ({
  title,
  showResetButton = true,
  submitButtonText,
  initialData,
}: FormProps) => {
  const [step, setStep] = useState(1);
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<TCreateConferenceSchema>({
    mode: "all",
    defaultValues: initialData
      ? {
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email,
          phone: initialData.phone,
          job: initialData.job,
          startDate: new Date(initialData.startDate),
          endDate: new Date(initialData.endDate),
          location: initialData.location,
          matriculeNumber: initialData.matriculeNumber,
          description: initialData.description,
          title: initialData.title,
          themeDoc: null,
          budgetDoc: null,
        }
      : createConferenceDefaultValues,
    resolver: zodResolver(createConferenceSchema),
  });

  const submitMutation = useMutation({
    mutationFn: async (data: TCreateConferenceSchema) => {
      let newData = {
        firstName: data.firstName,
        lastName: data.lastName,
        job: data.job,
        email: data.email,
        themeDoc: "",
        budgetDoc: "",
        startDate: data.startDate,
        endDate: data.endDate,
        matriculeNumber: data.matriculeNumber,
        phone: data.phone,
        title: data.title,
        location: data.location,
        description: data.description,
      };

      if (data.themeDoc instanceof File && data.budgetDoc instanceof File) {
        const [themeDocUrl, budgetDocUrl] = await Promise.allSettled([
          uploadFile(data.themeDoc, data.themeDoc!.name, data.themeDoc!.type),
          uploadFile(
            data.budgetDoc,
            data.budgetDoc!.name,
            data.budgetDoc!.type
          ),
        ]);

        if (themeDocUrl.status === "rejected") {
          // toast.error("Erreur d'upload du theme");
          throw new Error("Erreur d'upload du theme");
        }

        if (budgetDocUrl.status === "rejected") {
          throw new Error("Erreur d'upload du budget");
        }

        newData = {
          ...newData,
          themeDoc: themeDocUrl.value,
          budgetDoc: budgetDocUrl.value,
          description: JSON.stringify(newData.description),
        };
      }

      const createResponse = await requestConference(
        newData,
        "Erreur de demande de conférence",
        "Demande de conférence éffectuée avec succès"
      );

      if ("code" in createResponse) {
        console.error(createResponse.code, createResponse.message);
        throw new Error(
          createResponse.message || "Échec de création de la demande conférence"
        );
      }

      return createResponse;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["conferences"],
      });
      toast.success(response?.message || "Succès");
      form.reset();
      router.push("/panel/conferences/new-requests");
    },
    onError: ({ message }) => {
      toast.error(message || "Une erreur est survenue");
    },
  });

  const onSubmit = async (data: TCreateConferenceSchema) => {
    console.log(data);
    if (data.themeDoc === null || data.budgetDoc === null) {
      toast.error("Veuillez ajouter les fichiers");
      return;
    }
    submitMutation.mutate(data);
  };

  const nextStep = async (e: any) => {
    e.preventDefault();
    const isValid = await form.trigger(
      step === 1
        ? ["firstName", "lastName", "job", "phone", "email", "matriculeNumber"]
        : ["title", "startDate", "endDate", "location", "description"]
    );
    if (isValid) setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  return (
    <>
      <StepIndicator steps={steps} currentStep={step} />
      <ShadCnForm {...form}>
        <form
          className="flex flex-col gap-4 w-full pt-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {title && (
            <div className="flex items-center space-x-2">
              <h6 className="text-xl font-semibold">{title}</h6>
              {/* {showResetButton && (
              <Button
                variant="outline"
                onClick={handleResetFormClick}
                size="icon"
              >
                <RotateCcw className="size-4" />
              </Button>
            )} */}
            </div>
          )}

          <div className="w-full">
            <FormErrorSummary />
          </div>
          <div>
            {step === 1 && <UserInfoStep />}

            {step === 2 && <ConferenceInfoStep initialData={initialData} />}

            {step === 3 && (
              <ConferenceDescriptionStep initialData={initialData} />
            )}
          </div>

          <div className="w-full flex justify-center md:justify-between gap-4">
            {step !== 1 && (
              <Button type="button" variant="outline" onClick={previousStep}>
                <ArrowLeftCircle className="size-4 mr-2" />
                Précédent
              </Button>
            )}
            {step !== 3 ? (
              <Button
                type="button"
                variant="primary"
                className="ml-auto justify-self-end"
                onClick={(e) => nextStep(e)}
              >
                Suivant
                <ArrowRightCircle className="size-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={submitMutation.isPending}
              >
                {submitButtonText ?? "Soumettre"}
                {submitMutation.isPending ? (
                  <Loader2 className="size-4 ml-2 animate-spin" />
                ) : (
                  <Save className="size-4 ml-2" />
                )}
              </Button>
            )}
          </div>
        </form>
      </ShadCnForm>
    </>
  );
};

export { CreateForm };
