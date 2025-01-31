import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaFacebookF,
  FaUser,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import TextInput from "@/components/ui/TextInput";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";

// Form validation schema
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(3, "Name must be at least 3 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { isDarkMode } = useDarkMode();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      await signUp(data.email, data.password, data.fullName);
      navigate("/confirm-email", { state: { email: data.email } });
      toast.success(
        "Registration successful! Please check your email for the verification code."
      );
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: "google" | "facebook") => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: `Connecting to ${provider}...`,
      success: `Successfully connected with ${provider}!`,
      error: `Could not connect to ${provider}`,
    });
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
            Create Account
          </h2>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Join SceneStream today
          </p>
        </div>

        {/* Register Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput
              id="fullName"
              label="Full Name"
              icon={FaUser}
              placeholder="Enter your full name"
              error={errors.fullName?.message}
              {...register("fullName")}
            />

            <TextInput
              id="email"
              label="Email address"
              icon={FaEnvelope}
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email")}
            />

            <TextInput
              id="password"
              type="password"
              label="Password"
              icon={FaLock}
              placeholder="Create a password"
              error={errors.password?.message}
              {...register("password")}
            />

            <TextInput
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              icon={FaLock}
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <div className="space-y-2">
              <Checkbox
                id="acceptTerms"
                label={
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                }
                error={errors.acceptTerms?.message}
                {...register("acceptTerms")}
              />
            </div>
          </div>

          <Button type="submit" className="cursor-pointer" isLoading={isLoading}>
            Create Account
          </Button>

          {/* Social Login Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t ${
                  isDarkMode ? "border-gray-700" : "border-gray-300"
                }`}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-2 ${
                  isDarkMode
                    ? "bg-gray-800/90 text-gray-400"
                    : "bg-white/90 text-gray-500"
                }`}
              >
                Or register with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="cursor-pointer"
              type="button"
              variant="social"
              icon={FaGoogle}
              onClick={() => handleSocialRegister("google")}
            >
              Google
            </Button>
            <Button
              className="cursor-pointer"
              type="button"
              variant="social"
              icon={FaFacebookF}
              onClick={() => handleSocialRegister("facebook")}
            >
              Facebook
            </Button>
          </div>
        </form>

        {/* Sign In Link */}
        <div className="text-center">
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
