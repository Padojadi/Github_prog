"use client";

import { BsFloppy } from "react-icons/bs";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import LoadingIcon from "@/components/ui/icons/loadingIcon";
import { updateUserPassword } from "@/lib/actions/users";
import { toast } from "react-toastify";
import { isEmpty } from "@/components/utils/utilsClient";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ChangePasswordModal = ({
  item,
  label,
  open,
  onClose,
}: {
  item: { [key: string]: any };
  label: string;
  open: boolean;
  onClose: (value: boolean) => void;
}) => {
  // const [open, setOpen] = React.useState<boolean>(false);

  const { pending } = useFormStatus();

  async function formAction(formData: FormData) {
    formData.append("email", item.email);
    let { message, errors, status } = await updateUserPassword(formData);

    if (message) {
      if (status === "success") {
        toast.success(message);
        onClose(false);
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
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer de Mot de passe</DialogTitle>
          </DialogHeader>
          {/* Modal content */}
          <div className=" h-fit">
            <form action={formAction}>
              <div className="space-y-4">
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <PasswordInput
                      id="new-password"
                      name="new_password"
                      required={true}
                    />
                    {/* <Input
                    type="password"
                    id="new-password"
                    name="new_password"
                    required={true}
                  /> */}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-confirmation">
                      Confirmez le mot de passe
                    </Label>
                    <PasswordInput
                      id="new-password-confirmation"
                      name="confirm_new_password"
                      required={true}
                    />
                    {/* <Input
                    type="password"
                    id="new-password-confirmation"
                    name="confirm_new_password"
                    required={true}
                  /> */}
                  </div>
                </>
              </div>
              <div className=" py-4">
                <div className="flex flex-wrap justify-end space-x-2">
                  <button
                    className="btn bg-red-500 hover:bg-red-600 text-white"
                    type="button"
                    onClick={(e) => {
                      onClose(false);
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                    aria-disabled={pending}
                  >
                    {pending ? <LoadingIcon /> : <BsFloppy />}
                    <span className="ml-2">Valider</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* Modal footer */}
        </DialogContent>
      </Dialog>
    </div>
  );
};
