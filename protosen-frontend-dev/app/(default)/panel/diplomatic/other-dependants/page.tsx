import { Alert } from "@/components/alert";
import TableComponent from "@/components/table/tableComponent";
import { LinkButton } from "@/components/ui/linkButton";
import {
  deleteCard,
  fetchOtherDependantsCards,
} from "@/lib/actions/diplomaticCards/otherDependants";
import { IHolder } from "@/lib/types";
import React from "react";
import { BsPlusLg } from "react-icons/bs";

export default async function Page() {
  const res = await fetchOtherDependantsCards();

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
        href="/panel/diplomatic/other-dependants/create"
        className="mb-4"
      >
        Nouvelle demande <BsPlusLg size={18} className="ml-2" />
      </LinkButton>
      <TableComponent
        headers={headers}
        title="Autres Dépendants"
        data={Array.isArray(data) ? data : []}
        actions={[
          {
            label: "details",
            href: "/panel/diplomatic/other-dependants/",
          },
          { label: "edit", href: "/panel/diplomatic/other-dependants/" },
          {
            label: "validate",
            href: "/panel/diplomatic/other-dependants/",
          },
          {
            label: "delete-card",
            href: "/panel/diplomatic/other-dependants/",
            customAction: deleteCard,
          },
        ]}
      />
    </div>
  );
}
