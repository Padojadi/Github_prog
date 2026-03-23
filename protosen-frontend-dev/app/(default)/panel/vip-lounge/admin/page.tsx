"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	getVipAccessRequestsAdminClient,
	getVipBookingsAdminClient,
	updateVipAccessRequestStatusClient,
	updateVipBookingStatusClient,
} from "@/features/vip-lounge/lib/apis-client";
import type { VipAccessRequest, VipBooking } from "@/features/vip-lounge/types";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
type AccessStatus = "pending" | "approved" | "rejected";

const bookingStatuses: BookingStatus[] = [
	"pending",
	"confirmed",
	"cancelled",
	"completed",
];
const accessStatuses: AccessStatus[] = ["pending", "approved", "rejected"];

export default function VipLoungeAdminPage() {
	const [bookings, setBookings] = useState<VipBooking[]>([]);
	const [requests, setRequests] = useState<VipAccessRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
	const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
	const [notes, setNotes] = useState<Record<string, string>>({});

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			const [bookingRes, requestRes] = await Promise.all([
				getVipBookingsAdminClient(),
				getVipAccessRequestsAdminClient(),
			]);
			if ("status" in bookingRes && bookingRes.status === "success") {
				setBookings(bookingRes.data);
			} else {
				toast.error(bookingRes.message);
			}
			if ("status" in requestRes && requestRes.status === "success") {
				setRequests(requestRes.data);
			} else {
				toast.error(requestRes.message);
			}
			setLoading(false);
		};
		load();
	}, []);

	const pendingBookings = useMemo(
		() => bookings.filter((item) => item.status === "pending"),
		[bookings],
	);
	const pendingRequests = useMemo(
		() => requests.filter((item) => item.status === "pending"),
		[requests],
	);

	const updateBooking = async (booking: VipBooking, status: BookingStatus) => {
		setUpdatingBookingId(booking.id);
		const res = await updateVipBookingStatusClient(
			booking.id,
			status,
			notes[booking.id] || undefined,
		);
		if ("status" in res && res.status === "success") {
			setBookings((prev) =>
				prev.map((item) => (item.id === booking.id ? res.data : item)),
			);
			toast.success("Réservation mise à jour.");
		} else {
			toast.error(res.message);
		}
		setUpdatingBookingId(null);
	};

	const updateRequest = async (request: VipAccessRequest, status: AccessStatus) => {
		setUpdatingRequestId(request.id);
		const res = await updateVipAccessRequestStatusClient(
			request.id,
			status,
			notes[request.id] || undefined,
		);
		if ("status" in res && res.status === "success") {
			setRequests((prev) =>
				prev.map((item) => (item.id === request.id ? res.data : item)),
			);
			toast.success("Demande d'accès mise à jour.");
		} else {
			toast.error(res.message);
		}
		setUpdatingRequestId(null);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Administration VIP Lounge</h1>
				<p className="text-sm text-muted-foreground">
					Traitez les réservations et les demandes d&apos;accès du salon VIP.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader>
						<CardTitle>Réservations</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<p>Total: {bookings.length}</p>
						<p>En attente: {pendingBookings.length}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Demandes d&apos;accès</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<p>Total: {requests.length}</p>
						<p>En attente: {pendingRequests.length}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Historique</CardTitle>
					</CardHeader>
					<CardContent>
						<Button asChild variant="outline">
							<Link href="/panel/vip-lounge/admin/booking-history">
								Voir l&apos;historique des actions
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Réservations VIP</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{loading ? (
						<p className="text-sm text-muted-foreground">Chargement...</p>
					) : bookings.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Aucune réservation à traiter.
						</p>
					) : (
						bookings.map((booking) => (
							<div key={booking.id} className="border rounded p-3 space-y-3">
								<div className="flex justify-between gap-3 flex-wrap">
									<div>
										<p className="font-semibold">{booking.lounge?.name || "Salon"}</p>
										<p className="text-xs text-muted-foreground">
											{new Date(booking.startTime).toLocaleString()} -{" "}
											{new Date(booking.endTime).toLocaleString()}
										</p>
									</div>
									<Badge variant="outline">{booking.status}</Badge>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<Input
										placeholder="Note admin"
										value={notes[booking.id] || ""}
										onChange={(e) =>
											setNotes((prev) => ({ ...prev, [booking.id]: e.target.value }))
										}
									/>
									<div className="flex gap-2 flex-wrap">
										{bookingStatuses.map((status) => (
											<Button
												key={status}
												variant={status === booking.status ? "default" : "outline"}
												size="sm"
												disabled={updatingBookingId === booking.id}
												onClick={() => updateBooking(booking, status)}
											>
												{status}
											</Button>
										))}
									</div>
								</div>
							</div>
						))
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Demandes d&apos;accès VIP</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{loading ? (
						<p className="text-sm text-muted-foreground">Chargement...</p>
					) : requests.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Aucune demande d&apos;accès à traiter.
						</p>
					) : (
						requests.map((request) => (
							<div key={request.id} className="border rounded p-3 space-y-3">
								<div className="flex justify-between gap-3 flex-wrap">
									<div>
										<p className="font-semibold">
											{request.firstName} {request.lastName}
										</p>
										<p className="text-xs text-muted-foreground">
											{request.organization} - {request.function}
										</p>
									</div>
									<Badge variant="outline">{request.status}</Badge>
								</div>
								<Textarea
									placeholder="Note admin"
									value={notes[request.id] || ""}
									onChange={(e) =>
										setNotes((prev) => ({ ...prev, [request.id]: e.target.value }))
									}
								/>
								<div className="flex gap-2 flex-wrap">
									{accessStatuses.map((status) => (
										<Button
											key={status}
											variant={status === request.status ? "default" : "outline"}
											size="sm"
											disabled={updatingRequestId === request.id}
											onClick={() => updateRequest(request, status)}
										>
											{status}
										</Button>
									))}
								</div>
							</div>
						))
					)}
				</CardContent>
			</Card>
		</div>
	);
}
