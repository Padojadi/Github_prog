import { fetchUserDetails } from "@/lib/actions/users";
import React from "react";

export default async function Page({ params }: any) {
  const { id } = params;
  const res = await fetchUserDetails(id);
  const user = res?.data;
  return (
    <>
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-4">
          Détails de l'utilisateur : {user?.first_name + " " + user?.last_name}
        </h2>
        <div className="bg-white dark:bg-slate-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2">
                Email:
              </label>
              <p
                id="email"
                className="text-gray-900 dark:text-gray-100 text-base"
              >
                {user?.email}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2">
                Prénom:
              </label>
              <p
                id="first_name"
                className="text-gray-900 dark:text-gray-100 text-base"
              >
                {user?.first_name}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2">
                Nom:
              </label>
              <p
                id="last_name"
                className="text-gray-900 dark:text-gray-100 text-base"
              >
                {user?.last_name}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2">
                Phone:
              </label>
              <p
                id="phone"
                className="text-gray-900 dark:text-gray-100 text-base"
              >
                {user?.phone}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2">
                Organism ID:
              </label>
              <p
                id="organismId"
                className="text-gray-900 dark:text-gray-100 text-base"
              >
                {user?.organismId}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2">
                Role:
              </label>
              <p
                id="role"
                className="text-gray-900 dark:text-gray-100 text-base"
              >
                {user?.role}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2">
                Status:
              </label>
              <p id="status" className="text-green-600 text-base">
                {user?.status}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2">
                Created At:
              </label>
              <p
                id="createdAt"
                className="text-gray-900 dark:text-gray-100 text-base"
              >
                {user?.createdAt}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2">
                Updated At:
              </label>
              <p
                id="updatedAt"
                className="text-gray-900 dark:text-gray-100 text-base"
              >
                {user?.updatedAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
