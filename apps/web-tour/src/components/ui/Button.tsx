import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-brand text-sm font-semibold transition-all duration-200 ease-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:   "bg-pine text-cloud hover:bg-forest focus-visible:ring-forest",
        secondary: "bg-cloud text-ink border border-stone/30 hover:border-pine hover:text-pine focus-visible:ring-pine",
        gold:      "bg-alpine-sun text-ink hover:opacity-90 focus-visible:ring-alpine-sun",
        ghost:     "text-ink hover:bg-pine/5 focus-visible:ring-pine",
        link:      "text-forest underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-forest",
      },
      size: {
        sm:  "h-8  px-4  text-xs",
        md:  "h-10 px-6",
        lg:  "h-12 px-8  text-base",
        xl:  "h-14 px-10 text-base",
        icon:"h-10 w-10  p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";