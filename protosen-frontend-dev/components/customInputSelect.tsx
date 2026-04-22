import React from "react";
import Tooltip from "@/components/tooltip";

import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
export interface CustomInputSelectProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  tooltip?: string | React.ReactNode;
  options?: IOption[];
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange?: (val: string) => void;
}

interface IOption {
  label: string;
  value: string;
  observation?: string[];
  description?: string;
}

const CustomInputSelect: React.FC<CustomInputSelectProps> = ({
  className,
  label,
  name,
  required = false,
  tooltip,
  options,
  disabled = false,
  value,
  onChange,
}) => {
  return (
    <div className={className}>
      <div className="flex items-center">
        <label className="block font-medium mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {tooltip ? (
          <Tooltip className="ml-2" bg="dark" size="md">
            <div className="text-sm text-slate-200">{tooltip}</div>
          </Tooltip>
        ) : null}
      </div>
      <Select
        disabled={disabled}
        name={name}
        value={value}
        required={required}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selectionnez..." />
        </SelectTrigger>
        <SelectContent position="popper">
          {options?.map((option: any, index) => (
            <SelectItem key={index} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomInputSelect;
