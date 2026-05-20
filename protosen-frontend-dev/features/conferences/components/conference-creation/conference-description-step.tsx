"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { TCreateConferenceSchema } from "../../types/schema";
import { FileUploader } from "@/components/ui/file-uploader";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { cn } from "@/lib/utils";
import { Conference } from "../../types";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { PlateEditor } from "@/components/editor/plate-editor";
import { useTheme } from "next-themes";

export function ConferenceDescriptionStep({
  initialData,
}: {
  initialData?: Conference;
}) {
  const { control } = useFormContext<TCreateConferenceSchema>();
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="description"
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormLabel className={error && "text-destructive"}>
              Description de la conférence{" "}
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <div
                className={cn(
                  "w-full h-[600px] border rounded-lg border-border overflow-hidden",
                  theme === "dark" && "dark",
                  error && "border-destructive"
                )}
                data-registry="plate"
              >
                <PlateEditor
                  // value={
                  //   initialData
                  //     ? initialData.reason
                  //     : [
                  //         {
                  //           type: "p",
                  //           children: [{ text: "" }],
                  //         },
                  //       ]
                  // }
                  value={initialData ? initialData.description : field.value}
                  onBlur={(value) => field.onChange(value)}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
