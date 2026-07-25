import {
	fetchSpouseCardById,
	validateDuplicateSpouseDC,
	validateRenewSpouseDC,
	validateSpouseDC,
} from "@/lib/actions/diplomaticCards/spouses";
import ValidateForm from "./_components/validateForm";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchSpouseCardById(id);
  const spouse = res.data;
  console.log(spouse);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl pb-4 text-center">
        <span className="font-semibold">Nom : </span>
        {spouse?.firstName + " " + spouse?.lastName}
      </h1>
      <hr className="pb-4" />
      <div className="max-w-4xl mx-auto">
        <ValidateForm
          backLink="/panel/diplomatic/spouses"
          person={spouse}
          validateData={validateSpouseDC}
          renewAction={validateRenewSpouseDC}
          duplicateAction={validateDuplicateSpouseDC}
        />
      </div>
    </div>
  );
}
