import React from "react";
import Tooltip from "@/components/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

export interface InputComboboxProps {
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
  onChange?: (value: string) => void;
}

interface IOption {
  label: string;
  value: string;
}

const InputCombobox: React.FC<InputComboboxProps> = ({
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
  const [open, setOpen] = React.useState(false);
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            name={name}
            disabled={disabled}
            className="w-full justify-between form-select"
          >
            {value
              ? options?.find((option) => option.value === value)?.label
              : "Sélectionner un titulaire..."}
            {/* <ChevronsUpDown className="opacity-50" /> */}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[400px]">
          <Command value={value}>
            {/* <CommandInput placeholder="Rechercher un titulaire..." /> */}
            <CommandList>
              <CommandEmpty>Aucun titulaire trouvé.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-64">
                  {options &&
                    options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(currentValue) => {
                          if (onChange)
                            onChange(
                              currentValue === value ? "" : currentValue
                            );
                          setOpen(false);
                        }}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* <select
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
      </select> */}
    </div>
  );
};

export default InputCombobox;
