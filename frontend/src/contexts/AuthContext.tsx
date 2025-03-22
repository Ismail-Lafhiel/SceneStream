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
  isAdmin: boolean;
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
  checkAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const userAttributes = await fetchUserAttributes();
      setUser(userAttributes);
      setIsAuthenticated(true);
      await checkAdminStatus();
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  const checkAdminStatus = async (): Promise<boolean> => {
    try {
      const session = await fetchAuthSession();

      if (!session.tokens?.idToken) {
        setIsAdmin(false);
        return false;
      }

      const payload = session.tokens.idToken.payload;
      const userGroups = payload["cognito:groups"];
      const isUserAdmin = Array.isArray(userGroups) && userGroups.includes("ADMIN");

      setIsAdmin(isUserAdmin);
      return isUserAdmin;
    } catch (error) {
      setIsAdmin(false);
      return false;
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      return idToken?.toString() || null;
    } catch (error) {
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
      await checkAdminStatus();
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
      username: email,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const handleForgotPassword = async (email: string) => {
    return await resetPassword({
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
        isAdmin,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        confirmSignUp: handleConfirmSignUp,
        resendConfirmationCode: handleResendConfirmationCode,
        forgotPassword: handleForgotPassword,
        forgotPasswordSubmit: handleForgotPasswordSubmit,
        changePassword: handleChangePassword,
        getAuthToken,
        checkAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);