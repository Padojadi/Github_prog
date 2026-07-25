import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NumberInputProps extends Omit<NumericFormatProps, "onChange"> {
  className?: string;
  onChange?: (value: number) => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, onChange, ...props }, ref) => {
    return (
      <NumericFormat
        customInput={Input}
        getInputRef={ref}
        {...props}
        className={cn(className, "")}
        onValueChange={(values) => {
          if (onChange) {
            onChange(Number(values.value));
          }
        }}
        valueIsNumericString={true}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
