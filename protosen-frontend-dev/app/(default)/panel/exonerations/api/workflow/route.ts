import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import {
	createExonerationRequest,
	listExonerationRequests,
} from "@/features/exonerations/lib/server-workflow-store";
import type { ExonerationCreateRequestPayload } from "@/features/exonerations/lib/workflow-types";

export const runtime = "nodejs";

const getSessionActor = async () => {
	const session = await getServerSession(authOptions);
	const user = session?.user;
	if (!user?.id) return null;

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

	const records = await listExonerationRequests();
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

	let payload: ExonerationCreateRequestPayload;
	try {
		payload = (await request.json()) as ExonerationCreateRequestPayload;
	} catch {
		return NextResponse.json({ message: "Payload invalide" }, { status: 400 });
	}

	if (
		!payload?.dossierNumber?.trim() ||
		!payload?.requestType?.trim() ||
		!payload?.subject?.trim()
	) {
		return NextResponse.json(
			{ message: "Veuillez renseigner tous les champs obligatoires." },
			{ status: 400 }
		);
	}

	const newRequest = await createExonerationRequest(payload, actor);
	return NextResponse.json({ data: newRequest }, { status: 201 });
}
