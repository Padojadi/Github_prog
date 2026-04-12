import React from "react";

type BadgeProps = {
  text: string;
  color?: "indigo" | "sky" | "emerald" | "amber" | "rose" | "blue" | "slate";
};

export default function Badge({ text, color = "blue" }: BadgeProps) {
  return (
    <div
      className={`ml-3 text-xs inline-flex font-medium bg-${color}-100 dark:bg-${color}-500/30 text-${color}-600 dark:text-${color}-400 rounded-full text-center px-2.5 py-1`}
    >
      {text}
    </div>
  );
}
