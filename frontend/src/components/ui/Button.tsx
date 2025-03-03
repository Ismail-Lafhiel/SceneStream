import { ButtonHTMLAttributes, ReactNode } from "react";
import { IconType } from "react-icons";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "social";
  isLoading?: boolean;
  icon?: IconType;
  children: ReactNode;
}

const Button = ({
  variant = "primary",
  isLoading = false,
  icon: Icon,
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const { isDarkMode } = useDarkMode();

  const baseStyles =
    "w-full flex justify-center items-center py-3 px-4 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: `bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
      isDarkMode ? "focus:ring-offset-gray-900" : "focus:ring-offset-white"
    }`,
    secondary: isDarkMode
      ? "border border-gray-700 bg-gray-700/50 hover:bg-gray-700 text-white"
      : "border border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-700",
    social: isDarkMode
      ? "border border-gray-700 bg-gray-700/50 hover:bg-gray-700 text-white py-2.5"
      : "border border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {Icon && <Icon className="h-5 w-5 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;