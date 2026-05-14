"use client";
import { z } from "zod";

const createConferenceSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Le prénom doit comporter au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
    // structure: z
    //   .string()
    //   .min(2, "La structure doit comporter au moins 2 caractères"),
    job: z.string().min(2, "La fonction doit comporter au moins 2 caractères"),
    phone: z
      .string()
      .min(10, "Le numéro de téléphone doit comporter au moins 10 caractères"),
    email: z.string().email("Adresse email invalide"),
    matriculeNumber: z.string().min(1, "Le numéro de matricule est requis"),

    // Conference Info
    title: z.string().min(5, "Le titre doit comporter au moins 5 caractères"),
    themeDoc: z
      .unknown({
        message: "Veuillez ajouter un fichier",
      })
      .nullable(),
    budgetDoc: z
      .unknown({
        message: "Veuillez ajouter un fichier",
      })
      .nullable(),
    startDate: z.coerce
      .date()
      .min(new Date(), "La date de début ne doit pas être avant aujourd'hui"),
    endDate: z.coerce.date(),
    location: z.string().min(2, "Le lieu doit comporter au moins 2 caractères"),
    description: z.unknown({
      required_error: "La description de la conférence est requise",
    }),
  })
  .refine((values) => values.startDate.getTime() < values.endDate.getTime(), {
    message: "La date de fin ne peut pas être avant la date de début",
    path: ["endDate"],
  });

const conferenceRejectionSchema = z.object({
  reason: z.string().min(1, "La raison de rejet est requise"),
});

const conferenceCreationSchema = z.object({
  id: z.string().min(1, "L'id de la conférence est requis"),
  description: z
    .string({
      required_error: "La description est requise",
      invalid_type_error: "Le description est requis",
    })
    .min(1, "La description de la conférence est requise"),
  accomodationIds: z
    .array(z.string())
    // .min(1, "Veuillez sélectioner un hébergement"),
});

type TCreateConferenceSchema = z.infer<typeof createConferenceSchema>;
type TConferenceRejectionSchema = z.infer<typeof conferenceRejectionSchema>;
type TConferenceCreationSchema = z.infer<typeof conferenceCreationSchema>;

const createConferenceDefaultValues: TCreateConferenceSchema = {
  firstName: "",
  lastName: "",
  // structure: "",
  job: "",
  email: "",
  themeDoc: null,
  budgetDoc: null,
  startDate: new Date(),
  endDate: new Date(),
  matriculeNumber: "",
  phone: "",
  title: "",
  location: "",
  description: [{ type: "p", children: [{ text: "" }] }],
};

const conferenceRejectionDefaultValues: TConferenceRejectionSchema = {
  reason: "",
};

export {
  createConferenceSchema,
  type TCreateConferenceSchema,
  createConferenceDefaultValues,
  conferenceRejectionSchema,
  type TConferenceRejectionSchema,
  conferenceRejectionDefaultValues,
  conferenceCreationSchema,
  type TConferenceCreationSchema,
};
