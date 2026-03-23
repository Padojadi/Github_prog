"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SupportCategory } from "../types";
import { Button } from "@/components/ui/button";
import { ActionColumn } from "./actions-column";
import { FilterAutocomplete } from "../../../others/components/filter-autocomplete";

export const columns: ColumnDef<SupportCategory>[] = [
  {
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Libellé
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
      const supportCategory = row.original;

      return (
        <div>
          <ActionColumn currentItem={supportCategory} />
        </div>
      );
    },
  },
];
