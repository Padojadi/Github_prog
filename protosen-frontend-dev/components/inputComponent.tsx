import React from "react";
import Tooltip from "@/components/tooltip";

export interface InputComponentProps {
  label: string;
  name: string;
  id?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  supportingText?: string;
  errorText?: string | null;
  tooltip?: string;
  options?: IOption[];
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

interface IOption {
  label: string;
  value: string;
}

const InputComponent: React.FC<InputComponentProps> = ({
  className,
  label,
  name,
  id,
  type = "text",
  required = false,
  placeholder,
  prefix,
  suffix,
  icon,
  supportingText,
  errorText,
  tooltip,
  options,
  disabled = false,
  value,
  onChange,
}) => {
  if (type === "select") {
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
          onChange={onChange}
          name={name}
          id={id}
          className="form-select w-full"
          required={required}
          value={value}
        >
          {options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor={id}>
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {tooltip ? (
          <Tooltip className="ml-2" bg="dark" size="md">
            <div className="text-sm text-slate-200">{tooltip}</div>
          </Tooltip>
        ) : null}
      </div>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
            <span className="text-sm text-slate-400 dark:text-slate-500 font-medium px-3">
              {prefix}
            </span>
          </div>
        )}
        {icon && (
          <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          onChange={onChange}
          name={name}
          id={id}
          className={`${
            errorText && "border-rose-300"
          } form-input w-full disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed`}
          type={type}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
        />
        {suffix && (
          <div className="absolute inset-0 left-auto flex items-center pointer-events-none">
            <span className="text-sm text-slate-400 dark:text-slate-500 font-medium px-3">
              {suffix}
            </span>
          </div>
        )}
      </div>
      {supportingText && <div className="text-xs mt-1">{supportingText}</div>}
      {errorText && (
        <div className="text-xs mt-1 text-rose-500">{errorText}</div>
      )}
    </div>
  );
};

export default InputComponent;
