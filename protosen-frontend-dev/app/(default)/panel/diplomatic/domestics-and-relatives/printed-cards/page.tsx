import TableComponent from "@/components/table/tableComponent";
import { LinkButton } from "@/components/ui/linkButton";
import { fetchDomesticAndRelativesPrintedCards, undoPrint, markCardAsReturned } from "@/lib/actions/diplomaticCards/domesticAndRelatives";
import { IHolder } from "@/lib/types";
import React from "react";
import { BsPlusLg } from "react-icons/bs";

export default async function Page() {
  const res = await fetchDomesticAndRelativesPrintedCards();

  const headers = [
    { label: "Prénom", code: "firstName" },
    { label: "Nom", code: "lastName" },
    { label: "Sexe", code: "gender" },
    { label: "Date de naissance", code: "dateOfBirth" },
    { label: "Lieu de naissance", code: "placeOfBirth" },
    { label: "Citoyenneté", code: "citizenship" },
    { label: "Pays de naissance", code: "countryOfBirth" },
    { label: "Statut", code: "expired" },
    { label: "Organisation", code: "organism" },
    { label: "Créer le", code: "createdAt" },
  ];

  const data = res?.data?.rows.map((item: IHolder) => {
    return Object.fromEntries(Object.entries(item));
  });

  // console.log(data)

  return (
    <div>
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
            label: "unlock",
            href: "/panel/diplomatic/domestics-and-relatives/",
            customAction: undoPrint,
          },
          {
            label: "return",
            href: "/panel/diplomatic/domestics-and-relatives/",
            customAction: markCardAsReturned,
          },
        ]}
      />
    </div>
  );
}
