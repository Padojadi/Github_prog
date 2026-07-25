import { TConferenceStatus } from "@/features/conferences/types";
import { TPermission } from "@/features/users/access-roles/types";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mapDate = (data: any, dateFields: string[]) => {
  dateFields.forEach((field) => {
    if (data[field]) {
      data[field] = new Date(data[field]);
    }
  });
  return data;
};

export function formatName(firstNames: string): string {
  const names = firstNames.trim().split(" ");

  if (names.length <= 1) return firstNames;

  const firstName = names[0];
  const restOfNames = names.slice(1).map((name) => `${name[0]}.`);

  return `${firstName} ${restOfNames.join(" ")}`.trim();
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytes" : sizes[i] ?? "Bytes"
  }`;
}

export function hasPermission(
  userPermission: string[],
  permission: TPermission[]
) {
  return permission.some((item) => userPermission.includes(item));
}

export function verifyConferenceStatus(
  conferenceStatus: TConferenceStatus,
  statuses: TConferenceStatus[]
) {
  return statuses.includes(conferenceStatus);
}

export function formatDateFnsLocale(date: string) {
  const dateToFormat = new Date(date)
  if (!dateToFormat) date
  return format(dateToFormat, "PPP", { locale: fr })
}

export function formatDateFnsTicket(date: string) {
  const dateToFormat = new Date(date)
  if (!dateToFormat) date
  return format(dateToFormat, "d MMM yyyy", { locale: fr })
}

export function formatDateFnsTimelineLocale(date: string) {
  const dateToFormat = new Date(date)
  if (!dateToFormat) date
  return format(dateToFormat, "d MMM yyyy", { locale: fr })
}
