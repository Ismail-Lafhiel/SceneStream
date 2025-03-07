import { createContext, useContext, useState, useEffect } from "react";
import {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  signOut,
  resetPassword,
  confirmResetPassword,
  updatePassword,
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<any>;
  resendConfirmationCode: (email: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  forgotPasswordSubmit: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<any>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<any>;
  getAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      // const currentUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      setUser(userAttributes);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      return idToken?.toString() || null;
    } catch (error) {
      console.error("Error fetching auth token:", error);
      return null;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password,
    });
    if (isSignedIn) {
      const userAttributes = await fetchUserAttributes();
      setUser(userAttributes);
      setIsAuthenticated(true);
      return userAttributes;
    }
    return nextStep;
  };

  const handleSignUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      return await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name: fullName,
            "custom:role": "USER",
          },
        },
      });
    } catch (error) {
      console.error("Sign-up error:", error);
      throw error;
    }
  };

  const handleConfirmSignUp = async (email: string, code: string) => {
    return await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
  };

  const handleResendConfirmationCode = async (email: string) => {
    return await resendSignUpCode({
      // Updated function name
      username: email,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleForgotPassword = async (email: string) => {
    return await resetPassword({
      // Updated function name
      username: email,
    });
  };

  const handleForgotPasswordSubmit = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    return await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });
  };

  const handleChangePassword = async (
    oldPassword: string,
    newPassword: string
  ) => {
    return await updatePassword({
      oldPassword,
      newPassword,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        confirmSignUp: handleConfirmSignUp,
        resendConfirmationCode: handleResendConfirmationCode,
        forgotPassword: handleForgotPassword,
        forgotPasswordSubmit: handleForgotPasswordSubmit,
        changePassword: handleChangePassword,
        getAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
