import Link from "next/link";
import React from "react";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="flex flex-col bg-blue-600 text-white p-4">
        <span className="text-3xl font-bold">0</span>
        <span className="text-xl">Missions</span>
        <Link
          className="mt-2 text-blue-200 hover:text-blue-100 flex items-center"
          href="#"
        >
          <InfoIcon className="text-current" />
          <span className="ml-1">Plus de détails</span>
        </Link>
      </div>
      <div className="flex flex-col bg-green-600 text-white p-4">
        <span className="text-3xl font-bold">0</span>
        <span className="text-xl">Cartes Diplomatiques</span>
        <Link
          className="mt-2 text-green-20 0 hover:text-green-100 flex items-center"
          href="#"
        >
          <InfoIcon className="text-current" />
          <span className="ml-1">Plus de détails</span>
        </Link>
      </div>
      <div className="flex flex-col bg-yellow-400 text-white p-4">
        <span className="text-3xl font-bold">0</span>
        <span className="text-xl">Visas</span>
        <Link
          className="mt-2 text-yellow-200 hover:text-yellow-100 flex items-center"
          href="#"
        >
          <InfoIcon className="text-current" />
          <span className="ml-1">Plus de détails</span>
        </Link>
      </div>
      <div className="flex flex-col bg-orange-400 text-white p-4">
        <span className="text-3xl font-bold">0</span>
        <span className="text-xl">Exonérations</span>
        <Link
          className="mt-2 text-orange-200 hover:text-orange-100 flex items-center"
          href="#"
        >
          <InfoIcon className="text-current" />
          <span className="ml-1">Plus de détails</span>
        </Link>
      </div>
      <div className="flex flex-col bg-gray-600 text-white p-4">
        <span className="text-3xl font-bold">0</span>
        <span className="text-xl">Conférences</span>
        <Link
          className="mt-2 text-gray-200 hover:text-gray-100 flex items-center"
          href="#"
        >
          <InfoIcon className="text-current" />
          <span className="ml-1">Plus de détails</span>
        </Link>
      </div>
      <div className="flex flex-col bg-green-600 text-white p-4">
        <span className="text-3xl font-bold">0</span>
        <span className="text-xl">Immatriculations</span>
        <Link
          className="mt-2 text-green-200 hover:text-green-100 flex items-center"
          href="#"
        >
          <InfoIcon className="text-current" />
          <span className="ml-1">Plus de détails</span>
        </Link>
      </div>
      <div className="flex flex-col bg-gray-600 text-white p-4">
        <span className="text-3xl font-bold">0</span>
        <span className="text-xl">Salon Honneur</span>
        <Link
          className="mt-2 text-gray-200 hover:text-gray-100 flex items-center"
          href="#"
        >
          <InfoIcon className="text-current" />
          <span className="ml-1">Plus de détails</span>
        </Link>
      </div>
      <div className="flex flex-col bg-orange-400 text-white p-4">
        <span className="text-3xl font-bold">0</span>
        <span className="text-xl">Autres</span>
        <Link
          className="mt-2 text-orange-200 hover:text-orange-100 flex items-center"
          href="#"
        >
          <InfoIcon className="text-current" />
          <span className="ml-1">Plus de détails</span>
        </Link>
      </div>
    </div>
  );
}

function InfoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
