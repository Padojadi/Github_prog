import { TPermission } from "../types";
import { permissions } from "./data";

export function translatePermission(permission: TPermission) {
  return permissions.find((item) => item.value === permission)?.label;
}
