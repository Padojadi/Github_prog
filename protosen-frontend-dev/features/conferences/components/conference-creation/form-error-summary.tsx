import { d } from "@/lib/dictionary";
import { useFormState } from "react-hook-form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { ErrorMessage, formatErrors, humanizeFieldName } from "../../lib/utils";

const FormErrorSummary = () => {
  const { errors, isSubmitted } = useFormState();

  if (!isSubmitted || !errors || Object.keys(errors).length === 0) return null;

  const formattedErrors = formatErrors(errors);

  const handleErrorClick = (field: string) => {
    const cleanField = field.endsWith(".root") ? field.slice(0, -5) : field;
    const formFieldName = cleanField.replace(/\[(\d+)\]/g, ".$1");

    try {
      const elementById = document.getElementById(formFieldName);
      if (elementById) {
        elementById.scrollIntoView({ behavior: "smooth", block: "center" });
        elementById.focus();
        return;
      }
      const elementByName = document.getElementsByName(formFieldName)[0];
      if (elementByName) {
        elementByName.scrollIntoView({ behavior: "smooth", block: "center" });
        elementByName.focus();
        return;
      }
      console.warn(`No element found for field: ${formFieldName}`);
    } catch (error) {
      console.error("Error focusing field:", formFieldName, error);
    }
  };

  const getDisplayLabel = (label: string, field: string) => {
    if (label.toLowerCase() === "root") {
      const parentKey = field.split(".root")[0].split(".").pop() || field;
      return d[parentKey as keyof typeof d] || humanizeFieldName(parentKey);
    }
    return label;
  };

  const groupedErrors = formattedErrors.reduce(
    (acc: Record<string, ErrorMessage[]>, error) => {
      if (error.category) {
        if (!acc[error.category]) {
          acc[error.category] = [];
        }
        acc[error.category].push(error);
      } else {
        if (!acc["general"]) {
          acc["general"] = [];
        }
        acc["general"].push(error);
      }
      return acc;
    },
    {}
  );

  return (
    <Alert
      variant="destructive"
      className="w-full bg-slate-200 dark:bg-slate-950"
    >
      <AlertTitle>{d.errorValidationTitle}</AlertTitle>
      <ul className="space-y-2">
        {groupedErrors["general"]?.map(({ label, message, field }, index) => (
          <li
            key={`general-${index}`}
            className="px-2 cursor-pointer hover:underline"
            onClick={() => handleErrorClick(field)}
          >
            • {getDisplayLabel(label, field)}: {message}
          </li>
        ))}

        {Object.entries(groupedErrors).map(([category, errors]) => {
          if (category === "general") return null;

          return (
            <div key={category}>
              <li className="px-2 font-semibold">{category}:</li>
              {errors.map(({ label, message, field, index }, i) => (
                <li
                  key={`${category}-${index}-${i}`}
                  className="px-4 cursor-pointer hover:underline"
                  onClick={() => handleErrorClick(field)}
                >
                  • {index !== undefined ? `#${index + 1} - ` : ""}
                  {getDisplayLabel(label, field)}: {message}
                </li>
              ))}
            </div>
          );
        })}
      </ul>
    </Alert>
  );
};

export { FormErrorSummary };
