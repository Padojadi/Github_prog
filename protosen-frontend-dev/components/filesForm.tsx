"use client";

import React, { useState } from "react";
import SubmitButton from "@/components/submitButton";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import FileInput from "@/components/fileInput";
import { RelatedFiles } from "@/components/relatedFiles";
import { BsChevronDoubleRight } from "react-icons/bs";
import { LinkButton } from "./ui/linkButton";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function FilesForm({
  title,
  backLink,
  person,
  submitPersonDiplomaticCardFiles,
  updatePersonDiplomaticCardFiles,
  personFilesFormMeta,
  personDiplomaticCardIdInputName,
  personDiplomaticCardFilesPropName,
  prefixFileKey,
  deleteFiles,
}: {
  title?: string;
  backLink: string;
  person: any;
  submitPersonDiplomaticCardFiles: (formData: FormData) => Promise<
    | {
        message: string;
        status: string;
        data?: undefined;
      }
    | {
        data: any;
        status: string;
        message: string;
      }
  >;
  updatePersonDiplomaticCardFiles: (formData: FormData) => Promise<
    | {
        message: string;
        status: string;
        data?: undefined;
      }
    | {
        data: any;
        status: string;
        message: string;
      }
  >;
  personFilesFormMeta: { label: string; name: string; [x: string]: any }[];
  personDiplomaticCardIdInputName: string;
  personDiplomaticCardFilesPropName: string;
  prefixFileKey: string;
  deleteFiles?: (formData: FormData) => Promise<{
    message: string;
    status: string;
  }>;
}) {
  const [uploadedFiles, setUploadedFiles] = useState<{ [x: string]: number }>(
    {}
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useCurrentUser();
  let urlParam = searchParams.has("renew_id")
    ? `?renew_id=${searchParams.get("renew_id")}`
    : "";

  const handleFileUpload = (
    inputName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileInput = e.target;
    const files = fileInput.files;
    if (files) {
      setUploadedFiles({
        ...uploadedFiles,
        [inputName]: files.length,
      });
    }
  };

  let onSubmitAction = submitPersonDiplomaticCardFiles;

  const canSubmit =
    (!person.documentStage ||
      (person.documentStage &&
        person.documentStage !== "confirmed" &&
        person.documentStage !== "pending" &&
        person.documentStage !== "accepted" &&
        person.documentStage !== "printed") ||
      searchParams.has("renew_id") ||
      (currentUser?.isSuperAdmin && person.documentStage !== "printed")) &&
    (!person.expired || (person.expired && searchParams.has("renew_id")));

  async function formAction(formData: FormData) {
    // Remove empty files from the form data
    for (var pair of Array.from(formData.entries())) {
      if (pair[1] instanceof File && pair[1].size === 0) {
        formData.delete(pair[0]);
      }
    }

    let totalSize: number = 0;

    for (let file of Array.from(formData.entries())) {
      if (file[1] instanceof File) {
        totalSize += file[1].size;
      }
    }

    // console.log(totalSize);

    if (totalSize > 10 * 1024 * 1024) {
      toast.error("La taille totale des fichiers ne doit pas dépasser 10Mb");
      return;
    }

    // for (let file of Array.from(formData.entries())) {
    //   if (file[1] instanceof File && file[1].size > 7 * 1024 * 1024) {
    //     toast.error("Les fichiers a télécharger sont trop volumineux, veuillez ajouter des fichier de taille inférieure à 7Mb");
    //     return;
    //   }
    // }
    if (person[personDiplomaticCardFilesPropName]) {
      onSubmitAction = updatePersonDiplomaticCardFiles;
    }

    let { message, status } = await onSubmitAction(formData);
    if (message) {
      if (status === "success") {
        toast.success(message);
        if (person?.documentStage === "onhold") {
          router.push(
            backLink + "/" + person["id"] + "/" + "submit" + urlParam
          );
        } else {
          router.push(backLink);
        }
      } else if (status === "error") {
        toast.error(message);
      } else {
        toast(message);
      }
    }
  }
  return (
    <div className="relative bg-white dark:bg-slate-900 h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl flex items-center md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            {title || "Formulaire d'association de fichiers à une demande"}
          </h1>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700">
          {/* Components */}
          <p className="my-5">
            <span className="font-bold">Note:</span> Les champs marqués d'un
            astérisque (<span className="text-rose-500">*</span>) sont
            obligatoires.
          </p>
          <div className="space-y-8">
            <form action={formAction}>
              <div>
                <input
                  type="hidden"
                  name={personDiplomaticCardIdInputName}
                  value={person.id}
                />
                <div className="flex justify-between">
                  {personFilesFormMeta.map((meta) => (
                    <FileInput
                      filesCount={uploadedFiles[meta.name]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFileUpload(meta.name, e)
                      }
                      name={meta.name}
                      key={meta.name}
                      required={
                        (meta.required ||
                          (!person[personDiplomaticCardFilesPropName] &&
                            meta.name !== "others")) &&
                        true
                      }
                      label={meta.label}
                      multiple={meta.multiple && true}
                      accept={meta.accept}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <SubmitButton
                  label={
                    person[personDiplomaticCardFilesPropName]
                      ? "Update"
                      : "Enregistrer & Suivant"
                  }
                  disabled={!canSubmit}
                />
                {person[personDiplomaticCardFilesPropName] && (
                  <LinkButton
                    className="ml-3"
                    href={
                      backLink + "/" + person["id"] + "/" + "submit" + urlParam
                    }
                  >
                    Suivant <BsChevronDoubleRight className="ml-2" size={16} />
                  </LinkButton>
                )}
              </div>
            </form>

            <hr className="border-t-4 border-slate-200 dark:border-slate-700 my-5" />
            {person && (
              <div className="bg-gray-200 dark:bg-slate-800 rounded-md p-8">
                <RelatedFiles
                  addDeleteFeature={true}
                  person={person}
                  deleteFiles={deleteFiles}
                  personDiplomaticCardIdInputName={
                    personDiplomaticCardIdInputName
                  }
                  personDiplomaticCardFilesPropName={
                    personDiplomaticCardFilesPropName
                  }
                  prefixFileKey={prefixFileKey}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
