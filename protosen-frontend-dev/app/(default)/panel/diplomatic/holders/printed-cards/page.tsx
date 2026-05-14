import TableComponent from "@/components/table/tableComponent";
import {
  fetchHoldersPrintedCards,
  markCardAsReturned,
  undoPrint,
} from "@/lib/actions/diplomaticCards/holders";
import { IHolder } from "@/lib/types";
import React from "react";

export default async function Page() {
  const res = await fetchHoldersPrintedCards();

  const headers = [
    { label: "Titre", code: "title" },
    { label: "Prénom", code: "firstName" },
    { label: "Nom", code: "lastName" },
    { label: "État civil", code: "matrimonialStatus" },
    { label: "Sexe", code: "gender" },
    { label: "Date de naissance", code: "dateOfBirth" },
    { label: "Citoyenneté", code: "citizenship" },
    { label: "Numéro de carte", code: "cardNumber" },
    { label: "Statut", code: "expired" },
    { label: "Organisation", code: "organism" },
    { label: "Créé le", code: "createdAt" },
  ];

  const data = res?.data?.rows.map((item: IHolder) => {
    return Object.fromEntries(Object.entries(item));
  });

  // console.log(data)

  return (
    <div>
      <TableComponent
        headers={headers}
        title="Titulaires"
        data={Array.isArray(data) ? data : []}
        actions={[
          { label: "details", href: "/panel/diplomatic/holders/" },
          {
            label: "unlock",
            href: "/panel/diplomatic/holders/",
            customAction: undoPrint,
          },
          {
            label: "return",
            href: "/panel/diplomatic/holders/",
            customAction: markCardAsReturned,
          },
        ]}
      />
    </div>
  );
}
