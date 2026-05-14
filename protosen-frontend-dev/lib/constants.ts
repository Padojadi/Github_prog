
/**
 * Server-side requests can use INTERNAL endpoints (private network / localhost),
 * while browser requests keep using NEXT_PUBLIC endpoints.
 */
export const Backend_URL =
  process.env.BACKEND_URL_INTERNAL || process.env.NEXT_PUBLIC_BACKEND_URL;
export const BACKEND_URL_CONFERENCES =
  process.env.BACKEND_URL_CONFERENCES_INTERNAL ||
  process.env.NEXT_PUBLIC_BACKEND_URL_CONFERENCES;


export const JSON_DEMO_URL = "https://json-placeholder-xi.vercel.app";

export const PARTICIPANT_TOKEN_KEY = "participant_token"
// export const JSON_DEMO_URL = "http://localhost:3004";
