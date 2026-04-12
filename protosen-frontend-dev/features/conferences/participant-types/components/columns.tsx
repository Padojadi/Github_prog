"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ParticipantType } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ActionColumn } from "./actions-column";
import { FilterAutocomplete } from "../../../others/components/filter-autocomplete";

export const columns: ColumnDef<ParticipantType>[] = [
  {
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Label
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <p className="line-clamp-1">{row.original.description}</p>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const participantType = row.original;

      return (
        <div>
          <ActionColumn currentItem={participantType} />
        </div>
      );
    },
  },
];
