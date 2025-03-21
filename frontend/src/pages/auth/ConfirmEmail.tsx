//@ts-nocheck
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";

const confirmEmailSchema = z.object({
  code: z.string().min(1, "Verification code is required"),
});

type ConfirmEmailFormData = z.infer<typeof confirmEmailSchema>;

const ConfirmEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmSignUp, resendConfirmationCode } = useAuth();
  const { isDarkMode } = useDarkMode();

  // Get email from location state
  const email = location.state?.email;

  // Redirect to register if no email is provided
  if (!email) {
    navigate("/register");
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmEmailFormData>({
    resolver: zodResolver(confirmEmailSchema),
  });

  const onSubmit = async (data: ConfirmEmailFormData) => {
    setIsLoading(true);

    try {
      await confirmSignUp(email, data.code);
      toast.success("Email verified successfully! Please sign in.");
      navigate("/login");
    } catch (error: any) {
      console.error("Confirmation error:", error);
      toast.error(
        error.message || "Code verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendConfirmationCode(email);
      toast.success("Verification code resent successfully!");
    } catch (error: any) {
      console.error("Resend code error:", error);
      toast.error(error.message || "Failed to resend code. Please try again.");
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
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div
              className={`p-4 rounded-full ${
                isDarkMode ? "bg-blue-500/10" : "bg-blue-50"
              }`}
            >
              <FaEnvelope
                className={`h-8 w-8 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
          </div>
          <h2
            className={`text-4xl font-extrabold tracking-tight mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Verify Your Email
          </h2>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            We've sent a verification code to{" "}
            <span className="font-medium text-blue-500">{email}</span>
          </p>
        </div>

        {/* Verification Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            id="code"
            label="Verification Code"
            icon={FaEnvelope}
            placeholder="Enter the 6-digit code"
            error={errors.code?.message}
            {...register("code")}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Verify Email
          </Button>

          <div className="text-center space-y-4">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                Resend verification code
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmEmail;
