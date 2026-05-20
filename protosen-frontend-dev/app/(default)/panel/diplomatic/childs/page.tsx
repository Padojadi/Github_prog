import TableComponent from "@/components/table/tableComponent";
import { LinkButton } from "@/components/ui/linkButton";
import {
  deleteCard,
  fetchChildsCards,
} from "@/lib/actions/diplomaticCards/childs";
import { IHolder } from "@/lib/types";
import React from "react";
import { BsPlusLg } from "react-icons/bs";

export default async function Page() {
  const res = await fetchChildsCards();

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
    { label: "Créer le", code: "createdAt" },
  ];

  const data = res?.data?.rows.map((item: IHolder) => {
    return Object.fromEntries(Object.entries(item));
  });

  return (
    <div>
      <LinkButton href="/panel/diplomatic/childs/create" className="mb-4">
        Nouvelle demande <BsPlusLg size={18} className="ml-2" />
      </LinkButton>
      <TableComponent
        headers={headers}
        title="Enfants du Titulaire"
        data={Array.isArray(data) ? data : []}
        actions={[
          { label: "details", href: "/panel/diplomatic/childs/" },
          { label: "edit", href: "/panel/diplomatic/childs/" },
          { label: "validate", href: "/panel/diplomatic/childs/" },
          {
            label: "delete-card",
            href: "/panel/diplomatic/childs/",
            customAction: deleteCard,
          },
        ]}
      />
    </div>
  );
}
