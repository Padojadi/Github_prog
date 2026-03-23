"use client";

import React, { useEffect, useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Backend_URL } from "@/lib/constants";
import { getSession } from "next-auth/react";
import Select from "react-select";
import { fetchInstitutionsR } from "@/lib/actions/diplomaticCards/other";

interface ISelectOrganismProps {
  name: string;
  initialOrganismId?: string;
}

const SelectOrganism: React.FC<ISelectOrganismProps> = ({
  name,
  initialOrganismId,
}) => {
  const [institutions, setInstitutions] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>("");
  useEffect(() => {
    const fetchInstitutions = async () => {
      const session = await getSession();
      const token = session?.backendTokens?.accessToken;
      try {
        // const response = await fetch(`${Backend_URL}/institution/data`, {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: "Bearer " + token,
        //   },
        // });

        const response = await fetchInstitutionsR();
        // const res = await response.json();
        const formattedInstitutions = response.data.rows.map((item: any) => ({
          value: item.id,
          label: item.libelle,
        }));
        setInstitutions(formattedInstitutions);
        if (initialOrganismId) {
          setSelectedOrg(
            formattedInstitutions.find(
              (institution: any) => institution.value === initialOrganismId
            ).value || ""
          );
        }
      } catch (error) {
        console.error("Error fetching institutions:", error);
      }
    };
    fetchInstitutions();
  }, [initialOrganismId]);

  return (
    <>
      <Label htmlFor={name}>Organisme</Label>
      <Select
        placeholder="Selectionner une carte ..."
        onChange={(value) => setSelectedOrg(value)}
        value={selectedOrg}
        name={name}
        instanceId={useId()}
        noOptionsMessage={() => "Aucune option"}
        className="w-full"
        required
        options={institutions}
      />
    </>
  );
};

export default SelectOrganism;
