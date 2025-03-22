import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const { isDarkMode } = useDarkMode();

    return (
      <div className="space-y-1">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              ref={ref}
              className={`
                mt-1.5
                h-4 w-4
                text-blue-600
                focus:ring-blue-500
                rounded
                transition-colors
                ${
                  isDarkMode
                    ? "border-gray-700 bg-gray-700"
                    : "border-gray-300 bg-white"
                }
                ${error ? "border-red-500" : ""}
                ${className}
              `}
              {...props}
            />
          </div>
          <div className="ml-2">
            <label
              htmlFor={props.id}
              className={`text-sm transition-colors ${
                error
                  ? "text-red-500"
                  : isDarkMode
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              {label}
            </label>
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
