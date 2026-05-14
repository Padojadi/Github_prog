"use client";
import { useSession } from "next-auth/react";

export default function useCurrentUser() {
  const session = useSession();
  const user = session?.data?.user;
  const normalizedRole = String(user?.role || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
  const isAdmin = normalizedRole === "admin";
  const isSuperAdmin =
    normalizedRole === "super_admin" || normalizedRole === "superadmin";
  const isUser = normalizedRole === "user";
  const fullName = user ? user?.first_name + " " + user?.last_name : "User";
  const currentUser = {
    ...user,
    fullName,
    isAdmin,
    isSuperAdmin,
    isUser,
  };
  return currentUser;
}
