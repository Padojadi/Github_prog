"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Check, Info, XCircle } from "lucide-react";
import { ActionColumn } from "./actions-column";
import { ConferenceRegistration } from "../../types";
import { FilterAutocomplete } from "@/features/others/components/filter-autocomplete";
import { translateConferenceRegistrationStatus } from "../../lib/utils";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsFilter } from "react-icons/bs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn, formatDateFnsLocale } from "@/lib/utils";
import StatusBadgeRegistration from "../registration-details/status-badge-registration";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ConferenceRegistration>[] = [
  {
    id: "attendeeName",
    accessorFn: (row) => `${row.lastName} ${row.firstName}`,
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Nom complet
            {{
              asc: " 🔼",
              desc: " 🔽",
            }[column.getIsSorted() as string] ?? null}
          </Button>
          <FilterAutocomplete column={column} />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("attendeeName")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Email
            {{
              asc: " 🔼",
              desc: " 🔽",
            }[column.getIsSorted() as string] ?? null}
          </Button>
          <FilterAutocomplete column={column} />
        </div>
      );
    },
  },
  {
    accessorKey: "conferenceParticipantType.label",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Catégorie de participant
            {{
              asc: " 🔼",
              desc: " 🔽",
            }[column.getIsSorted() as string] ?? null}
          </Button>
          <FilterAutocomplete column={column} />
        </div>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.conferenceParticipantType?.label}</span>;
    },
  },
  {
    accessorKey: "functionModel.label",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Fonction
            {{
              asc: " 🔼",
              desc: " 🔽",
            }[column.getIsSorted() as string] ?? null}
          </Button>
          <FilterAutocomplete column={column} />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p>
            {row.original.functionModel
              ? row.original.functionModel.name
              : "Autre"}
          </p>
          {row.original.functionModel === null &&
            row.original.customFunction && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>{row.original.customFunction}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Date d&apos;inscription
            {{
              asc: " 🔼",
              desc: " 🔽",
            }[column.getIsSorted() as string] ?? null}
          </Button>
          <FilterAutocomplete column={column} />
        </div>
      );
    },
    cell: ({ row }) => <div>{formatDateFnsLocale(row.original.createdAt)}</div>,
  },
  // {
  //   id: "conferenceName",
  //   accessorFn: (row) => `${row.lastName} ${row.firstName}`,
  //   header: ({ column }) => {
  //     return (
  //       <div className="flex justify-between">
  //         <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
  //           Nom complet
  //           {{
  //             asc: " 🔼",
  //             desc: " 🔽",
  //           }[column.getIsSorted() as string] ?? null}
  //         </Button>
  //         <FilterAutocomplete column={column} />
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className="font-medium">{row.getValue("attendeeName")}</div>
  //   ),
  // },
  {
    accessorKey: "subscriptionStatus",
    header: ({ column }) => {
      const [open, setOpen] = React.useState(false);
      const columnFilterValue = column.getFilterValue();

      const sortedUniqueValues = React.useMemo(
        () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
        [column.getFacetedUniqueValues()]
      );
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Statut
            {{
              asc: " 🔼",
              desc: " 🔽",
            }[column.getIsSorted() as string] ?? null}
          </Button>
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
                        {translateConferenceRegistrationStatus(item)}
                        <Check
                          className={cn(
                            "ml-auto",
                            columnFilterValue === item
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
    cell: ({ row }) => (
      <StatusBadgeRegistration
        status={row.original.subscriptionStatus}
        size="sm"
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const registration = row.original;

      return (
        <div>
          <ActionColumn currentItem={registration} />
        </div>
      );
    },
  },
];
