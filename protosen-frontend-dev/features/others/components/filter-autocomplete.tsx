import { Column } from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsFilter } from "react-icons/bs";
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, XCircle } from "lucide-react";

export function FilterAutocomplete<T>({
  column,
}: {
  column: Column<T, unknown>;
}) {
  const [open, setOpen] = React.useState(false);
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <BsFilter size={20} />
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[200px]">
        <Command
          className="[&_[cmdk-input-wrapper]]:border-b-0"
          value={((columnFilterValue as string) ?? "") as string}
        >
          <div className="flex border-b px-1 items-center">
            <CommandInput
              className="border-transparent focus:border-transparent focus:ring-transparent"
              placeholder={`Rechercher... (${
                column.getFacetedUniqueValues().size
              })`}
            />
            <Button
              variant={"ghost"}
              size="icon"
              className=""
              onClick={() => column.setFilterValue("")}
            >
              <XCircle className="size-4" />
            </Button>
          </div>

          <CommandList>
            <CommandEmpty>Aucun résultat</CommandEmpty>
            <CommandGroup>
              {sortedUniqueValues.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={(currentValue) => {
                    column.setFilterValue(item);
                    setOpen(false);
                  }}
                >
                  {item}
                  <Check
                    className={cn(
                      "ml-auto",
                      columnFilterValue === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
