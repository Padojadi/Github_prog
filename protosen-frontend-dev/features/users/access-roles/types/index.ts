import { permissions } from "../lib/data";

export type AccessRole = {
  id: string;
  name: string;
  permissions: TPermission[];
  editable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TPermission = (typeof permissions)[number]["value"];
