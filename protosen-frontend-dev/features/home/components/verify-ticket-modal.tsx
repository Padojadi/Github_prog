"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormShad,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
});

type FormValues = z.infer<typeof formSchema>;

export function VerifyTicketModal() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    router.push(`/conferences/verify-ticket?code=${data.code}`);
  };

  return (
    <ResponsiveModal>
      <ResponsiveModalTrigger asChild>
        <Button variant="outline">Vérifier votre ticket</Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Vérifier votre ticket</ResponsiveModalTitle>
        </ResponsiveModalHeader>
        <div>
          <FormShad {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Code du ticket <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="Entrer le code..." {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Entrez le code situé juste en dessous du code qr.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Procéder à la vérification
              </Button>
            </form>
          </FormShad>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
