"use client";

import { useFormStatus } from "react-dom";
import LoadingIcon from "./ui/icons/loadingIcon";
import { BsTrash } from "react-icons/bs";
import { toast } from "react-toastify";
import { isEmpty } from "./utils/utilsClient";

interface IDeleteButtonProps {
  id: string;
  label?: string;
  isDisabled?: boolean;
  onDeleteAction: (id: string) => Promise<any>;
}

export default function DeleteButton({
  id,
  label,
  onDeleteAction,
  isDisabled,
}: IDeleteButtonProps) {
  const { pending } = useFormStatus();

  async function formAction() {
    let { message, errors, status } = await onDeleteAction(id);

    if (message) {
      if (status === "success") {
        toast.success(message);
      } else if (status === "error") {
        toast.error(message);
      } else {
        toast(message);
      }
    }
    if (errors && !isEmpty(errors)) {
      toast.error(JSON.stringify(errors));
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (confirm("Êtes-vous sure?")) {
          formAction();
        }
      }}
      className="w-full"
    >
      <button
        type="submit"
        className={`btn bg-transparent text-accent-foreground hover:bg-accent w-full justify-start disabled:opacity-50 disabled:bg-transparent disabled:cursor-not-allowed`}
        aria-disabled={pending || isDisabled}
        disabled={isDisabled}
      >
        {pending ? <LoadingIcon /> : <BsTrash size={20} />}
        {label ? <span className="ml-4">{label}</span> : null}
      </button>
    </form>
  );
}
