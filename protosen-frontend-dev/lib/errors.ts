import { d } from "./dictionary";

export type ErrorResponse = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export class ServerActionError extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ServerActionError";
    this.code = code;
    this.details = details;
  }
}

export function createSafeError(error: unknown): ErrorResponse {
  if (error instanceof ServerActionError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  // Handle other known error types
  if (error instanceof Error) {
    return {
      code: "UNKNOWN_ERROR",
      message: error?.message || "Une erreur inconnue s'est produite",
      details: {
        // Only include non-sensitive information
        type: error.name,
      },
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "Une erreur inconnue s'est produite",
  };
}

interface TransformedError {
  field: string;
  label: string;
  message: string;
}

const genericErrorTranslations: Record<string, string> = {
  required_error: "Ce champ est obligatoire",
  invalid_type_error: "Type de données invalide",
  too_small: "La valeur est trop courte",
  too_big: "La valeur est trop longue",
  invalid_string: "Veuillez sélectionner une valeur",
  "Invalid date": "Veuillez sélectionner une date",
};

export function transformZodErrorsGeneric(
  fieldErrors: Record<string, string[] | undefined>
): TransformedError[] {
  const transformedErrors: TransformedError[] = [];

  Object.entries(fieldErrors).forEach(([field, errors]) => {
    if (errors && errors.length > 0) {
      // Get French translation for the field, fallback to original field name
      const label = d[field as keyof typeof d] || field;

      // Use the first error message
      const rawMessage = errors[0];

      // Try to map to generic error translations
      const message =
        genericErrorTranslations[rawMessage] ||
        rawMessage ||
        "Une erreur est survenue";

      transformedErrors.push({
        field,
        label,
        message,
      });
    }
  });

  return transformedErrors;
}
