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

export function ConferenceInfoStep({
  initialData,
}: {
  initialData?: Conference;
}) {
  const { control } = useFormContext<TCreateConferenceSchema>();
  const { theme } = useTheme();

  const handleDocumentClick = (url: string, docType: string) => {
    if (!url) {
      toast.error(`Document ${docType} non disponible`);
      return;
    }
    window.open(url, "_blank");
  };
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormLabel className={error && "text-destructive"}>
              Titre <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Entrez le titre de la conférence..."
                className={error && "border-destructive"}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name="themeDoc"
          render={({
            field: { value, onChange, ...field },
            fieldState: { error },
          }) => (
            <FormItem>
              <FormLabel className={error && "text-destructive"}>
                Thème et programme <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <FileUploader
                  value={value && value instanceof File ? [value] : []}
                  onValueChange={(files) => onChange(files[0])}
                  accept={{
                    "application/msword": [],
                    "application/pdf": [],
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                      [],
                  }}
                  maxFileCount={1}
                  className={error && "border-destructive"}
                  maxSize={10 * 1024 * 1024}
                  // disabled={isUploading}
                />
              </FormControl>
              {initialData && (
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDocumentClick(initialData.themeDoc, "theme");
                  }}
                >
                  <FileText className="h-4 w-4" />
                  Theme
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="budgetDoc"
          render={({
            field: { value, onChange, ...field },
            fieldState: { error },
          }) => (
            <FormItem>
              <FormLabel className={error && "text-destructive"}>
                Projet de budget <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <FileUploader
                  value={value && value instanceof File ? [value] : []}
                  onValueChange={(files) => onChange(files[0])}
                  maxFileCount={1}
                  accept={{
                    "application/msword": [],
                    "application/pdf": [],
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                      [],
                  }}
                  className={error && "border-destructive"}
                  maxSize={10 * 1024 * 1024}
                  // disabled={isUploading}
                />
              </FormControl>
              {initialData && (
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDocumentClick(initialData.budgetDoc, "budget");
                  }}
                >
                  <FileText className="h-4 w-4" />
                  Budget
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name="startDate"
          render={({
            field: { value, onChange, ...field },
            fieldState: { error },
          }) => (
            <FormItem>
              <FormLabel className={error && "text-destructive"}>
                Date de début <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="day"
                  placeholder="Choisir une date..."
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="endDate"
          render={({
            field: { value, onChange, ...field },
            fieldState: { error },
          }) => (
            <FormItem>
              <FormLabel className={error && "text-destructive"}>
                Date de fin <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="day"
                  placeholder="Choisir une date..."
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="location"
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormLabel className={error && "text-destructive"}>
              Lieu <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Entrez le lieu de la conférence..."
                className={error && "border-destructive"}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
