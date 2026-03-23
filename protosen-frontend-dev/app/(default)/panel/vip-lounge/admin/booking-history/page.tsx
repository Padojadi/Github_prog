"use client";

import { useEffect, useState } from "react";
import { getVipBookingHistoryClient } from "@/features/vip-lounge/lib/apis-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type HistoryItem = {
  id: string;
  booking_id: string;
  action: string;
  old_status: string | null;
  new_status: string | null;
  notes: string | null;
  processed_by: string | null;
  created_at: string;
};

export default function VipBookingHistoryPage() {
  const [rows, setRows] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const res = await getVipBookingHistoryClient();
      if ("code" in res) {
        setError(res.message);
        setLoading(false);
        return;
      }
      setRows(res.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Chargement...</div>;
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historique des réservations</h1>
        <p className="text-sm text-muted-foreground">
          Journal des actions administratives sur les réservations VIP Lounge.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évènements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Réservation</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Changement</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.created_at).toLocaleString("fr-FR")}</TableCell>
                  <TableCell className="font-mono text-xs">{item.booking_id}</TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.old_status ? <Badge variant="outline">{item.old_status}</Badge> : null}
                      <span className="text-xs text-muted-foreground">→</span>
                      {item.new_status ? <Badge>{item.new_status}</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-sm truncate">{item.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
