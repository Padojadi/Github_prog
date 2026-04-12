"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TPlate } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ActionColumn } from "./actions-column";
import { FilterAutocomplete } from "../../components/filter-autocomplete";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<TPlate>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Titre
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
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Code
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const cardType = row.original;

      return (
        <div>
          <ActionColumn currentItem={cardType} />
        </div>
      );
    },
  },
];
