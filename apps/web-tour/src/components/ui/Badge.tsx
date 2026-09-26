import { cn } from "@/lib/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "outline" | "glacier";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold",
        variant === "default"  && "bg-pine/10 text-pine",
        variant === "gold"     && "bg-alpine-sun/20 text-ink",
        variant === "outline"  && "border border-stone/40 text-stone",
        variant === "glacier"  && "bg-glacier text-pine",
        className
      )}
      {...props}
    />
  );
}