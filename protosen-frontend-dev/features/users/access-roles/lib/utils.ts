import { TPermission } from "../types";
import { permissions } from "./data";

export function translatePermission(permission: TPermission) {
  if (!permission) {
    return "Permission inconnue";
  }
  return permissions.find((item) => item.value === permission)?.label || permission;
}
