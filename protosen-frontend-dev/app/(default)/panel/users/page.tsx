import React from "react";
import TableComponent from "@/components/table/tableComponent";
import { LinkButton } from "@/components/ui/linkButton";
import { deleteUser, fetchUsers } from "@/lib/actions/users";

export default async function Page() {
	const res = await fetchUsers();

	const headers = [
		{ label: "Prénom", code: "first_name" },
		{ label: "Nom", code: "last_name" },
		{ label: "Téléphone", code: "phone" },
		{ label: "Rôle", code: "role" },
		{ label: "Statut", code: "status" },
		{ label: "Organisme", code: "organism.libelle" },
		// { label: "Supprimé", code: "deleted" },
		{ label: "Date de création", code: "createdAt" },
		{ label: "Date de modification", code: "updatedAt" },
	];

	const data = res?.data?.rows;

  return (
    <div>
      <LinkButton href="/panel/users/create" className="mb-4">
        Nouvel utilisateur
      </LinkButton>
      <TableComponent
        headers={headers}
        title="Utilisateurs"
        data={Array.isArray(data) ? data : []}
        actions={[
          { label: "details", href: "/panel/users/" },
          { label: "edit", href: "/panel/users/" },
          { label: "delete", href: "/panel/users/", customAction: deleteUser },
          { label: "password", href: "/panel/users/" },
        ]}
      />
    </div>
  );
}
