import TableComponent from "@/components/table/tableComponent";
import { LinkButton } from "@/components/ui/linkButton";
import {
  deleteCard,
  fetchHoldersCards,
} from "@/lib/actions/diplomaticCards/holders";
import { IHolder } from "@/lib/types";
import React from "react";
import { BsPlusLg } from "react-icons/bs";

export default async function Page() {
  const res = await fetchHoldersCards();

  const headers = [
    { label: "Titre", code: "title" },
    { label: "Prénom", code: "firstName" },
    { label: "Nom", code: "lastName" },
    { label: "État civil", code: "matrimonialStatus" },
    { label: "Sexe", code: "gender" },
    { label: "Date de naissance", code: "dateOfBirth" },
    { label: "Citoyenneté", code: "citizenship" },
    { label: "Numéro de carte", code: "cardNumber" },
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
      <LinkButton href="/panel/diplomatic/holders/create" className="mb-4">
        Nouvelle demande <BsPlusLg size={18} className="ml-2" />
      </LinkButton>
      <TableComponent
        headers={headers}
        title="Titulaires"
        data={Array.isArray(data) ? data : []}
        actions={[
          { label: "details", href: "/panel/diplomatic/holders/" },
          { label: "edit", href: "/panel/diplomatic/holders/" },
          { label: "validate", href: "/panel/diplomatic/holders/" },
          {
            label: "delete-card",
            href: "/panel/diplomatic/holders/",
            customAction: deleteCard,
          },
        ]}
      />
    </div>
  );
}
