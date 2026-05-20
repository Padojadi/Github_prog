"use client";

import React, { useEffect, useId, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Tooltip from "@/components/tooltip";

export interface InputSelectProps {
  label: string;
  name: string;
  id?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  tooltip?: string;
  options?: IOption[];
  disabled?: boolean;
  className?: string;
  value?: string;
  initialValue?: string;
  supportingText?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface IOption {
  label: string;
  value: string;
}

const InputCreatableSelect: React.FC<InputSelectProps> = ({
  className,
  label,
  name,
  id,
  required = false,
  tooltip,
  options,
  disabled = false,
  initialValue,
  supportingText,
  placeholder,
}) => {
  const [selectedValue, setSelectedValue] = useState<IOption | undefined>(
    undefined
  );

  useEffect(() => {
    if (initialValue && options) {
      setSelectedValue(
        options.find((option: IOption) => option.value === initialValue) || {
          value: initialValue,
          label: initialValue,
        }
      );
    }
  }, [initialValue, options]);

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
      <CreatableSelect
        instanceId={useId()}
        value={selectedValue}
        onChange={(selectedOption) => setSelectedValue(selectedOption as any)}
        required={required}
        id={id}
        name={name}
        isDisabled={disabled}
        isClearable
        options={options}
        placeholder={placeholder}
        formatCreateLabel={(inputValue) => `Créer "${inputValue}"`}
      />
      {supportingText && <div className="text-xs mt-1">{supportingText}</div>}
    </div>
  );
};

export default InputCreatableSelect;
