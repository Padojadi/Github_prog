import Link from "next/link";

export function LinkButton({
  children,
  href,
  disabled = false,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Link
      aria-disabled={disabled}
      href={disabled ? "#" : href}
      className={`${className} btn bg-${
        disabled ? "slate" : "indigo"
      }-500 hover:bg-${disabled ? "slate" : "indigo"}-600 text-white ${
        disabled && "cursor-not-allowed"
      }`}
    >
      {children}
    </Link>
  );
}
