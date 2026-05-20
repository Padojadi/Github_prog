import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { updateRegistrationRequestStatus } from "@/features/registrations/lib/server-workflow-store";
import type { RegistrationWorkflowAction } from "@/features/registrations/lib/workflow-types";

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

const resolveStatusCode = (errorCode: string) => {
	if (errorCode === "MOTIF_REQUIS" || errorCode === "ACTION_INVALIDE") return 400;
	if (errorCode === "ACTION_NON_AUTORISEE") return 403;
	if (errorCode === "DEMANDE_INTROUVABLE") return 404;
	if (errorCode === "TRANSITION_INVALIDE") return 409;
	return 500;
};

export async function PATCH(
	request: Request,
	context: { params: { id: string } }
) {
	const actor = await getSessionActor();
	if (!actor) {
		return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
	}

	const id = context.params.id;
	if (!id) {
		return NextResponse.json({ message: "Identifiant requis" }, { status: 400 });
	}

	let body: { action?: RegistrationWorkflowAction; reason?: string };
	try {
		body = (await request.json()) as {
			action?: RegistrationWorkflowAction;
			reason?: string;
		};
	} catch {
		return NextResponse.json({ message: "Payload invalide" }, { status: 400 });
	}

	if (!body.action) {
		return NextResponse.json({ message: "Action requise" }, { status: 400 });
	}

	try {
		const updated = await updateRegistrationRequestStatus(
			id,
			body.action,
			body.reason,
			actor
		);
		return NextResponse.json({ data: updated }, { status: 200 });
	} catch (error) {
		const code = error instanceof Error ? error.message : "UNKNOWN_ERROR";
		return NextResponse.json({ message: code }, { status: resolveStatusCode(code) });
	}
}
