"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CalendarRange, ClipboardCheck, LayoutDashboard, ListChecks } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function VipLoungeHomePage() {
  const user = useCurrentUser();
  const canManage = useMemo(
    () => (user.accessGroup?.permissions || []).includes("MANAGE_VIP_LOUNGE"),
    [user.accessGroup?.permissions],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">VIP Lounge</h1>
        <p className="text-sm text-muted-foreground">
          Réservations, demandes d&apos;accès et administration des salons VIP.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Salons
            </CardTitle>
            <CardDescription>Consulter les salons disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/panel/vip-lounge/lounges">Voir les salons</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              Réservations
            </CardTitle>
            <CardDescription>Mes réservations de salons VIP</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/panel/vip-lounge/bookings">Mes réservations</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Accès VIP
            </CardTitle>
            <CardDescription>Soumettre une demande d&apos;accès</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/panel/vip-lounge/access-request">Nouvelle demande</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Mes demandes
            </CardTitle>
            <CardDescription>Suivre l&apos;état de mes demandes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/panel/vip-lounge/my-requests">Suivre</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Administration VIP Lounge</CardTitle>
            <CardDescription>
              Gérer les salons, valider les réservations et traiter les demandes d&apos;accès.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/panel/vip-lounge/admin">Ouvrir le tableau admin</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/panel/vip-lounge/admin/booking-history">Historique des bookings</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
