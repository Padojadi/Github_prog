import { Alert } from "@/components/alert";
import TableComponent from "@/components/table/tableComponent";
import { LinkButton } from "@/components/ui/linkButton";
import {
  deleteCard,
  fetchDomesticAndRelativesCards,
} from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import { IHolder } from "@/lib/types";
import React from "react";
import { BsPlusLg } from "react-icons/bs";

export default async function Page() {
  const res = await fetchDomesticAndRelativesCards();

  const headers = [
    { label: "Prénom", code: "firstName" },
    { label: "Nom", code: "lastName" },
    { label: "Sexe", code: "gender" },
    { label: "Date de naissance", code: "dateOfBirth" },
    { label: "Lieu de naissance", code: "placeOfBirth" },
    { label: "Citoyenneté", code: "citizenship" },
    { label: "Pays de naissance", code: "countryOfBirth" },
    { label: "Statut", code: "documentStage" },
    { label: "Organisation", code: "organism" },
    { label: "Créé le", code: "createdAt" },
  ];

  const data = res?.data?.rows.map((item: IHolder) => {
    return Object.fromEntries(Object.entries(item));
  });

  // console.log(data)

  return (
    <div>
      <LinkButton
        href="/panel/diplomatic/domestics-and-relatives/create"
        className="mb-4"
      >
        Nouvelle demande <BsPlusLg size={18} className="ml-2" />
      </LinkButton>
      <TableComponent
        headers={headers}
        title="Personnels de services, domestiques et familles"
        data={Array.isArray(data) ? data : []}
        actions={[
          {
            label: "details",
            href: "/panel/diplomatic/domestics-and-relatives/",
          },
          {
            label: "edit",
            href: "/panel/diplomatic/domestics-and-relatives/",
          },
          {
            label: "validate",
            href: "/panel/diplomatic/domestics-and-relatives/",
          },
          {
            label: "delete-card",
            href: "/panel/diplomatic/domestics-and-relatives/",
            customAction: deleteCard,
          },
        ]}
      />
    </div>
  );
}
