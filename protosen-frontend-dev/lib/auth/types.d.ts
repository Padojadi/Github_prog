export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  accessGroup: {
    id: string;
    name: string;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
  };
};
