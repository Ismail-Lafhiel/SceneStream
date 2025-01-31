import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", ...props }, ref) => {
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
                border-gray-700
                rounded
                bg-gray-700
                ${error ? "border-red-500" : ""}
                ${className}
              `}
              {...props}
            />
          </div>
          <div className="ml-2">
            <label
              htmlFor={props.id}
              className={`text-sm ${error ? "text-red-500" : "text-gray-300"}`}
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
