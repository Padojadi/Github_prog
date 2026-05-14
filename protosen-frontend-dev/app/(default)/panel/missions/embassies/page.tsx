import TableComponent from "@/components/table/tableComponent";
import { JSON_DEMO_URL } from "@/lib/constants";
import React from "react";

type Embassies = {
  id: number;
  code: number;
  label: string;
};

export default async function Page() {
  const data: Embassies[] = await fetch(JSON_DEMO_URL + "/missions-embassies")
    .then((response) => response.json())
    .catch((error) => console.error(error));
  const headers = [
    { label: "Code", code: "code" },
    { label: "Label", code: "label" },
  ];
  return (
    <TableComponent
      headers={headers}
      title="Ambassades"
      data={Array.isArray(data) ? data : []}
    />
  );
}
