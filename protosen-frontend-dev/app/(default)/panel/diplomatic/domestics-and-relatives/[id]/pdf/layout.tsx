import Link from "next/link";
import { BsChevronLeft } from "react-icons/bs";

export default async function Layout({
  params,
  children,
}: {
  params: any;
  children: React.ReactNode;
}) {
  const { id } = params;

  return (
    <>
      <Link
        href={"/panel/diplomatic/domestics-and-relatives/" + id}
        className="btn mr-3 bg-indigo-500 hover:bg-indigo-600 text-white"
      >
        <BsChevronLeft />
        <span className="ml-2">Retour</span>
      </Link>
      {children}
    </>
  );
}
