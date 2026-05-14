"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { CheckCircleIcon } from "lucide-react";
import { IPerson, ISubmitAction } from "@/lib/types";
import ModalBasic from "@/components/ui/modal-basic";
import SubmitButton from "@/components/submitButton";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { isEmpty } from "@/components/utils/utilsClient";
import BadgeStatusComponent from "@/components/ui/badgeStatusComponent";
import {
  fetchDuplicateHolderCardById,
  fetchRenewHolderCardById,
} from "@/lib/actions/diplomaticCards/holders";

const ValidateForm = ({
  person,
  validateData,
  renewAction,
  duplicateAction,
  backLink,
}: {
  person: IPerson;
  validateData: ISubmitAction;
  renewAction?: ISubmitAction;
  duplicateAction?: ISubmitAction;
  backLink: string;
}) => {
  const router = useRouter();
  const [reasonSelected, setReasonSelected] = React.useState("");
  const [reasonToSubmit, setReasonToSubmit] = React.useState("");
  const [basicModalOpen, setBasicModalOpen] = React.useState<boolean>(false);
  const [renewData, setRenewData] = useState<any>();
  const [duplicateData, setDuplicateData] = useState<any>();
  const searchParams = useSearchParams();

  const renewId = searchParams.has("renew_id")
    ? searchParams.get("renew_id")
    : null;
  const duplicateId = searchParams.has("duplicate_id")
    ? searchParams.get("duplicate_id")
    : null;
  const theId =
    renewId && renewAction
      ? renewId
      : duplicateId && duplicateAction
      ? duplicateId
      : person.id;

  let pageKey = searchParams.has("renew_id")
    ? "/renew"
    : searchParams.has("duplicate_id")
    ? "/duplicates"
    : "";

  const onChange = (value: string) => {
    setReasonSelected(value);
    if (value !== "other") {
      setReasonToSubmit(value);
    } else {
      setReasonToSubmit("");
    }
  };

  const confirmed = searchParams.has("duplicate_id")
    ? duplicateData?.documentStage === "confirmed"
    : searchParams.has("renew_id")
    ? renewData?.documentStage === "confirmed"
    : person?.documentStage === "confirmed";

  // console.log(person);

  async function formAction(formData: FormData) {
    let { message, errors, status } =
      searchParams.has("renew_id") && renewAction
        ? await renewAction(formData)
        : searchParams.has("duplicate_id") && duplicateAction
        ? await duplicateAction(formData)
        : await validateData(formData);

    if (message) {
      if (status === "success") {
        toast.success(message);
        router.push(backLink + pageKey);
      } else if (status === "error") {
        toast.error(message);
      } else {
        toast(message);
      }
    }
    if (errors && !isEmpty(errors)) {
      // toast.error(JSON.stringify(errors));
      // console.log(JSON.stringify(errors));
    }
  }

  useEffect(() => {
    // fetch renew data by id
    async function fetchRenewData() {
      if (renewId) {
        const res = await fetchRenewHolderCardById(renewId);
        if (res.status === "error") {
          throw new Error(res.message);
        }
        setRenewData(res.data);
      }
    }
    fetchRenewData();

    // fetch duplicate data by id
    async function fetchDuplicateData() {
      if (duplicateId) {
        const res = await fetchDuplicateHolderCardById(duplicateId);
        if (res.status === "error") {
          throw new Error(res.message);
        }
        setDuplicateData(res.data);
      }
    }
    fetchDuplicateData();
  }, [renewId, duplicateId]);

  return (
    <div className="grid grid-cols-1">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        {person?.ownerDiplomaticCardFiles ? (
          <>
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">
                Documents en attente de validation
              </h2>
              <div className="flex items-center">
                <div className="flex flex-col items-end">
                  <div>
                    <span className="text-gray-500 mr-2">
                      Statut de la carte :
                    </span>
                    <BadgeStatusComponent status={person.documentStage} />
                  </div>
                  {renewData && (
                    <div>
                      <span className="text-gray-500 mr-2">
                        Statut du renouvellement :
                      </span>
                      <BadgeStatusComponent status={renewData?.documentStage} />
                    </div>
                  )}
                  {duplicateData && (
                    <div>
                      <span className="text-gray-500 mr-2">
                        Statut du duplicata :
                      </span>
                      <BadgeStatusComponent
                        status={duplicateData?.documentStage}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ul className="space-y-4">
              {person?.ownerDiplomaticCardFiles?.passportKey && (
                <li className="flex items-center gap-2">
                  <div className="flex items-center">
                    <CheckCircleIcon className="text-green-500 mr-2" />
                    <span className="flex-1">Passeport</span>
                  </div>
                  <Button variant={"link"}>
                    <a href={person.passportLink} target="_blank">
                      Voir document
                    </a>
                  </Button>
                </li>
              )}
              {person.ownerDiplomaticCardFiles.lcKey && (
                <li className="flex items-center gap-2">
                  <div className="flex items-center">
                    <CheckCircleIcon className="text-green-500 mr-2" />
                    <span className="flex-1">Note verbale</span>
                  </div>
                  <Button variant={"link"}>
                    <a href={person.lcLink} target="_blank">
                      Voir document
                    </a>
                  </Button>
                </li>
              )}
              {person.ownerDiplomaticCardFiles.othersKey && (
                <li className="flex flex-col">
                  <div className="flex items-center">
                    <CheckCircleIcon className="text-green-500 mr-2" />
                    <span className="flex-1">
                      {person.ownerDiplomaticCardFiles.othersKey.length}{" "}
                      Autre(s) Fichier(s)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {person.presignUrlOthersLink.map(
                      (link: string, index: number) => (
                        <Button variant={"link"} key={index}>
                          <a href={link} target="_blank">
                            Voir document {index + 1}
                          </a>
                        </Button>
                      )
                    )}
                  </div>
                </li>
              )}
            </ul>
            <div className="mt-6 flex justify-end">
              <form action={formAction}>
                <input type="hidden" name="id" value={theId} />
                <input type="hidden" name="documentStage" value={"confirmed"} />
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white mr-2"
                  variant="destructive"
                  disabled={confirmed}
                  onClick={(e) => {
                    e.preventDefault();
                    setBasicModalOpen(true);
                  }}
                >
                  Rejeter
                </Button>
                <SubmitButton label="Valider" disabled={confirmed} />
              </form>
            </div>
          </>
        ) : (
          <h2 className="text-xl font-semibold mb-4">
            Aucun documents en attente de validation
          </h2>
        )}
      </div>

      <ModalBasic
        isOpen={basicModalOpen}
        setIsOpen={setBasicModalOpen}
        title="Motif de rejet"
      >
        {/* Modal content */}
        <form action={formAction}>
          <div className="px-5 pt-4 pb-1">
            <div className="text-sm">
              <Select onValueChange={onChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un motif" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Dossier incomplet">
                    Dossier incomplet
                  </SelectItem>
                  <SelectItem value="Informations invalides">
                    Informations invalides
                  </SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="id" value={theId} />
              <input type="hidden" name="rejectReason" value={reasonToSubmit} />
              <input type="hidden" name="documentStage" value={"rejected"} />
              {reasonSelected === "other" && (
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 mt-4"
                  placeholder="Raison de rejet"
                  value={reasonToSubmit}
                  onChange={(e) => setReasonToSubmit(e.target.value)}
                  required
                ></textarea>
              )}
            </div>
          </div>
          {/* Modal footer */}
          <div className="px-5 py-4">
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="btn bg-red-500 hover:bg-red-600 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  setReasonSelected("");
                  setBasicModalOpen(false);
                }}
              >
                Annuler
              </button>
              <SubmitButton label="Oui Rejeter" />
            </div>
          </div>
        </form>
      </ModalBasic>
    </div>
  );
};

export default ValidateForm;
