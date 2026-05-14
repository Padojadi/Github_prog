"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronsRight,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock registration data
export type RegistrationStatus =
  | "PROCESSING"
  | "PAYMENT_PENDING"
  | "VALIDATED"
  | "REJECTED";

type NewDataTableProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  dataName: string;
  onExport?: (filteredData: TData[]) => void;
};

export default function NewDataTable<TData, TValue>({
  data,
  columns,
  dataName,
  onExport,
}: NewDataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useQueryState("search");

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

  const mapStatusToStatusBadge = (status: RegistrationStatus) => {
    const statusMap: Record<RegistrationStatus, any> = {
      PROCESSING: "CREATED",
      PAYMENT_PENDING: "PENDING",
      VALIDATED: "CONFIRMED",
      REJECTED: "REJECTED",
    };

    return statusMap[status];
  };

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="border-border" key={headerGroup.id}>
              <TableHead className="font-medium cursor-pointer hover:bg-muted/80 transition-colors">
                N°
              </TableHead>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "font-medium",
                      header.id === "actions"
                        ? "text-right"
                        : "cursor-pointer hover:bg-muted/80 transition-colors"
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length === 0 ? (
            <TableRow className="border-border">
              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-8 text-muted-foreground"
              >
                Aucune inscription trouvée
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-muted/30 transition-colors cursor-default border-border"
              >
                <TableCell className="text-xs">{index + 1}</TableCell>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                {/* 
                <TableCell className="font-medium">
                  {registration.paymentAmount} €
                </TableCell>
                <TableCell>{registration.passType}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(registration.id)}
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    {registration.status === "PROCESSING" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-success hover:text-success hover:bg-success/10"
                          title="Quick Validate"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-error hover:text-error hover:bg-error/10"
                          title="Quick Reject"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell> */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Affichage de {table.getRowCount()} sur{" "}
            {table.getPrePaginationRowModel().rows.length} {dataName}
          </div>
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onExport(
                  table
                    .getFilteredRowModel()
                    .rows.map((row) => row.original)
                )
              }
              disabled={table.getFilteredRowModel().rows.length === 0}
            >
              <Download className="size-4 mr-2" />
              Exporter CSV
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="size-4" />
          </Button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Aller à la page :
            <Input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border border-border w-12 shadow"
            />
          </span>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="border-border w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  Voir {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
