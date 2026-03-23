import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

type FormNavigationProps = {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: (e: any) => void;
  isPending: boolean;
  // onSaveAsDraft: () => void;
};

const FormNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isPending,
}: // onSaveAsDraft,
FormNavigationProps) => {
  return (
    <div className="flex justify-between pt-6 border-t border-border">
      <div>
        {currentStep > 1 && (
          <Button
            type="button"
            onClick={onPrevious}
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>
        )}
      </div>
      <div className="flex space-x-3">
        {/* <Button
          type="button"
          onClick={onSaveAsDraft}
          variant="outline"
          className="text-gray-600"
        >
          Sauvegarder
        </Button> */}
        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 flex items-center"
          >
            Suivant
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary/90"
          >
            Finaliser l'inscription
            {isPending && <Loader2 className="size-4 ml-2 animate-spin" />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormNavigation;
