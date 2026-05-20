import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type {
	ExonerationCreateRequestPayload,
	ExonerationWorkflowAction,
	ExonerationWorkflowRecord,
} from "./workflow-types";

const STORE_FILE_PATH =
	process.env.EXONERATION_WORKFLOW_STORE_FILE ??
	"/tmp/protosen-exoneration-workflow.json";

const ensureStoreExists = async () => {
	const directory = path.dirname(STORE_FILE_PATH);
	await fs.mkdir(directory, { recursive: true });
	try {
		await fs.access(STORE_FILE_PATH);
	} catch {
		await fs.writeFile(STORE_FILE_PATH, "[]", "utf-8");
	}
};

const readStore = async (): Promise<ExonerationWorkflowRecord[]> => {
	await ensureStoreExists();
	const content = await fs.readFile(STORE_FILE_PATH, "utf-8");
	try {
		const parsed = JSON.parse(content);
		return Array.isArray(parsed) ? (parsed as ExonerationWorkflowRecord[]) : [];
	} catch {
		return [];
	}
};

const writeStore = async (rows: ExonerationWorkflowRecord[]) => {
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
	return `EXO-${y}${m}${d}-${serial}`;
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

export const listExonerationRequests = async () => {
	const rows = await readStore();
	return rows.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
};

export const createExonerationRequest = async (
	payload: ExonerationCreateRequestPayload,
	actor: { id: string; name: string; role: string }
) => {
	const now = new Date().toISOString();
	const rows = await readStore();
	const newRow: ExonerationWorkflowRecord = {
		id: randomUUID(),
		reference: buildReference(),
		dossierNumber: payload.dossierNumber,
		requestType: payload.requestType,
		subject: payload.subject,
		documentsCount: payload.documentsCount,
		status: "PENDING",
		statusReason: null,
		submittedAt: now,
		submittedBy: {
			id: actor.id,
			name: actor.name,
			role: actor.role,
		},
		dpctVerifiedAt: null,
		dpctVerifiedBy: null,
		customsValidatedAt: null,
		customsValidatedBy: null,
		emittedAt: null,
		emittedBy: null,
		transferredAt: null,
		transferredBy: null,
		updatedAt: now,
	};
	rows.push(newRow);
	await writeStore(rows);
	return newRow;
};

export const updateExonerationRequestStatus = async (
	id: string,
	action: ExonerationWorkflowAction,
	reason: string | undefined,
	actor: { id: string; name: string; role: string }
) => {
	const rows = await readStore();
	const rowIndex = rows.findIndex((row) => row.id === id);
	if (rowIndex < 0) throw new Error("DEMANDE_INTROUVABLE");

	const row = rows[rowIndex];
	const now = new Date().toISOString();
	const reviewer = isReviewerRole(actor.role);
	const isOwner = row.submittedBy.id === actor.id;

	switch (action) {
		case "VERIFY_DPCT":
			if (!reviewer) throw new Error("ACTION_NON_AUTORISEE");
			if (row.status !== "PENDING") throw new Error("TRANSITION_INVALIDE");
			rows[rowIndex] = {
				...row,
				status: "DPCT_VERIFIED",
				statusReason: null,
				dpctVerifiedAt: now,
				dpctVerifiedBy: actor.name,
				updatedAt: now,
			};
			break;
		case "VALIDATE_CUSTOMS":
			if (!reviewer) throw new Error("ACTION_NON_AUTORISEE");
			if (row.status !== "DPCT_VERIFIED") throw new Error("TRANSITION_INVALIDE");
			rows[rowIndex] = {
				...row,
				status: "CUSTOMS_VALIDATED",
				statusReason: null,
				customsValidatedAt: now,
				customsValidatedBy: actor.name,
				updatedAt: now,
			};
			break;
		case "EMIT":
			if (!reviewer) throw new Error("ACTION_NON_AUTORISEE");
			if (row.status !== "CUSTOMS_VALIDATED") throw new Error("TRANSITION_INVALIDE");
			rows[rowIndex] = {
				...row,
				status: "EMITTED",
				emittedAt: now,
				emittedBy: actor.name,
				updatedAt: now,
			};
			break;
		case "TRANSFER":
			if (!reviewer && !isOwner) throw new Error("ACTION_NON_AUTORISEE");
			if (row.status !== "EMITTED") throw new Error("TRANSITION_INVALIDE");
			rows[rowIndex] = {
				...row,
				status: "TRANSFERRED",
				transferredAt: now,
				transferredBy: actor.name,
				updatedAt: now,
			};
			break;
		case "REJECT":
			if (!reviewer) throw new Error("ACTION_NON_AUTORISEE");
			if (!["PENDING", "DPCT_VERIFIED", "CUSTOMS_VALIDATED"].includes(row.status)) {
				throw new Error("TRANSITION_INVALIDE");
			}
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
			if (!["PENDING", "DPCT_VERIFIED", "CUSTOMS_VALIDATED"].includes(row.status)) {
				throw new Error("TRANSITION_INVALIDE");
			}
			if (!reason?.trim()) throw new Error("MOTIF_REQUIS");
			rows[rowIndex] = {
				...row,
				status: "RETURNED",
				statusReason: reason.trim(),
				updatedAt: now,
			};
			break;
		case "RESUBMIT":
			if (!reviewer && !isOwner) throw new Error("ACTION_NON_AUTORISEE");
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
