"use client";

import React, { useEffect, useId, useState } from "react";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import { fetchInstitutionsR } from "@/lib/actions/diplomaticCards/other";

interface ISelectOrganismProps {
  name: string;
  initialOrganismId?: string;
}

type InstitutionOption = {
  value: string;
  label: string;
};

const SelectOrganism: React.FC<ISelectOrganismProps> = ({
  name,
  initialOrganismId,
}) => {
  const [institutions, setInstitutions] = useState<InstitutionOption[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<InstitutionOption | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetchInstitutionsR();
        const formattedInstitutions = response.data.rows.map((item: any) => ({
          value: item.id,
          label: item.libelle,
        }));
        setInstitutions(formattedInstitutions);
        if (initialOrganismId) {
          const initialOption =
            formattedInstitutions.find(
              (institution: InstitutionOption) =>
                institution.value === initialOrganismId,
            ) || null;
          setSelectedOrg(initialOption);
          setSelectedOrgId(initialOption?.value || "");
        } else if (formattedInstitutions.length > 0) {
          setSelectedOrg(formattedInstitutions[0]);
          setSelectedOrgId(formattedInstitutions[0].value);
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
      <input type="hidden" name={name} value={selectedOrgId} />
      <Select
        placeholder="Selectionner une carte ..."
        onChange={(value) => {
          const option = (value as InstitutionOption | null) || null;
          setSelectedOrg(option);
          setSelectedOrgId(option?.value || "");
        }}
        value={selectedOrg}
        instanceId={useId()}
        noOptionsMessage={() => "Aucune option"}
        className="w-full"
        options={institutions}
      />
    </>
  );
};

export default SelectOrganism;
