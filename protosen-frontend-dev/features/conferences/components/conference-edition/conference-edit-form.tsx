import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Conference } from "../../types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  createConferenceSchema,
  TCreateConferenceSchema,
} from "../../types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFile } from "@/lib/actions/uploads";
import { updateConference } from "../../lib/apis";
import { toast } from "react-toastify";
import { FormShad as ShadCnForm } from "@/components/ui/form";
import { FormErrorSummary } from "../conference-creation/form-error-summary";
import { UserInfoStep } from "../conference-creation/user-info-step";
import { ConferenceInfoStep } from "../conference-creation/conference-info-step";
import { ConferenceDescriptionStep } from "../conference-creation/conference-description-step";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

type FormProps = {
  title?: string;
  submitButtonText?: string;
  initialData: Conference;
};

export function ConferenceEditForm({
  title,
  submitButtonText,
  initialData,
}: FormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<TCreateConferenceSchema>({
    mode: "all",
    defaultValues: {
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
    },
    resolver: zodResolver(createConferenceSchema),
  });

  const editMutation = useMutation({
    mutationFn: async (data: TCreateConferenceSchema) => {
      let themeUrl: string | null = null;
      let budgetUrl: string | null = null;

      let themePromise: Promise<string> | null = null;
      let budgetPromise: Promise<string> | null = null;

      if (data.themeDoc && data.themeDoc instanceof File) {
        themePromise = uploadFile(
          data.themeDoc,
          data.themeDoc!.name,
          data.themeDoc!.type
        );
      }

      if (data.budgetDoc && data.budgetDoc instanceof File) {
        budgetPromise = uploadFile(
          data.budgetDoc,
          data.budgetDoc!.name,
          data.budgetDoc!.type
        );
      }

      if (themePromise) {
        themeUrl = await themePromise;
      }

      if (budgetPromise) {
        budgetUrl = await budgetPromise;
      }

      let newData = {
        firstName: data.firstName,
        lastName: data.lastName,
        job: data.job,
        email: data.email,
        themeDoc: themeUrl ? themeUrl : initialData?.themeDoc,
        budgetDoc: budgetUrl ? budgetUrl : initialData?.budgetDoc,
        startDate: data.startDate,
        endDate: data.endDate,
        matriculeNumber: data.matriculeNumber,
        phone: data.phone,
        title: data.title,
        location: data.location,
        description: JSON.stringify(data.description),
      };

      const editResponse = await updateConference(
        initialData?.id,
        newData,
        "Erreur de modification de demande de conférence",
        "Modification de demande de conférence éffectuée avec succès"
      );

      if ("code" in editResponse) {
        console.error(editResponse.code, editResponse.message);
        throw new Error(
          editResponse.message ||
            "Échec de mise à jour de la demande conférence"
        );
      }

      return editResponse;
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

  const onEdit = async (data: TCreateConferenceSchema) => {
    console.log(data);
    editMutation.mutate(data);
  };
  return (
    <ShadCnForm {...form}>
      <form
        className="flex flex-col gap-4 w-full pt-10"
        onSubmit={form.handleSubmit(onEdit)}
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
        <div className="space-y-6">
          <UserInfoStep />

          <ConferenceInfoStep initialData={initialData} />

          <ConferenceDescriptionStep initialData={initialData} />
        </div>

        <div className="w-full flex justify-center md:justify-end gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={editMutation.isPending}
          >
            {submitButtonText ?? "Modifier"}
            {editMutation.isPending ? (
              <Loader2 className="size-4 ml-2 animate-spin" />
            ) : (
              <Save className="size-4 ml-2" />
            )}
          </Button>
        </div>
      </form>
    </ShadCnForm>
  );
}
