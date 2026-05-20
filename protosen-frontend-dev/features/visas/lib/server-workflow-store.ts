import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type {
	VisaCreateRequestPayload,
	VisaWorkflowAction,
	VisaWorkflowRecord,
} from "./workflow-types";

const STORE_FILE_PATH =
	process.env.VISA_WORKFLOW_STORE_FILE ?? "/tmp/protosen-visa-workflow.json";

const ensureStoreExists = async () => {
	const directory = path.dirname(STORE_FILE_PATH);
	await fs.mkdir(directory, { recursive: true });
	try {
		await fs.access(STORE_FILE_PATH);
	} catch {
		await fs.writeFile(STORE_FILE_PATH, "[]", "utf-8");
	}
};

const readStore = async (): Promise<VisaWorkflowRecord[]> => {
	await ensureStoreExists();
	const content = await fs.readFile(STORE_FILE_PATH, "utf-8");
	try {
		const parsed = JSON.parse(content);
		return Array.isArray(parsed) ? (parsed as VisaWorkflowRecord[]) : [];
	} catch {
		return [];
	}
};

const writeStore = async (rows: VisaWorkflowRecord[]) => {
	await ensureStoreExists();
	const tmpFile = `${STORE_FILE_PATH}.tmp`;
	await fs.writeFile(tmpFile, JSON.stringify(rows, null, 2), "utf-8");
	await fs.rename(tmpFile, STORE_FILE_PATH);
};

const buildReference = () => {
	const date = new Date();
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	const serial = Math.floor(Math.random() * 9000 + 1000);
	return `VISA-${y}${m}${d}-${serial}`;
};

const normalizeRole = (role: string) =>
	String(role || "")
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/-/g, "_");

const isReviewerRole = (role: string) => {
	const normalized = normalizeRole(role);
	return normalized === "admin" || normalized === "super_admin" || normalized === "superadmin";
};

export const listVisaRequests = async () => {
	const rows = await readStore();
	return rows.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
};

export const createVisaRequest = async (
	payload: VisaCreateRequestPayload,
	actor: { id: string; name: string; role: string }
) => {
	const now = new Date().toISOString();
	const rows = await readStore();
	const newRow: VisaWorkflowRecord = {
		id: randomUUID(),
		reference: buildReference(),
		applicantFirstName: payload.applicantFirstName,
		applicantLastName: payload.applicantLastName,
		birthDate: payload.birthDate,
		nationality: payload.nationality,
		passportNumber: payload.passportNumber,
		visaType: payload.visaType,
		documentsCount: payload.documentsCount,
		status: "PENDING",
		statusReason: null,
		submittedAt: now,
		submittedBy: {
			id: actor.id,
			name: actor.name,
			role: actor.role,
		},
		acceptedAt: null,
		acceptedBy: null,
		issuedAt: null,
		issuedBy: null,
		notifiedAt: null,
		withdrawnAt: null,
		withdrawnBy: null,
		updatedAt: now,
	};

	rows.push(newRow);
	await writeStore(rows);
	return newRow;
};

export const updateVisaRequestStatus = async (
	id: string,
	action: VisaWorkflowAction,
	reason: string | undefined,
	actor: { id: string; name: string; role: string }
) => {
	const rows = await readStore();
	const rowIndex = rows.findIndex((row) => row.id === id);
	if (rowIndex < 0) {
		throw new Error("DEMANDE_INTROUVABLE");
	}

	const row = rows[rowIndex];
	const now = new Date().toISOString();
	const reviewer = isReviewerRole(actor.role);

	switch (action) {
		case "ACCEPT":
			if (!reviewer) throw new Error("ACTION_NON_AUTORISEE");
			if (row.status !== "PENDING") throw new Error("TRANSITION_INVALIDE");
			rows[rowIndex] = {
				...row,
				status: "ACCEPTED",
				statusReason: null,
				acceptedAt: now,
				acceptedBy: actor.name,
				updatedAt: now,
			};
			break;
		case "REJECT":
			if (!reviewer) throw new Error("ACTION_NON_AUTORISEE");
			if (row.status !== "PENDING") throw new Error("TRANSITION_INVALIDE");
			if (!reason?.trim()) throw new Error("MOTIF_REQUIS");
			rows[rowIndex] = {
				...row,
				status: "REJECTED",
				statusReason: reason.trim(),
				updatedAt: now,
			};
			break;
		case "RETURN":
			if (!reviewer) throw new Error("ACTION_NON_AUTORISEE");
			if (row.status !== "PENDING") throw new Error("TRANSITION_INVALIDE");
			if (!reason?.trim()) throw new Error("MOTIF_REQUIS");
			rows[rowIndex] = {
				...row,
				status: "RETURNED",
				statusReason: reason.trim(),
				updatedAt: now,
			};
			break;
		case "EMIT":
			if (!reviewer) throw new Error("ACTION_NON_AUTORISEE");
			if (row.status !== "ACCEPTED") throw new Error("TRANSITION_INVALIDE");
			rows[rowIndex] = {
				...row,
				status: "EMITTED",
				issuedAt: now,
				issuedBy: actor.name,
				notifiedAt: now,
				updatedAt: now,
			};
			break;
		case "WITHDRAW":
			if (row.status !== "EMITTED") throw new Error("TRANSITION_INVALIDE");
			const isOwner = row.submittedBy.id === actor.id;
			if (!reviewer && !isOwner) throw new Error("ACTION_NON_AUTORISEE");
			rows[rowIndex] = {
				...row,
				status: "WITHDRAWN",
				withdrawnAt: now,
				withdrawnBy: actor.name,
				updatedAt: now,
			};
			break;
		case "RESUBMIT":
			const canResubmit = row.submittedBy.id === actor.id || reviewer;
			if (!canResubmit) throw new Error("ACTION_NON_AUTORISEE");
			if (row.status !== "RETURNED") throw new Error("TRANSITION_INVALIDE");
			rows[rowIndex] = {
				...row,
				status: "PENDING",
				statusReason: null,
				updatedAt: now,
			};
			break;
		default:
			throw new Error("ACTION_INVALIDE");
	}

	await writeStore(rows);
	return rows[rowIndex];
};
