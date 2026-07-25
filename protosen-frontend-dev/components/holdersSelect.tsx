"use client";

import React, { useEffect, useState, useId } from "react";
import Select from "react-select";
import Tooltip from "./tooltip";
import { fetchActiveHoldersCards } from "@/lib/actions/diplomaticCards/holders";
import { IHolder } from "@/lib/types";

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
  initialHolderCard?: string;
  onChange: (value: null) => void;
}

interface IOption {
  label: string;
  value: string;
}

const HolderCardSelect: React.FC<InputSelectProps> = ({
  className,
  label,
  name,
  id,
  required = false,
  tooltip,
  disabled = false,
  initialHolderCard,
  onChange,
}) => {
  const [holdersCards, setHoldersCards] = useState([]);
  useEffect(() => {
    const fetchHolders = async () => {
      try {
        const res = await fetchActiveHoldersCards();
        const data = res?.data?.rows.map((item: IHolder) => {
          let holder = Object.fromEntries(Object.entries(item));
          return {
            value: holder.id,
            label: holder.firstName + " " + holder.lastName,
          };
        });
        setHoldersCards(data);
      } catch (error) {
        console.error("Error fetching HoldersCards:", error);
      }
    };

    fetchHolders();
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
        placeholder="Selectionner une carte ..."
        onChange={onChange}
        isDisabled={disabled}
        name={name}
        id={id}
        instanceId={useId()}
        className="w-full"
        required={required}
        options={holdersCards}
      />
    </div>
  );
};

export default HolderCardSelect;
