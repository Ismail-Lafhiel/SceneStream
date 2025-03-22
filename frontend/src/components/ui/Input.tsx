//@ts-nocheck
import * as React from "react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/contexts/DarkModeContext";

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    const { isDarkMode } = useDarkMode();
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isDarkMode 
            ? "border-slate-800 bg-slate-950 ring-offset-slate-950 placeholder:text-slate-400 focus-visible:ring-slate-300" 
            : "border-slate-200 bg-white ring-offset-white focus-visible:ring-slate-950",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };