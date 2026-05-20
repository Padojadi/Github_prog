// Capitalize first letter of a string
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

// Check if object or array is empty
export const isEmpty = (obj: object | any[]): boolean => {
  return Object.keys(obj).length === 0;
};

// function to check if the form value is a props of errors object
export function checkError(name: string, errors: any) {
  if (errors && !isEmpty(errors)) {
    if (name in errors) {
      return errors[name];
    }
  }
  return null;
}

export function extractPathFromUrl(
  urlString: string,
  prefix: string
): string | null {
  const regex = new RegExp(`\/${prefix}\/([^?]+)`);
  const match = urlString.match(regex);
  if (match && match[1]) {
    const path = match[1].replace(/^\//, ""); // Remove leading slash if present
    return `${prefix}/${path}`;
  } else {
    console.error("Invalid URL format");
    return null;
  }
}

// get role name base on role code
export function getRoleName(role: string | undefined) {
  if (!role) return "Unknown";
  switch (role) {
    case "super_admin":
      return "Super Administrateur";
    case "admin":
      return "Administrateur";
    case "user":
      return "Utilisateur";
    default:
      return "Unknown";
  }
}
