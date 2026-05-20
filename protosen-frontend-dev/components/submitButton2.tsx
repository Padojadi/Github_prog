"use client";

import { useFormStatus } from "react-dom";
import LoadingIcon from "./ui/icons/loadingIcon";
import { BsSend } from "react-icons/bs";

export default function SubmitButton2({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
      aria-disabled={pending}
    >
      <span className="mr-2">{label}</span>
      {pending ? <LoadingIcon /> : <BsSend />}
    </button>
  );
}
