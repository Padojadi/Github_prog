import { ErrorResponse } from "@/lib/errors";
import {
  getConferenceById,
  getConferenceByIdPublic,
  getConferences,
  getConferencesPublic,
} from "../lib/apis-client";

export type TGetConferencesResponse = Exclude<
  Awaited<ReturnType<typeof getConferences>>,
  ErrorResponse
>;
export type TGetConferencesByIdResponse = Exclude<
  Awaited<ReturnType<typeof getConferenceById>>,
  ErrorResponse
>;
export type TGetConferencesPublicResponse = Exclude<
  Awaited<ReturnType<typeof getConferencesPublic>>,
  ErrorResponse
>;
export type TGetConferenceByIdPublicResponse = Exclude<
  Awaited<ReturnType<typeof getConferenceByIdPublic>>,
  ErrorResponse
>;
