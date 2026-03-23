import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-950 text-foreground rounded-lg shadow-sm border border-border p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
        <Skeleton className="w-28 h-6" />
        <Skeleton className="w-36 h-8" />
      </div>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border">
              <TableHead className="font-medium p-4 cursor-pointer hover:bg-muted/80 transition-colors">
                <Skeleton className="w-full h-8" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-muted/30 transition-colors cursor-default border-border">
              <TableCell>
                <Skeleton className="w-full h-8" />
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-muted/30 transition-colors cursor-default border-border">
              <TableCell>
                <Skeleton className="w-full h-8" />
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-muted/30 transition-colors cursor-default border-border">
              <TableCell>
                <Skeleton className="w-full h-8" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
