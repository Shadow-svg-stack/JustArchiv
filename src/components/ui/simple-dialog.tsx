import React from "react";
import { cn } from "./utils";
import { X } from "lucide-react";

interface SimpleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface SimpleDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SimpleDialog: React.FC<SimpleDialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]">
        {children}
      </div>
    </div>
  );
};

export const SimpleDialogContent: React.FC<SimpleDialogContentProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid w-full gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};
