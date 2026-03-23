import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppProvider } from "@/app/app-provider";

interface SidebarLinkProps {
  children: React.ReactNode;
  href: string;
}

export default function SidebarLink({ children, href }: SidebarLinkProps) {
  const pathname = usePathname();
  const { setSidebarOpen } = useAppProvider();

  return (
    <Link
      className={`block text-foreground/50 hover:text-foreground transition duration-150 truncate ${
        pathname === href
          ? "group-[.is-link-group]:text-indigo-500"
          : "group-[.is-link-group]:text-foreground/50 hover:text-foreground hover:group-[.is-link-group]:text-foreground"
      }`}
      href={href}
      onClick={() => setSidebarOpen(false)}
    >
      {children}
    </Link>
  );
}
