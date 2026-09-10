import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center border border-dashed border-black/15 rounded-sm bg-white/50 ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-deep-forest/5 flex items-center justify-center text-deep-forest mb-4">
        {icon || <FolderOpen className="w-7 h-7 text-deep-forest/60" />}
      </div>
      <h4 className="font-display text-2xl text-charcoal mb-1.5">{title}</h4>
      {description && (
        <p className="text-sm text-muted-stone max-w-md mb-6">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
