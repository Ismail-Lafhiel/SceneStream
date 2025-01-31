import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import TextInput from "@/components/ui/TextInput";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";

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
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      console.log("Form submitted:", data);
      toast.success("Successfully logged in!");
      // Add your login logic here
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    toast.promise(
      // Replace this with your actual social login logic
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Connecting to ${provider}...`,
        success: `Successfully connected with ${provider}!`,
        error: `Could not connect to ${provider}`,
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 mt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        {/* Logo and Title */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to continue to SceneStream</p>
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
                label="Remember me"
                {...register("rememberMe")}
              />
              <Link
                to="/forgot-password"
                className="text-sm text-blue-500 hover:text-blue-400"
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
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">
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
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-500 hover:text-blue-400"
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
