// src/pages/auth/ResetPassword.tsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/contexts/AuthContext";

const resetPasswordSchema = z
  .object({
    code: z.string().min(1, "Verification code is required"),
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useDarkMode();
  const { forgotPassword, forgotPasswordSubmit } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Redirect if no email in state
  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await forgotPasswordSubmit(email, data.code, data.newPassword);
      toast.success("Password successfully reset!");
      navigate("/login");
    } catch (err: any) {
      switch (err.name) {
        case "CodeMismatchException":
          toast.error("Invalid verification code");
          break;
        case "ExpiredCodeException":
          toast.error("Verification code has expired");
          break;
        default:
          toast.error(err.message || "Failed to reset password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await forgotPassword(email);
      toast.success("New verification code sent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send new code");
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
              ? "bg-gradient-to-r from-blue-900/90 to-black/70"
              : "bg-gradient-to-r from-blue-600/80 to-blue-800/80"
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
        className={`relative z-10 max-w-md w-full space-y-8 p-8 rounded-xl shadow-2xl backdrop-blur-sm ${
          isDarkMode ? "bg-gray-800/90" : "bg-white"
        }`}
      >
        <div className="text-center">
          <h2
            className={`text-4xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Reset Password
          </h2>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Enter the verification code sent to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            id="code"
            label="Verification Code"
            icon={FaEnvelope}
            placeholder="Enter verification code"
            error={errors.code?.message}
            {...register("code")}
          />

          <TextInput
            id="newPassword"
            type="password"
            label="New Password"
            icon={FaLock}
            placeholder="Enter new password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <TextInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            icon={FaLock}
            placeholder="Confirm new password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" isLoading={isLoading}>
            Reset Password
          </Button>

          <div className="text-center space-y-4">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              className={`text-sm font-medium ${
                isDarkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              Resend verification code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
