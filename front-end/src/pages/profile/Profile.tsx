// src/pages/Profile.tsx
import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaCamera } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/contexts/AuthContext";

// Form validation schemas
const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
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

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const { isDarkMode } = useDarkMode();
  const { user, changePassword } = useAuth();

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.attributes?.name || "",
      email: user?.attributes?.email || "",
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onUpdateProfile = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Implement update profile logic here
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success("Password changed successfully!");
      resetPassword();
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div
              className={`w-32 h-32 rounded-full overflow-hidden border-4 ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <img
                src={
                  user?.attributes?.picture || "https://via.placeholder.com/128"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              className={`absolute bottom-0 right-0 p-2 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } hover:opacity-80 transition-opacity`}
            >
              <FaCamera
                className={isDarkMode ? "text-gray-300" : "text-gray-600"}
              />
            </button>
          </div>
          <h2
            className={`mt-4 text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {user?.attributes?.name || "User"}
          </h2>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            {user?.attributes?.email}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "profile"
                ? isDarkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : isDarkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "security"
                ? isDarkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : isDarkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Security
          </button>
        </div>

        {/* Content */}
        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          {activeTab === "profile" ? (
            <form onSubmit={handleSubmitProfile(onUpdateProfile)}>
              <div className="space-y-6">
                <TextInput
                  id="fullName"
                  label="Full Name"
                  icon={FaUser}
                  placeholder="Enter your full name"
                  error={profileErrors.fullName?.message}
                  {...registerProfile("fullName")}
                />

                <TextInput
                  id="email"
                  label="Email"
                  icon={FaEnvelope}
                  placeholder="Enter your email"
                  disabled
                  {...registerProfile("email")}
                />

                <Button type="submit" isLoading={isLoading}>
                  Update Profile
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitPassword(onChangePassword)}>
              <div className="space-y-6">
                <TextInput
                  id="currentPassword"
                  type="password"
                  label="Current Password"
                  icon={FaLock}
                  placeholder="Enter current password"
                  error={passwordErrors.currentPassword?.message}
                  {...registerPassword("currentPassword")}
                />

                <TextInput
                  id="newPassword"
                  type="password"
                  label="New Password"
                  icon={FaLock}
                  placeholder="Enter new password"
                  error={passwordErrors.newPassword?.message}
                  {...registerPassword("newPassword")}
                />

                <TextInput
                  id="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  icon={FaLock}
                  placeholder="Confirm new password"
                  error={passwordErrors.confirmPassword?.message}
                  {...registerPassword("confirmPassword")}
                />

                <Button type="submit" isLoading={isLoading}>
                  Change Password
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
