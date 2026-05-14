import Link from "next/link";

export default function Logo() {
  return (
    <Link className="block" href="/">
      <img src="/images/logo.png" alt="Logo Protosen" className="h-8 w-auto" />
    </Link>
  );
}
