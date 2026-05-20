import React from "react";
import { capitalize } from "./utils/utilsClient";

type AlertType = "warning" | "info" | "danger" | "success";

interface AlertProps {
  type?: AlertType;
  title?: string;
  content: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  title = type,
  content,
  className,
}) => {
  let color: string;

  switch (type) {
    case "warning":
      color = "orange";
      break;
    case "info":
      color = "blue";
      break;
    case "danger":
      color = "rose";
      break;
    case "success":
      color = "green";
      break;
    default:
      color = "blue";
  }

  return (
    <div
      className={`bg-${color}-100 border-l-4 border-l-${color}-500 border-${color}-500 text-${color}-700 p-4 mt-4 ${
        className && className
      }`}
      role="alert"
    >
      <p className="font-bold">{title && capitalize(title)}</p>
      {content}
    </div>
  );
};
