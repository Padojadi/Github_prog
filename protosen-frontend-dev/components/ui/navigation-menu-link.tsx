import { usePathname } from "next/navigation";
import NextLink, { LinkProps } from "next/link";
import { NavigationMenuLink } from "./navigation-menu";
import { ReactNode } from "react";

type TLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
};

export function LinkCustom({ href, children, ...props }: TLinkProps) {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <NavigationMenuLink asChild active={isActive}>
      <NextLink href={href} {...props}>
        {children}
      </NextLink>
    </NavigationMenuLink>
  );
}
