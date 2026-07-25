import { fetchUserDetails } from "@/lib/actions/users";
import UserForm from "../../_components/userForm";

export default async function Page({ params }: any) {
  const { id } = params;
  const res = await fetchUserDetails(id);
  const user = res?.data;
  return (
    <UserForm
      initialValues={{ ...user, accessGroupId: user?.accessGroup?.id }}
    />
  );
}
