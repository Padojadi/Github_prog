"use client";
import * as React from "react";

import { Input } from "./input";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
      <div className="relative flex-1">
        <Input type={showPassword ? "text" : "password"} ref={ref} {...props} />
        <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
          {showPassword ? (
            <BsFillEyeFill
              className="h-4 w-4"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <BsFillEyeSlashFill
              className="h-4 w-4"
              onClick={togglePasswordVisibility}
            />
          )}
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
