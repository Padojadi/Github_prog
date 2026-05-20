import Link from "next/link";
import { usePathname } from "next/navigation";

type BreadcrumbLinkProps = {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
};

export default function BreadcrumbLink({
  href,
  children,
  disabled,
}: BreadcrumbLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      href={disabled ? "#" : href}
      className={`btn ${
        pathname === href ? "bg-slate-600" : "bg-slate-500"
      } hover:bg-slate-600  text-white rounded-none ${
        disabled && "cursor-not-allowed"
      }`}
    >
      {children}
    </Link>
  );
}
