"use client";

import React, { useEffect, useState, useId } from "react";
import Select from "react-select";
import Tooltip from "./tooltip";

interface InputSelectProps {
  label: string;
  name: string;
  id?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  tooltip?: string;
  disabled?: boolean;
  className?: string;
  initialCitizenship?: string;
}

interface IOption {
  label: string;
  value: string;
}

const CitizenshipSelect: React.FC<InputSelectProps> = ({
  className,
  label,
  name,
  id,
  required = false,
  tooltip,
  disabled = false,
  initialCitizenship,
}) => {
  const [citizenships, setCitizenships] = useState([]);
  const [selectedCitizenship, setSelectedCitizenship] = useState(undefined);
  const citizenshipToRemove = ["Taïwanaise", "Macanaise", "Hongkongaise"];
  useEffect(() => {
    const fetchCitizenships = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=demonyms"
        );
        const res = await response.json();
        const formattedCitizenships = res
          .map((item: any) => ({
            value:
              item.demonyms.fra.f === "Burkinabée"
                ? "Burkinabé"
                : item.demonyms.fra.f,
            label:
              item.demonyms.fra.f === "Burkinabée"
                ? "Burkinabé"
                : item.demonyms.fra.f,
          }))
          .filter((item: any) => !citizenshipToRemove.includes(item.value));
        setCitizenships(formattedCitizenships);
        if (initialCitizenship) {
          setSelectedCitizenship(
            formattedCitizenships.find(
              (Citizenship: IOption) => Citizenship.value === initialCitizenship
            ) || { value: initialCitizenship, label: initialCitizenship }
          );
        }
      } catch (error) {
        console.error("Error fetching citizenships:", error);
      }
    };

    fetchCitizenships();
  }, []);

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1" htmlFor={id}>
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {tooltip ? (
        <Tooltip className="ml-2" bg="dark" size="md">
          <div className="text-sm text-slate-200">{tooltip}</div>
        </Tooltip>
      ) : null}
      <Select
        placeholder="Selectionner une nationalité ..."
        value={selectedCitizenship}
        onChange={(selectedOption) =>
          setSelectedCitizenship(selectedOption as any)
        }
        isDisabled={disabled}
        name={name}
        id={id}
        instanceId={useId()}
        className="w-full"
        required={required}
        options={citizenships}
      />
    </div>
  );
};

export default CitizenshipSelect;
