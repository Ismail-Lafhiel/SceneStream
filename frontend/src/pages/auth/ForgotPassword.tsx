//@ts-nocheck
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/contexts/AuthContext";

const requestCodeSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type RequestCodeFormData = z.infer<typeof requestCodeSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useDarkMode();
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestCodeFormData>({
    resolver: zodResolver(requestCodeSchema),
  });

  const onSubmit = async (data: RequestCodeFormData) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      toast.success("Verification code sent to your email!");
      navigate("/reset-password", { state: { email: data.email } });
    } catch (err: any) {
      switch (err.name) {
        case "UserNotFoundException":
          toast.error("No account found with this email address");
          break;
        case "LimitExceededException":
          toast.error("Too many attempts. Please try again later");
          break;
        default:
          toast.error(err.message || "Failed to send verification code");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 z-10 ${
            isDarkMode
              ? "bg-gradient-to-br from-blue-900/95 via-black/90 to-black/95"
              : "bg-gradient-to-br from-blue-100/95 via-white/90 to-white/95"
          }`}
        ></div>
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Background"
        />
      </div>

      {/* Form Container */}
      <div
        className={`relative z-10 max-w-md w-full space-y-8 p-8 rounded-xl shadow-2xl backdrop-blur-sm transform transition-all duration-500 ${
          isDarkMode
            ? "bg-gray-800/40 border border-blue-500/20"
            : "bg-white/80 border border-blue-200"
        }`}
      >
        {/* Title Section */}
        <div className="text-center">
          <h2
            className={`text-4xl font-extrabold tracking-tight mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Forgot Password
          </h2>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            We'll send you a verification code
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            id="email"
            label="Email address"
            icon={FaEnvelope}
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Send Reset Code
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:text-blue-400 transition-colors duration-200"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;