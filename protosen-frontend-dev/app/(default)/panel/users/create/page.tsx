"use client";

import { useState } from "react";
import UserForm from "../_components/userForm";

export default function Page() {
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [status, setStatus] = useState<string>("");
  // const [errorFileLink, setErrorFileLink] = useState<string | null>(null);

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setSelectedFile(e.target.files[0]);
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!selectedFile) {
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("csvFile", selectedFile);

  //   setStatus("Processing...");

  //   const response = await fetch("/api/user", {
  //     method: "POST",
  //     body: formData,
  //   });

  //   const data = await response.json();

  //   if (response.ok) {
  //     setStatus(data.message);
  //     if (data.errorFilePath) {
  //       setErrorFileLink(data.errorFilePath);
  //     }
  //   } else {
  //     setStatus("Error processing file");
  //   }
  // };
  return (
    <>
      {/* <div>
        <h1>Upload CSV and Process Users</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button type="submit">Upload and Process</button>
        </form>

        {status && <p>{status}</p>}

        {errorFileLink && (
          <a href={errorFileLink} download>
            Download Error CSV
          </a>
        )}
      </div> */}
      <UserForm />
    </>
  );
}
