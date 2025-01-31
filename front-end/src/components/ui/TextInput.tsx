import { InputHTMLAttributes, forwardRef } from "react";
import { IconType } from "react-icons";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: IconType;
  error?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, icon: Icon, error, className = "", ...props }, ref) => {
    const { isDarkMode } = useDarkMode();

    return (
      <div>
        <label
          htmlFor={props.id}
          className={`block text-sm font-medium transition-colors ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </label>
        <div className="mt-1 relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
            </div>
          )}
          <input
            ref={ref}
            className={`
              appearance-none block w-full
              ${Icon ? "pl-10" : "pl-3"} pr-3 py-2
              border rounded-lg
              transition-colors
              ${
                isDarkMode
                  ? "bg-gray-700/50 text-white placeholder-gray-500 border-gray-700"
                  : "bg-white text-gray-900 placeholder-gray-400 border-gray-300"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? "border-red-500 focus:ring-red-500" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
