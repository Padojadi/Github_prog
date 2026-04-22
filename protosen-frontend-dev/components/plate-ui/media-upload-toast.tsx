"use client";

import { useEffect } from "react";

import { PlaceholderPlugin, UploadErrorCode } from "@udecode/plate-media/react";
import { usePluginOption } from "@udecode/plate/react";
import { toast } from "sonner";

export const useUploadErrorToast = () => {
  const uploadError = usePluginOption(PlaceholderPlugin, "error");

  useEffect(() => {
    if (!uploadError) return;

    const { code, data } = uploadError;

    switch (code) {
      case UploadErrorCode.INVALID_FILE_SIZE: {
        toast.error(
          `La taille des fichiers ${data.files
            .map((f) => f.name)
            .join(", ")} est invalide`
        );

        break;
      }
      case UploadErrorCode.INVALID_FILE_TYPE: {
        toast.error(
          `Le type des fichiers ${data.files
            .map((f) => f.name)
            .join(", ")} est invalide`
        );

        break;
      }
      case UploadErrorCode.TOO_LARGE: {
        toast.error(
          `La taille des fichiers ${data.files
            .map((f) => f.name)
            .join(", ")} est plus grande que ${data.maxFileSize}`
        );

        break;
      }
      case UploadErrorCode.TOO_LESS_FILES: {
        toast.error(
          `Le nombre minimm de fichier est ${data.minFileCount} pour ${data.fileType}`
        );

        break;
      }
      case UploadErrorCode.TOO_MANY_FILES: {
        toast.error(
          `Le nombre minimm de fichier est ${data.maxFileCount} ${
            data.fileType ? `pour ${data.fileType}` : ""
          }`
        );

        break;
      }
    }
  }, [uploadError]);
};

export const MediaUploadToast = () => {
  useUploadErrorToast();

  return null;
};
