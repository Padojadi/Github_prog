"use client";

import { useFormStatus } from "react-dom";
import LoadingIcon from "./ui/icons/loadingIcon";
import { BsFloppy } from "react-icons/bs";

export default function SubmitButton({
  label,
  disabled,
}: {
  label: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
      disabled={pending || disabled}
      aria-disabled={pending || disabled}
    >
      {pending ? <LoadingIcon /> : <BsFloppy />}
      <span className="ml-2">{label}</span>
    </button>
  );
}
