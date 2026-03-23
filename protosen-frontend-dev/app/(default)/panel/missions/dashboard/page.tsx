import { JSON_DEMO_URL } from "@/lib/constants";
import Link from "next/link";
import React from "react";

type Mission = {
  id: number;
  name: string;
  link: string;
  number: number;
  bgColor: string;
};

export default async function MissionsDashboard() {
  const data: Mission[] = await fetch(JSON_DEMO_URL + "/missions")
    .then((response) => response.json())
    .catch((error) => console.error(error));

  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((item) => (
        <div
          key={item.id}
          className={`flex flex-col text-white p-4 ${item.bgColor}`}
        >
          <span className="text-3xl font-bold">{item.number}</span>
          <span className="text-xl">{item.name}</span>
          <Link
            className="mt-2 text-current hover:text-white flex items-center"
            href={item.link}
          >
            <InfoIcon className="text-current" />
            <span className="ml-1">Plus de détails</span>
          </Link>
        </div>
      ))}
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
