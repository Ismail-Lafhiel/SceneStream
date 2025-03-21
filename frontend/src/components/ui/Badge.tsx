//@ts-nocheck
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/contexts/DarkModeContext";

const lightBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
        secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        destructive: "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80",
        outline: "text-slate-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const darkBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 dark:border-slate-800",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-50 text-slate-900 hover:bg-slate-50/80",
        secondary: "border-transparent bg-slate-800 text-slate-50 hover:bg-slate-800/80",
        destructive: "border-transparent bg-red-900 text-slate-50 hover:bg-red-900/80",
        outline: "text-slate-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}) {
  const { isDarkMode } = useDarkMode();
  
  return (
    <span 
      className={cn(
        isDarkMode 
          ? darkBadgeVariants({ variant }) 
          : lightBadgeVariants({ variant }),
        className
      )} 
      {...props} 
    />
  );
}

export { Badge, lightBadgeVariants, darkBadgeVariants };