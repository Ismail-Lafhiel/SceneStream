import { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className={`
            h-4 w-4
            text-blue-600
            focus:ring-blue-500
            border-gray-700
            rounded
            bg-gray-700
            ${className}
          `}
          {...props}
        />
        <label htmlFor={props.id} className="ml-2 block text-sm text-gray-300">
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
