import React from "react";
import { cn } from "./utils";

interface SimpleSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
}

interface SimpleSelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const SimpleSelect: React.FC<SimpleSelectProps> = ({
  value,
  onValueChange,
  children,
  placeholder = "Sélectionner une option",
  className,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {!value && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
};

export const SimpleSelectItem: React.FC<SimpleSelectItemProps> = ({
  value,
  children,
  className,
}) => {
  return (
    <option value={value} className={className}>
      {children}
    </option>
  );
};
