import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import TextInput from "@/components/ui/TextInput";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/contexts/AuthContext";

// Form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useDarkMode();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn(data.email, data.password);

      if (result.isSignedIn) {
        toast.success("Successfully logged in!");
        navigate("/");
      } else if (result.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        navigate("/verify-email", { state: { email: data.email } });
      } else {
        toast.error("Additional verification required");
      }
    } catch (err: any) {
      switch (err.name) {
        case "UserNotFoundException":
          toast.error("Account not found. Please check your email.");
          break;
        case "NotAuthorizedException":
          toast.error("Incorrect email or password");
          break;
        case "UserNotConfirmedException":
          toast.error("Please verify your email first");
          navigate("/verify-email", { state: { email: data.email } });
          break;
        default:
          toast.error(err.message || "Failed to sign in");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    // You can implement social sign-in later when needed
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
          isDarkMode ? "bg-gray-800/90" : "bg-white/90"
        }`}
      >
        {/* Logo and Title */}
        <div className="text-center">
          <h2
            className={`text-4xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Welcome Back
          </h2>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Sign in to continue to SceneStream
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-between">
              <Checkbox
                id="rememberMe"
                label={
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    Remember me
                  </span>
                }
                {...register("rememberMe")}
              />
              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Sign in
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
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="social"
              icon={FaGoogle}
              onClick={() => handleSocialLogin("google")}
            >
              Google
            </Button>
            <Button
              type="button"
              variant="social"
              icon={FaFacebookF}
              onClick={() => handleSocialLogin("facebook")}
            >
              Facebook
            </Button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center">
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
