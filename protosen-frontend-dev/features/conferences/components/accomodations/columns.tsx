"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ActionColumn } from "./actions-column";
import BadgeStatusComponent from "@/components/ui/badgeStatusComponent";
import { ConferenceHotel } from "../../types";
import { FilterAutocomplete } from "@/features/others/components/filter-autocomplete";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ConferenceHotel>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Nom
            {{
              asc: " 🔼",
              desc: " 🔽",
            }[column.getIsSorted() as string] ?? null}
          </Button>
          <FilterAutocomplete column={column} />
        </div>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
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
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Téléphone
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Créé le
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
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Modifié le
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
      const organism = row.original;

      return (
        <div>
          <ActionColumn currentItem={organism} />
        </div>
      );
    },
  },
];
