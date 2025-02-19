import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaCamera, FaUserCircle, FaShieldAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/contexts/AuthContext";

// Form validation schemas remain the same
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

  // Form hooks remain the same
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

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Form submission handlers remain the same
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
    <div className="relative min-h-screen">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <div
          className={`absolute inset-0 z-10 ${
            isDarkMode
              ? "bg-gradient-to-br from-blue-900/95 via-black/90 to-black/95"
              : "bg-gradient-to-br from-blue-100/95 via-white/90 to-white/95"
          }`}
        />
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Background"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-2xl backdrop-blur-sm ${
            isDarkMode
              ? "bg-gray-800/40 border border-blue-500/20"
              : "bg-white/80 border border-blue-200"
          }`}
        >
          {/* Profile Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative inline-block"
            >
              <div
                className={`w-32 h-32 rounded-full overflow-hidden border-4 ${
                  isDarkMode
                    ? "border-blue-500/30 shadow-lg shadow-blue-500/20"
                    : "border-blue-200 shadow-lg shadow-blue-200/20"
                }`}
              >
                <img
                  src={user?.attributes?.picture || "https://via.placeholder.com/128"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                className={`absolute bottom-0 right-0 p-3 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } shadow-lg shadow-blue-500/20 hover:scale-105`}
              >
                <FaCamera className="text-lg" />
              </button>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`mt-4 text-3xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {user?.attributes?.name || "User"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={isDarkMode ? "text-gray-300" : "text-gray-600"}
            >
              {user?.attributes?.email}
            </motion.p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                activeTab === "profile"
                  ? isDarkMode
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              <FaUserCircle />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                activeTab === "security"
                  ? isDarkMode
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              <FaShieldAlt />
              Security
            </button>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-xl backdrop-blur-sm ${
                isDarkMode
                  ? "bg-gray-900/50 border border-gray-700"
                  : "bg-white/50 border border-gray-200"
              }`}
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

                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className="w-full rounded-full shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform duration-300"
                    >
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

                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className="w-full rounded-full shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform duration-300"
                    >
                      Change Password
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;