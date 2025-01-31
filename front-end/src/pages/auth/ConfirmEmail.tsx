// src/pages/auth/ConfirmEmail.tsx
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

const confirmEmailSchema = z.object({
  code: z.string().min(1, "Verification code is required"),
});

type ConfirmEmailFormData = z.infer<typeof confirmEmailSchema>;

const ConfirmEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmSignUp, resendConfirmationCode } = useAuth();

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-500/10 rounded-full">
              <FaEnvelope className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-400">
            We've sent a verification code to{" "}
            <span className="text-blue-400">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            id="code"
            label="Verification Code"
            placeholder="Enter the 6-digit code"
            error={errors.code?.message}
            {...register("code")}
          />

          <Button type="submit" isLoading={isLoading} className="w-full">
            Verify Email
          </Button>

          <div className="text-center space-y-4">
            <p className="text-gray-400">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResendCode}
              className="text-blue-500 hover:text-blue-400 text-sm font-medium"
            >
              Resend verification code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmEmail;
