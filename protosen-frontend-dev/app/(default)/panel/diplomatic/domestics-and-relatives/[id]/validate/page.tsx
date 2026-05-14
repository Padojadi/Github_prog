import ValidateForm from "./_components/validateForm";
import {
  fetchDomesticAndRelativeCardById,
  validateDomesticAndRelativeDC,
  validateDuplicateDomesticAndRelativeDC,
  validateRenewDomesticAndRelativeDC,
} from "@/lib/actions/diplomaticCards/domesticAndRelatives";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchDomesticAndRelativeCardById(id);
  const domesticAndRelative = res.data;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl pb-4 text-center">
        <span className="font-semibold">Nom : </span>
        {domesticAndRelative?.firstName + " " + domesticAndRelative?.lastName}
      </h1>
      <hr className="pb-4" />
      <div className="max-w-4xl mx-auto">
        <ValidateForm
          backLink="/panel/diplomatic/domestics-and-relatives"
          person={domesticAndRelative}
          validateData={validateDomesticAndRelativeDC}
          renewAction={validateRenewDomesticAndRelativeDC}
          duplicateAction={validateDuplicateDomesticAndRelativeDC}
        />
      </div>
    </div>
  );
}
