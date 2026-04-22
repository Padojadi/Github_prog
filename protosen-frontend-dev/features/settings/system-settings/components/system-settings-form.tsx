"use client";

import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormShad,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { BsFloppy } from "react-icons/bs";
import { updateSystemSettings } from "../lib/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SystemSettings } from "../types";
import { toast } from "react-toastify";
import ReactCrop, { Crop, PixelCrop, makeAspectCrop, centerCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalFooter,
} from "@/components/ui/responsive-modal";

const formSchema = z.object({
  directorSignature: z
    .unknown()
    .refine(
      (file) => {
        if (!file) return true; // Optional field
        // Check if it's a File-like object without using instanceof
        if (typeof file !== "object" || file === null) return true;
        const fileLike = file as { size?: number; type?: string };
        if (fileLike.size === undefined) return true;
        return fileLike.size <= 512 * 1024; // 512KB max
      },
      {
        message: "La taille du fichier ne doit pas dépasser 512KB",
      }
    )
    .refine(
      (file) => {
        if (!file) return true; // Optional field
        // Check if it's a File-like object without using instanceof
        if (typeof file !== "object" || file === null) return true;
        const fileLike = file as { type?: string };
        if (!fileLike.type) return true;
        const validTypes = [
          "image/png",
          "image/jpeg",
          "image/jpg",
        ];
        return validTypes.includes(fileLike.type);
      },
      {
        message: "Format non supporté. Utilisez PNG, JPEG, JPG",
      }
    )
    .optional(),
  ministryName: z.string().optional(),
  protocolDirectionName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SystemSettingsFormProps {
  initialData?: SystemSettings;
  onClose: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
};

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: PixelCrop
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      },
      "image/png",
      0.95
    );
  });
};

export function SystemSettingsForm({
  initialData,
  onClose,
}: SystemSettingsFormProps) {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.directorSignature || null
  );
  const [imageRemoved, setImageRemoved] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ministryName: initialData?.ministryName || "",
      protocolDirectionName: initialData?.protocolDirectionName || "",
      directorSignature: undefined,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const requestData: {
        directorSignature?: string;
        ministryName?: string;
        protocolDirectionName?: string;
      } = {};

      // Add text fields if they have values
      if (data.ministryName) {
        requestData.ministryName = data.ministryName;
      }
      if (data.protocolDirectionName) {
        requestData.protocolDirectionName = data.protocolDirectionName;
      }

      // Handle image file - use cropped image if available, otherwise use file or existing
      if (imagePreview && imagePreview !== initialData?.directorSignature) {
        // Use the cropped/preview image (already in base64)
        requestData.directorSignature = imagePreview;
      } else if (
        initialData?.directorSignature &&
        !imageRemoved &&
        imagePreview === initialData?.directorSignature
      ) {
        // Keep existing image if no new file selected and not explicitly removed
        requestData.directorSignature = initialData.directorSignature;
      } else if (imageRemoved) {
        // Explicitly remove image by sending empty string
        requestData.directorSignature = "";
      }

      const response = await updateSystemSettings(
        requestData,
        "Erreur de modification des paramètres système",
        "Paramètres système modifiés avec succès"
      );

      if (response.status === "error") {
        throw new Error(
          response.message || "Une erreur inconnue s'est produite"
        );
      }
      return response;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: ["system-settings"],
      });
      toast.success(message || "Succès");
      form.reset();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Une erreur est survenue");
    },
  });

  const handleSubmit = async (data: FormValues) => {
    submitMutation.mutate(data);
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > 512 * 1024) {
        toast.error("La taille du fichier ne doit pas dépasser 512KB");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Validate file type
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Format non supporté. Utilisez PNG, JPEG, JPG"
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Convert to base64 and open crop modal
      const base64 = await fileToBase64(file);
      setImageToCrop(base64);
      setShowCropModal(true);
      setImageRemoved(false);
    }
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImgRef(e.currentTarget);
    
    // Initialize crop to center 80% of the image
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: 80,
      },
      naturalWidth / naturalHeight,
      naturalWidth,
      naturalHeight
    );
    
    const centeredCrop = centerCrop(crop, naturalWidth, naturalHeight);
    setCrop(centeredCrop);
  }, []);

  const handleCropComplete = async () => {
    if (!imageToCrop || !completedCrop || !imgRef) {
      return;
    }

    setIsCropping(true);
    try {
      const croppedImage = await getCroppedImg(imageToCrop, completedCrop);
      setImagePreview(croppedImage);
      setShowCropModal(false);
      setImageToCrop(null);
      setCrop(undefined);
      setCompletedCrop(undefined);
      setImgRef(null);
      // Create a File object from the cropped image for form validation
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "signature.png", { type: "image/png" });
      form.setValue("directorSignature", file, { shouldValidate: true });
    } catch (error) {
      toast.error("Erreur lors du recadrage de l'image");
      console.error(error);
    } finally {
      setIsCropping(false);
    }
  };

  const handleCancelCrop = () => {
    setShowCropModal(false);
    setImageToCrop(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setImgRef(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageRemoved(true);
    form.setValue("directorSignature", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FormShad {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="ministryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du ministère</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Entrez le nom du ministère" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="protocolDirectionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la direction du protocole</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Entrez le nom de la direction du protocole"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="directorSignature"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Signature du directeur </FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Signature preview"
                        className="max-w-full max-h-48 rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        Supprimer
                      </Button>
                    </div>
                  )}
                  <Input
                    {...field}
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Formats acceptés: PNG, JPEG, JPG (max 512KB). L'image doit être transparente et sans fond.
                  </p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : (
            <BsFloppy size={16} className="mr-2" />
          )}
          Enregistrer
        </Button>
      </form>

      {/* Crop Modal */}
      <ResponsiveModal open={showCropModal} onOpenChange={setShowCropModal}>
        <ResponsiveModalContent className="max-w-2xl">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>Recadrer l'image</ResponsiveModalTitle>
          </ResponsiveModalHeader>
          <div className="p-4">
            {imageToCrop && (
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={undefined}
                  minWidth={50}
                  minHeight={50}
                >
                  <img
                    src={imageToCrop}
                    alt="Crop"
                    style={{ maxHeight: "60vh", maxWidth: "100%" }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Ajustez la zone de recadrage en redimensionnant les coins et les bords
            </p>
            <ResponsiveModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelCrop}
                disabled={isCropping}
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleCropComplete}
                disabled={isCropping || !completedCrop}
              >
                {isCropping ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Recadrage...
                  </>
                ) : (
                  "Valider le recadrage"
                )}
              </Button>
            </ResponsiveModalFooter>
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </FormShad>
  );
}

