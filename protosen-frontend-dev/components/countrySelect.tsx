"use client";

import React, { useEffect, useState, useId } from "react";
import Select from "react-select";
import Tooltip from "./tooltip";

export interface InputSelectProps {
  label: string;
  name: string;
  id?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  tooltip?: string;
  disabled?: boolean;
  className?: string;
  initialCountry?: string;
}

interface IOption {
  label: string;
  value: string;
}

const CountrySelect: React.FC<InputSelectProps> = ({
  className,
  label,
  name,
  id,
  required = false,
  tooltip,
  disabled = false,
  initialCountry,
}) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(undefined);
  const countryToRemove = ["Taïwan", "Macao", "Hong Kong"];
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,translations,flag"
        );
        const res = await response.json();
        // console.log(res);
        const formattedCountries = res
          .map((item: any) => ({
            value: item.translations.fra.common,
            label: item.flag + " " + item.translations.fra.common,
          }))
          .filter((item: any) => !countryToRemove.includes(item.value));
        setCountries(formattedCountries);
        if (initialCountry) {
          setSelectedCountry(
            formattedCountries.find(
              (country: IOption) => country.value === initialCountry
            ) || { value: initialCountry, label: initialCountry }
          );
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
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
        placeholder="Selectionner un pays ..."
        value={selectedCountry}
        onChange={(selectedOption) => setSelectedCountry(selectedOption as any)}
        isDisabled={disabled}
        name={name}
        id={id}
        instanceId={useId()}
        className="w-full"
        required={required}
        options={countries}
      />
    </div>
  );
};

export default CountrySelect;
