import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  changePassword as changePasswordApi,
} from "../api/authApi";
import { updateUserPreferences, updateUserProfile } from "../api/userApi";

const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const loadCurrentUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
      setAuthError("");
    } catch (error) {
      setUser(null);
      if (error.statusCode !== 401) {
        setAuthError(error.message);
      }
    } finally {
      setAuthLoading(false);
    }
  }, []);
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);
  const login = async (credentials) => {
    try {
      setAuthError("");
      const response = await loginUser(credentials);
      const loggedInUser = response.data.user;
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };
  const updateProfile = async (profileData) => {
    try {
      setAuthError("");

      const response = await updateUserProfile(profileData);

      const updatedUser = response.data;

      setUser(updatedUser);

      return updatedUser;
    } catch (error) {
      setAuthError(error.message);

      throw error;
    }
  };
  const updatePreferences = async (preferences) => {
    try {
      setAuthError("");

      const response = await updateUserPreferences(preferences);

      const updatedUser = response.data;

      setUser(updatedUser);

      return updatedUser;
    } catch (error) {
      setAuthError(error.message);

      throw error;
    }
  };
  const updatePassword = async (passwordData) => {
    try {
      setAuthError("");

      const response = await changePasswordApi(passwordData);

      return response;
    } catch (error) {
      setAuthError(error.message);

      throw error;
    }
  };
  const register = async (userData) => {
    try {
      setAuthError("");

      const response = await registerUser(userData);

      return response;
    } catch (error) {
      setAuthError(error.message);

      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthError("");

      await logoutUser();
    } finally {
      /*if the logout HTTP request fails.
       */
      setUser(null);
    }
  };

  const clearAuthError = () => {
    setAuthError("");
  };

  const value = useMemo(
    () => ({
      user,

      isAuthenticated: Boolean(user),

      authLoading,
      authError,
      updateProfile,
      updatePreferences,
      updatePassword,
      login,
      register,
      logout,

      loadCurrentUser,
      clearAuthError,
    }),

    [user, authLoading, authError, loadCurrentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
