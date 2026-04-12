import ValidateForm from "./_components/validateForm";
import {
  fetchChildCardById,
  validateChildDC,
  validateDuplicateChildDC,
  validateRenewChildDC,
} from "@/lib/actions/diplomaticCards/childs";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchChildCardById(id);
  const child = res.data;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl pb-4 text-center">
        <span className="font-semibold">Nom : </span>
        {child?.firstName + " " + child?.lastName}
      </h1>
      <hr className="pb-4" />
      <div className="max-w-4xl mx-auto">
        <ValidateForm
          backLink="/panel/diplomatic/childs"
          person={child}
          validateData={validateChildDC}
          renewAction={validateRenewChildDC}
          duplicateAction={validateDuplicateChildDC}
        />
      </div>
    </div>
  );
}
