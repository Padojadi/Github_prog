"use client";
import { useSession } from "next-auth/react";

export default function useCurrentUser() {
  const session = useSession();
  const user = session?.data?.user;
  const isAdmin = user?.role === "admin";
  const isSuperAdmin = user?.role === "super_admin";
  const isUser = user?.role === "user";
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
