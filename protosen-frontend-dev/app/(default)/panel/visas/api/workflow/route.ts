import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { createVisaRequest, listVisaRequests } from "@/features/visas/lib/server-workflow-store";
import type { VisaCreateRequestPayload } from "@/features/visas/lib/workflow-types";

export const runtime = "nodejs";

const getSessionActor = async () => {
	const session = await getServerSession(authOptions);
	const user = session?.user;
	if (!user?.id) {
		return null;
	}

	return {
		id: user.id,
		name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "Utilisateur",
		role: user.role ?? "user",
	};
};

const isReviewerRole = (role: string) => {
	const normalized = String(role || "")
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/-/g, "_");
	return normalized === "admin" || normalized === "super_admin" || normalized === "superadmin";
};

export async function GET() {
	const actor = await getSessionActor();
	if (!actor) {
		return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
	}

	const records = await listVisaRequests();
	const visibleRecords = isReviewerRole(actor.role)
		? records
		: records.filter((row) => row.submittedBy.id === actor.id);
	return NextResponse.json({ data: visibleRecords }, { status: 200 });
}

export async function POST(request: Request) {
	const actor = await getSessionActor();
	if (!actor) {
		return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
	}

	let payload: VisaCreateRequestPayload;
	try {
		payload = (await request.json()) as VisaCreateRequestPayload;
	} catch {
		return NextResponse.json({ message: "Payload invalide" }, { status: 400 });
	}

	if (
		!payload?.applicantFirstName?.trim() ||
		!payload?.applicantLastName?.trim() ||
		!payload?.birthDate?.trim() ||
		!payload?.nationality?.trim() ||
		!payload?.passportNumber?.trim() ||
		!payload?.visaType?.trim()
	) {
		return NextResponse.json(
			{ message: "Veuillez renseigner tous les champs obligatoires." },
			{ status: 400 }
		);
	}

	const newRequest = await createVisaRequest(payload, actor);
	return NextResponse.json({ data: newRequest }, { status: 201 });
}
