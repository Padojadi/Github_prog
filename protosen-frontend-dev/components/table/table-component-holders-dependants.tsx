"use client";

import React from "react";

import {
  Column,
  Table,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { BsFilter } from "react-icons/bs";
import BadgeStatusComponent, {
  translateStatus,
  translateStatusBack,
} from "../ui/badgeStatusComponent";
import { Popover } from "@headlessui/react";
import DebouncedInput from "./DebouncedInput";
import TableActionsComponent from "./tableActionsComponent";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useQueryState } from "nuqs";

interface TableComponentHoldersDependantsProps {
  title: string;
  headers: { label: string; code: string }[];
  data: { [key: string]: any }[];
  actions?: {
    label:
      | "details"
      | "edit"
      | "delete"
      | "validate"
      | "password"
      | "unlock"
      | "delete-card";
    href: string;
    customAction?: (id: string) => Promise<any>;
    param?: string;
  }[];
  searchName: string;
}

const TableComponentHoldersDependants: React.FC<
  TableComponentHoldersDependantsProps
> = ({ title, headers, data, actions, searchName }) => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useQueryState(searchName);

  const currentUser = useCurrentUser();

  const columns = React.useMemo<ColumnDef<any, any>[]>(
    () =>
      headers
        .filter(
          (header) =>
            (header.code !== "organism" && currentUser.isUser) ||
            currentUser.isAdmin ||
            currentUser.isSuperAdmin
        ) // Hide organism column if user is not admin or superadmin
        .map((header) => {
          return {
            accessorKey:
              header.code === "organism" ? "organism.libelle" : header.code,
            cell: (info) => {
              if (header.code === "status" || header.code === "documentStage") {
                return (
                  <BadgeStatusComponent
                    status={info.getValue()}
                    rejectReason={info.row.original.rejectReason}
                  />
                );
              } else if (header.code === "expired") {
                return (
                  <BadgeStatusComponent
                    status={info.getValue() ? "Expiré" : "Actif"}
                  />
                );
              } else if (typeof info.getValue() === "boolean") {
                return info.getValue() ? "Oui" : "Non";
              } else {
                return info.getValue();
              }
            },
            header: header.label,
            enableColumnFilter:
              data.length && typeof data[0][header.code] == "boolean"
                ? false
                : true,
          };
        }),

    [headers, currentUser, data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div></div>
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          {title} ({table.getPrePaginationRowModel().rows.length})
        </h2>
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow rounded border border-slate-200 dark:border-slate-700 dark:bg-slate-50 w-1/3 focus:w-1/2 duration-300"
          placeholder="Rechercher dans toutes les colonnes ..."
        />
      </header>

      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  <th className="p-2 text-left flex items-start">N°</th>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="p-2 text-left"
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex justify-between items-start">
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                            {header.column.getCanFilter() ? (
                              <Popover className="relative">
                                <Popover.Button>
                                  <BsFilter size={20} />
                                </Popover.Button>
                                <Popover.Panel className="absolute z-10 shadow-md bg-white">
                                  <Filter
                                    column={header.column}
                                    table={table}
                                  />
                                </Popover.Panel>
                              </Popover>
                            ) : null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                  {actions && (
                    <th className="p-2 text-left" key={"actions"}>
                      <div className="font-semibold ">{"Actions"}</div>
                    </th>
                  )}
                </tr>
              ))}
            </thead>
            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
              {table.getRowModel().rows.map((row, index) => {
                return (
                  <tr key={row.id}>
                    <td className="p-2">{index + 1}</td>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td className="p-2" key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                    {actions && (
                      <td>
                        {
                          <TableActionsComponent
                            actions={actions}
                            item={row.original}
                          />
                        }
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="gap-2 flex items-center justify-end pb-2 pr-3">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Aller à la page :
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="rounded border p-2 w-12 shadow border-slate-300 dark:border-slate-700 dark:bg-slate-50"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="rounded border shadow border-slate-300 dark:border-slate-700 dark:bg-slate-50"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Voir {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value: any) => (
          <option value={translateStatus(value)} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(translateStatus(columnFilterValue as string) ?? "") as string}
        onChange={(value) => column.setFilterValue(translateStatusBack(value))}
        placeholder={`Rechercher... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}

export default TableComponentHoldersDependants;
