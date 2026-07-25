import Logo from "@/components/ui/logo";

export default function AuthHeader() {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-start h-16 px-4 sm:px-6 lg:px-8">
        <Logo />{" "}
        <span className="text-2xl text-slate-800 dark:text-slate-100 font-bold ml-2 uppercase">
          Protosen
        </span>
      </div>
    </div>
  );
}
