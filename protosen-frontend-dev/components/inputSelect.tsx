import React from "react";
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
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface IOption {
  label: string;
  value: string;
}

const InputSelect: React.FC<InputSelectProps> = ({
  className,
  label,
  name,
  id,
  required = false,
  tooltip,
  options,
  disabled = false,
  value,
  onChange,
}) => {
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
      <select
        disabled={disabled}
        onChange={onChange}
        name={name}
        id={id}
        className="form-select w-full"
        value={value}
        required={required}
      >
        {options?.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSelect;
