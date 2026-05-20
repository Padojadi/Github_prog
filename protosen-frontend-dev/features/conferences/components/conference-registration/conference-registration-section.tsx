"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormShad } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  RegistrationForm,
  registrationFormSchema,
} from "@/features/conferences/types/registration-schema";
import { toast } from "sonner";
import FormStepIndicator from "@/features/conferences/components/conference-registration/form-step-indicator";
import ConferenceParticipationForm from "@/features/conferences/components/conference-registration/conference-participation-form";
import FormNavigation from "@/features/conferences/components/conference-registration/form-navigation";
import PassSelectionForm from "@/features/conferences/components/conference-registration/pass-selection-form";
import PersonalInfoForm from "@/features/conferences/components/conference-registration/personal-info-form";
import { ConferencePublic } from "../../types";
import { formatDateFnsLocale } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerParticipant } from "../../lib/participants-apis";
import { uploadFile } from "@/lib/actions/uploads";

const steps = [
  {
    id: 1,
    label: "Informations Personnelles",
  },
  {
    id: 2,
    label: "Participation",
  },
  {
    id: 3,
    label: "Finalisation",
  },
] as const;

type ConferenceRegistrationProps = {
  conferenceId: string;
  conference: ConferencePublic;
};

export default function ConferenceRegistrationSection({
  conferenceId,
  conference,
}: ConferenceRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      gender: "MALE",
      identityType: "passport",
      visaNeeded: "non",
      accommodationNeeded: "non",
      needsSupport: "non",
      addCustomAccomodation: "non",
      // transportationNeeded: "non",
      // sessions: [],
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      if (!(data.avatarUrl instanceof File)) {
        throw new Error("Veuillez uploader une photo!");
      }
      const formData = new FormData();

      // const uploadResponse = await uploadFile(
      //   data.avatarUrl,
      //   data.avatarUrl.name,
      //   data.avatarUrl.type
      // );

      // if (typeof uploadResponse !== "string") {
      //   throw new Error("Une erreur inconnue est survenue pendant l'upload");
      // }

      Object.entries(data).forEach(([key, value]) => {
        if (key === "avatarUrl") {
          formData.append("avatar", value as File);
        } else if (key === "visaNeeded") {
          formData.append(key, value === "oui" ? "true" : "false");
        } else if (typeof value === "boolean") {
          formData.append(key, String(value));
        } else if (key === "functionId") {
          if (value === "autre") {
            return;
          } else {
            formData.append(key, value as string);
          }
        } else if (key === "supportOptionIds") {
          if (Array.isArray(value)) {
            value.forEach((id) => formData.append("supportOptionIds", id));
          }
        } else if (value === undefined) {
          return;
        } else {
          formData.append(key, value as string);
        }
      });

      formData.append("conferenceId", conferenceId);

      const registerResponse = await registerParticipant(
        // {
        //   ...data,
        //   visaNeeded: data.visaNeeded === "oui" ? true : false,
        //   conferenceId: conferenceId,
        //   avatarUrl: uploadResponse,
        // },
        formData,
        "Erreur lors de l'inscription",
        "Inscription complétée!"
      );

      if ("code" in registerResponse) {
        console.error(registerResponse.code, registerResponse.message);
        throw new Error(
          registerResponse.message || "Erreur lors de l'inscription"
        );
      }

      return registerResponse;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["conference-registrations"],
      });
      toast.success(response.message || "Inscription complétée!", {
        description: "Votre inscription a été envoyée avec succès.",
      });
      form.reset();
      router.push(`/conferences/${conferenceId}`);
    },
    onError: ({ message }) => {
      toast.error(message || "Une erreur est survenue");
    },
  });

  const onSubmit = (data: RegistrationForm) => {
    if (!(data.avatarUrl instanceof File)) {
      toast.error("Veuillez ajouter une photo!");
    }
    submitMutation.mutate(data);
  };

  // const saveAsDraft = () => {
  //   const currentValues = form.getValues();
  //   localStorage.setItem("registration_draft", JSON.stringify(currentValues));
  //   toast("Brouillon sauvegardé", {
  //     description: "Vous pourrez continuer votre inscription plus tard.",
  //   });
  // };

  const nextStep = async (e: any) => {
    e.preventDefault();
    const fieldsToValidate =
      currentStep === 1
        ? [
            "firstName",
            "lastName",
            "gender",
            "conferenceParticipantTypeId",
            "company",
            "functionId",
            "customFunction",
            "phone",
            "email",
            "address",
            "postalCode",
            "city",
            "country",
            "idType",
            "idNumber",
            "idIssueDate",
            "birthDate",
            "nationality",
            "avatarUrl",
            "needsSupport",
            "supportOptionIds",
          ]
        : currentStep === 2
        ? [
            "sessions",
            "visaRequired",
            "accommodationNeeded",
            "transportationNeeded",
            "conferenceAccommodationId",
            "customAccommodation",
          ]
        : ["passType", "termsAccepted", "gdprAccepted"];

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  return (
    <div className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-black">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg mb-8 border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-foreground">
              Inscription à la Conférence
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Veuillez remplir le formulaire pour vous inscrire
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress indicator */}
            <FormStepIndicator
              steps={steps}
              currentStep={currentStep}
              totalSteps={steps.length}
            />

            <FormShad {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <PersonalInfoForm conferenceId={conference.id} />
                )}

                {/* Step 2: Conference Participation */}
                {currentStep === 2 && (
                  <ConferenceParticipationForm conference={conference} />
                )}

                {/* Step 3: Pass Selection and Agreement */}
                {currentStep === 3 && (
                  <PassSelectionForm
                    date={formatDateFnsLocale(conference.startDate)}
                    conference={conference}
                  />
                )}

                {/* Navigation buttons */}
                <FormNavigation
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  onPrevious={prevStep}
                  onNext={nextStep}
                  isPending={submitMutation.isPending}
                  // onSaveAsDraft={saveAsDraft}
                />
              </form>
            </FormShad>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
