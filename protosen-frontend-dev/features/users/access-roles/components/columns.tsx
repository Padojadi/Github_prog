"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AccessRole } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Check, CheckCircle, ChevronDown } from "lucide-react";
import { ActionColumn } from "./actions-column";
import { FilterAutocomplete } from "@/features/others/components/filter-autocomplete";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { translatePermission } from "../lib/utils";
import { MdManageAccounts, MdApproval } from "react-icons/md";
import { FaIdCard } from "react-icons/fa";
import { PiArmchair } from "react-icons/pi";
import { RiEyeFill } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import { permissions } from "../lib/data";

const icons = {
  ACCESS_CONFERENCE_MODULE: <RiEyeFill size={16} />,
  REQUEST_CONFERENCE: <FiPlus size={16} />,
  ACCEPT_CONFERENCE_REQUEST: <Check className="size-4" />,
  VALIDATE_CONFERENCE_REQUEST: <MdApproval size={16} />,
  CONFIRM_CONFERENCE_REQUEST: <CheckCircle className="size-4" />,
  MANAGE_CONFERENCES: <MdManageAccounts size={16} />,
  ACCESS_CARD_MODULE: <FaIdCard size={16} />,
  ACCESS_HONOR_LOUNGE_MODULE: <PiArmchair size={16} />,
};

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<AccessRole>[] = [
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
  },
  {
    accessorKey: "permissions",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Permissions
            {{
              asc: " 🔼",
              desc: " 🔽",
            }[column.getIsSorted() as string] ?? null}
          </Button>
          {/* <FilterAutocomplete column={column} /> */}
        </div>
      );
    },
    cell: ({ row }) => {
      const accessRole = row.original;
      const rolePermissions = Array.isArray(accessRole.permissions)
        ? accessRole.permissions
        : [];
      return (
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center gap-1 p-1">
              {translatePermission(rolePermissions?.[0]) || "Aucune permission"}{" "}
              {rolePermissions.length > 1
                ? `+${rolePermissions.length - 1}`
                : ""}
              <ChevronDown className="size-4" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="bg-slate-50 dark:bg-slate-900 max-h-80 overflow-y-auto w-80 md:w-[500px]">
            <ul className="flex flex-col gap-4">
              {rolePermissions.map((item) => {
                let currentPermission = permissions.find(
                  (permission) => item === permission.value
                );
                return (
                  <li
                    key={`${accessRole.id}-${item}`}
                    className="text-foreground font-semibold flex items-start gap-2"
                  >
                    <div className="bg-slate-300 dark:bg-slate-950 flex justify-center items-center p-1 rounded mt-1">
                      {icons[item] ?? <RiEyeFill size={16} />}
                    </div>
                    <div className="">
                      <h5>{translatePermission(item)}</h5>
                      <p className="text-slate-600 dark:text-slate-500 text-sm font-medium">
                        {currentPermission?.description.join(", ")}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </PopoverContent>
        </Popover>
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
      const accessRole = row.original;

      return (
        <div>
          <ActionColumn currentItem={accessRole} />
        </div>
      );
    },
  },
];
