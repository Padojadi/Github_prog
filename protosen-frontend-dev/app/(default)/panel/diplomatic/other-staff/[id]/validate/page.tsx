import ValidateForm from "./_components/validateForm";
import {
  fetchOtherStaffCardById,
  validateDuplicateOtherStaffDC,
  validateOtherStaffDC,
  validateRenewOtherStaffDC,
} from "@/lib/actions/diplomaticCards/otherStaffs";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const res = await fetchOtherStaffCardById(id);
  const otherStaff = res.data;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl pb-4 text-center">
        <span className="font-semibold">Nom : </span>
        {otherStaff?.firstName + " " + otherStaff?.lastName}
      </h1>
      <hr className="pb-4" />
      <div className="max-w-4xl mx-auto">
        <ValidateForm
          backLink="/panel/diplomatic/other-staff"
          person={otherStaff}
          validateData={validateOtherStaffDC}
          renewAction={validateRenewOtherStaffDC}
          duplicateAction={validateDuplicateOtherStaffDC}
        />
      </div>
    </div>
  );
}
