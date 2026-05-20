import ValidateForm from "@/components/validateForm";
import {
	fetchHolderCardById,
	validateDuplicateHolderDC,
	validateHolderDC,
	validateRenewHolderDC,
} from "@/lib/actions/diplomaticCards/holders";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchHolderCardById(id);
  const holder = res.data;
  console.log(holder);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl pb-4 text-center">
        <span className="font-semibold">Nom : </span>
        {holder?.firstName + " " + holder?.lastName}
      </h1>
      <hr className="pb-4" />
      <div className="max-w-4xl mx-auto">
        <ValidateForm
          backLink="/panel/diplomatic/holders"
          person={holder}
          validateData={validateHolderDC}
          renewAction={validateRenewHolderDC}
          duplicateAction={validateDuplicateHolderDC}
        />
      </div>
    </div>
  );
}
