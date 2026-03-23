"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyVipAccessRequestsClient } from "@/features/vip-lounge/lib/apis-client";
import type { VipAccessRequest } from "@/features/vip-lounge/types";

export default function VipMyRequestsPage() {
  const [items, setItems] = useState<VipAccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const result = await getMyVipAccessRequestsClient();
      if ("data" in result) {
        setItems(result.data);
      }
      setLoading(false);
    };
    run();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Mes demandes VIP Lounge</h1>
        <p className="text-sm text-muted-foreground">
          Suivi des demandes d&apos;accès envoyées.
        </p>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>
                  {item.firstName} {item.lastName}
                </span>
                <Badge
                  variant={
                    item.status === "approved"
                      ? "default"
                      : item.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {item.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>
                {new Date(item.startTime).toLocaleString()} -{" "}
                {new Date(item.endTime).toLocaleString()}
              </p>
              <p>
                {item.organization} / {item.function}
              </p>
              {item.adminNotes ? <p>Note admin: {item.adminNotes}</p> : null}
            </CardContent>
          </Card>
        ))}
        {!items.length && (
          <p className="text-sm text-muted-foreground">
            Aucune demande enregistrée.
          </p>
        )}
      </div>
    </div>
  );
}
