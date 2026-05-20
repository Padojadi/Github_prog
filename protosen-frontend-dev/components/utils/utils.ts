import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfigFile from "@/tailwind.config";
import { InputComponentProps } from "../inputComponent";
import { IFormMeta } from "@/lib/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export const tailwindConfig = resolveConfig(tailwindConfigFile) as any;

export const getBreakpointValue = (value: string): number => {
  const screenValue = tailwindConfig.theme.screens[value];
  return +screenValue.slice(0, screenValue.indexOf("px"));
};

export const getBreakpoint = () => {
  let currentBreakpoint;
  let biggestBreakpointValue = 0;
  let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  for (const breakpoint of Object.keys(tailwindConfig.theme.screens)) {
    const breakpointValue = getBreakpointValue(breakpoint);
    if (
      breakpointValue > biggestBreakpointValue &&
      windowWidth >= breakpointValue
    ) {
      biggestBreakpointValue = breakpointValue;
      currentBreakpoint = breakpoint;
    }
  }
  return currentBreakpoint;
};

export const hexToRGB = (h: string): string => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = parseInt(`0x${h[1]}${h[1]}`);
    g = parseInt(`0x${h[2]}${h[2]}`);
    b = parseInt(`0x${h[3]}${h[3]}`);
  } else if (h.length === 7) {
    r = parseInt(`0x${h[1]}${h[2]}`);
    g = parseInt(`0x${h[3]}${h[4]}`);
    b = parseInt(`0x${h[5]}${h[6]}`);
  }
  return `${+r},${+g},${+b}`;
};

export const formatValue = (value: number): string =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

export const formatThousands = (value: number): string =>
  Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

// function that get all the name of the input and return an array of string
export const getNames = (data: InputComponentProps[]): string[] =>
  data.map((item) => item.name as string);

// another function that use getNames an take multiple array of InputComponentProps
export const getNamesFromMultipleArray = (
  ...data: InputComponentProps[][]
): string[] => data.map((item) => getNames(item)).flat();

// function that create an object base on the inputNames and the formData's values
export const createObject = (inputNames: string[], formData: FormData) => {
  const object: any = {};
  inputNames.forEach((name) => {
    object[name] = formData.get(name);
  });
  return object;
};

export const getValidationSchema = (formMeta: IFormMeta[]) => {
  const schema: any = {};
  formMeta.forEach((item) => {
    if (item.validation) {
      schema[item.name] = item.validation;
    }
  });
  return schema;
};

export function convertDate(date: string, lang = "en") {
  if (!date) {
    return "";
  }
  // Create new Date object with the input date string
  const inputDate = new Date(date);

  // Extract the year, month, and day from the input
  const year = inputDate.getFullYear();
  const month = inputDate.getMonth() + 1; // Months are zero-based, so we need to add 1
  const day = inputDate.getDate();

  let formattedDate = "";

  if (lang === "fr") {
    // Create a formatted date string in the "DD/MM/YYYY" format
    formattedDate = `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  } else {
    // Create a formatted date string in the "YYYY-MM-DD" format
    formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  }

  return formattedDate;
}

export function convertDate2(date: string, lang = "en") {
  if (!date) {
    return "";
  }
  // Create new Date object with the input date string
  const inputDate = new Date(date);

  // Extract the year, month, and day from the input
  const year = inputDate.getFullYear();
  const month = inputDate.getMonth() + 1; // Months are zero-based, so we need to add 1
  const day = inputDate.getDate();

  let formattedDate = "";

  if (lang === "fr") {
    // Create a formatted date string in the "DD/MM/YYYY" format
    formattedDate = `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year}`;
  } else {
    // Create a formatted date string in the "YYYY-MM-DD" format
    formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  }

  return formattedDate;
}

export function convertDateToLocalString(date: string, split = false) {
  if (!date) {
    return "";
  }
  if (split) {
    return new Date(date).toLocaleString().split(" ")[0];
  }
  // Create new Date object with the input date string
  return new Date(date).toLocaleString();
}
