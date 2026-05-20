import { z } from "zod";

export const registrationFormSchema = z
  .object({
    firstName: z.string().min(2, { message: "Le prénom est requis" }),
    lastName: z.string().min(2, { message: "Le nom est requis" }),
    gender: z.enum(["MALE", "FEMALE"]),
    conferenceParticipantTypeId: z
      .string()
      .min(1, { message: "La catégorie de participant est requise" }),
    organisation: z
      .string()
      .min(2, { message: "L'entreprise ou l'organisation est requise" }),
    functionId: z.string().min(2, { message: "La fonction est requise" }),
    customFunction: z.string().optional(),
    phone: z
      .string()
      .min(8, { message: "Le numéro de téléphone valide est requis" }),
    email: z.string().email({ message: "L'email n'est pas valide" }),
    address: z.string().min(5, { message: "L'adresse est requise" }),
    postalCode: z.string().min(4, { message: "Le code postal est requis" }),
    city: z.string().min(2, { message: "La ville est requise" }),
    country: z.string().min(2, { message: "Le pays est requis" }),
    identityType: z.enum(["passport", "national"]),
    identityNumber: z
      .string()
      .min(5, { message: "Le numéro d'identité est requis" }),
    identityIssueDate: z.coerce.date({
      required_error: "La date de délivrance est requise",
    }),
    dateOfBirth: z.coerce.date({
      required_error: "La date de naissance est requise",
    }),
    nationality: z.string().min(2, { message: "La nationalité est requise" }),
    // transportation: z.string().optional(),
    // sessions: z.array(z.string()).nonempty({ message: "Sélectionnez au moins une session" }),
    needsSupport: z.enum(["oui", "non"]),
    supportOptionIds: z.array(z.string()).optional(),
    visaNeeded: z.enum(["oui", "non"]),
    accommodationNeeded: z.enum(["oui", "non"]),
    conferenceAccommodationId: z.string().optional(),
    addCustomAccomodation: z.enum(["oui", "non"]),
    customAccommodation: z.string().optional(),
    // transportationNeeded: z.enum(["oui", "non"]),
    ticketId: z.string({ required_error: "Sélectionnez un ticket" }),
    avatarUrl: z.unknown({
      message: "Veuillez ajouter une photo",
    }),
    acceptTerms: z.literal(true, {
      errorMap: () => ({
        message: "Vous devez accepter les conditions d'utilisation",
      }),
    }),
    // gdprAccepted: z.literal(true, {
    //   errorMap: () => ({ message: "Vous devez accepter la politique de confidentialité" }),
    // }),
  })
  .refine(
    (values) =>
      values.accommodationNeeded === "non" ||
      (values.accommodationNeeded === "oui" &&
        (values.conferenceAccommodationId?.length !== 0 ||
          values.addCustomAccomodation === "oui")),
    {
      message: "Veuillez sélectionner un hébergement",
      path: ["conferenceAccommodationId", "accommodationNeeded"],
    }
  )
  .refine(
    (values) =>
      values.functionId !== "autre" ||
      (values.functionId === "autre" && values.customFunction?.length !== 0),
    {
      message: "Veuillez renseigner votre fonction",
      path: ["customFunction", "functionId"],
    }
  )
  .refine(
    (values) =>
      values.needsSupport === "non" ||
      (values.needsSupport === "oui" &&
        values.supportOptionIds &&
        values.supportOptionIds.length > 0),
    {
      message: "Veuillez sélectionner au moins une catégorie de prise en charge",
      path: ["supportOptionIds", "needsSupport"],
    }
  )
  .refine(
    (values) =>
      values.addCustomAccomodation === "non" ||
      (values.addCustomAccomodation === "oui" &&
        values.customAccommodation?.length !== 0),
    {
      message: "Veuillez entrer les détails de votre hébergement personnalisé",
      path: ["addCustomAccomodation", "customAccommodation"],
    }
  );

export type RegistrationForm = z.infer<typeof registrationFormSchema>;
