"use client";
import { useFormContext } from "react-hook-form";
import {
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Plane,
  Users,
  HelpCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { RegistrationForm } from "../../types/registration-schema";
import { FileUploader } from "@/components/ui/file-uploader";
import { useGetSupportCategories } from "../../support-categories/hooks/use-get-support-categories";
import { useGetJobTitles } from "../../job-titles/hooks/use-get-job-titles";
import { useGetConferenceParticipantTypeAlone } from "../../hooks/use-get-conference-participant-types";

type PersonalInfoFormProps = {
  conferenceId: string;
};

const PersonalInfoForm = ({ conferenceId }: PersonalInfoFormProps) => {
  const form = useFormContext<RegistrationForm>();

  const { data, isLoading } = useGetSupportCategories();
  const { data: functionData, isLoading: functionDataIsloading } =
    useGetJobTitles();
  const { data: participantTypeData, isLoading: participantTypeDataIsloading } =
    useGetConferenceParticipantTypeAlone(conferenceId);

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
        Informations Personnelles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Prénom <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input placeholder="Prénom" {...field} className="pl-10" />
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nom <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input placeholder="Nom" {...field} className="pl-10" />
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormDescription>
        Votre nom apparaîtra sur le badge de la conférence
      </FormDescription>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                Sexe <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="MALE" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Masculin
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="FEMALE" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Féminin
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="conferenceParticipantTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Catégorie de participant <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={participantTypeDataIsloading}>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {participantTypeData &&
                    participantTypeData.data.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="organisation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Entreprise/Organisation <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Votre entreprise/organisation"
                    {...field}
                    className="pl-10"
                  />
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </FormControl>
              <FormDescription>
                Apparaîtra sur le badge de la conférence
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="functionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Fonction/Titre <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={functionDataIsloading}>
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="Sélectionnez votre fonction" />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {functionData &&
                    functionData?.data.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.name}
                      </SelectItem>
                    ))}
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("functionId") === "autre" && (
          <FormField
            control={form.control}
            name="customFunction"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>
                  Précisez votre fonction{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Votre fonction"
                      {...field}
                      className="pl-10"
                    />
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Téléphone <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="XX XXX XXXX"
                    {...field}
                    className="pl-10"
                  />
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mail <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    {...field}
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </FormControl>
              <FormDescription>
                Vous allez recevoir un lien d'activation ainsi que le résumé de
                votre souscription
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <h4 className="text-base font-medium text-foreground/80 mt-6">Adresse</h4>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Adresse Rue <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder="Votre adresse"
                  {...field}
                  className="pl-10"
                />
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Code Postal/ZIP <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Code postal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Ville <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Ville" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Pays <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Pays" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <h4 className="text-base font-medium text-foreground/80 mt-6">
        Identification
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="identityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Type d'identité <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="passport">Passeport</SelectItem>
                  <SelectItem value="national">
                    Carte d'identité nationale
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="identityNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Numéro d'Identité <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Numéro d'identité"
                    {...field}
                    className="pl-10"
                  />
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="identityIssueDate"
          render={({
            field: { value, onChange, ...field },
            fieldState: { error },
          }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Délivrée le <span className="text-red-500">*</span>
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
          control={form.control}
          name="dateOfBirth"
          render={({
            field: { value, onChange, ...field },
            fieldState: { error },
          }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Date de naissance <span className="text-red-500">*</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nationalité <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Votre nationalité" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatarUrl"
          render={({
            field: { value, onChange, ...field },
            fieldState: { error },
          }) => (
            <FormItem>
              <FormLabel className={error && "text-destructive"}>
                Photo à mettre sur le ticket{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <FileUploader
                  value={value && value instanceof File ? [value] : []}
                  onValueChange={(files) => onChange(files[0])}
                  accept={{
                    "image/jpeg": [],
                    "image/jpg": [],
                    "image/png": [],
                    "image/webp": [],
                  }}
                  maxFileCount={1}
                  className={error && "border-destructive"}
                  maxSize={5 * 1024 * 1024}
                  // disabled={isUploading}
                />
              </FormControl>
              <FormDescription>
                Formats acceptés : JPG, PNG, WebP (max 5 Mo)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="transportation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transport (Optionnel)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Vol/Train/Autobus/Bateau (Numéro)"
                    {...field}
                    className="pl-10"
                  />
                  <Plane className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
      </div>
      <h4 className="text-base font-medium text-foreground/80 mt-6">
        Support et Assistance
      </h4>

      <FormField
        control={form.control}
        name="needsSupport"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Avez-vous besoin d'un support particulier?{" "}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="oui" />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Oui
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="non" />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Non
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("needsSupport") === "oui" && (
        <FormField
          control={form.control}
          name="supportOptionIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Types de support requis{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <div className="space-y-2">
                {data &&
                  data.data.map((support) => {
                    const checked = (field.value ?? []).includes(support.id);
                    return (
                      <label
                        key={support.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(isChecked) => {
                            const current = field.value ?? [];
                            field.onChange(
                              isChecked
                                ? [...current, support.id]
                                : current.filter(
                                    (id: string) => id !== support.id
                                  )
                            );
                          }}
                          disabled={isLoading}
                        />
                        <span className="text-sm">{support.label}</span>
                      </label>
                    );
                  })}
              </div>
              <FormDescription>
                Notre équipe vous contactera pour organiser le support
                nécessaire
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default PersonalInfoForm;
