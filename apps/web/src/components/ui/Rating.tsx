import React from "react";
import { Star } from "lucide-react";

export interface RatingProps {
  value: number; // 0 - 5
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  showScore?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  showScore = false,
  className = "",
}) => {
  const sizeMap = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(value);

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(starValue)}
              className={`transition-colors duration-150 ${
                interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
              }`}
            >
              <Star
                className={`${sizeMap} ${
                  isFilled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-black/5 text-black/20"
                }`}
              />
            </button>
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-semibold text-charcoal/80 ml-1">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};
