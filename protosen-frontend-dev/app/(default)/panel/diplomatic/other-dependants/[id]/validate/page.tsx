import ValidateForm from "./_components/validateForm";
import {
  fetchOtherDependantCardById,
  validateDuplicateOtherDependantDC,
  validateOtherDependantDC,
  validateRenewOtherDependantDC,
} from "@/lib/actions/diplomaticCards/otherDependants";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchOtherDependantCardById(id);
  const otherDependant = res.data;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl pb-4 text-center">
        <span className="font-semibold">Nom : </span>
        {otherDependant?.firstName + " " + otherDependant?.lastName}
      </h1>
      <hr className="pb-4" />
      <div className="max-w-4xl mx-auto">
        <ValidateForm
          backLink="/panel/diplomatic/other-dependants"
          person={otherDependant}
          validateData={validateOtherDependantDC}
          renewAction={validateRenewOtherDependantDC}
          duplicateAction={validateDuplicateOtherDependantDC}
        />
      </div>
    </div>
  );
}
