
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("dms_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("dms_user");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const saveSession = useCallback((data) => {
    if (!data?.token || !data?.user) {
      throw new Error("Invalid authentication response from server");
    }

    localStorage.setItem("dms_token", data.token);
    localStorage.setItem("dms_user", JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await authService.login(credentials);
      saveSession(data);
      return data;
    },
    [saveSession]
  );

  const register = useCallback(
    async (userData) => {
      const data = await authService.register(userData);
      saveSession(data);
      return data;
    },
    [saveSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("dms_token");
    localStorage.removeItem("dms_user");
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const token = localStorage.getItem("dms_token");

      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const data = await authService.getMe();

        if (active && data?.user) {
          localStorage.setItem("dms_user", JSON.stringify(data.user));
          setUser(data.user);
        }
      } catch {
        if (active) {
          localStorage.removeItem("dms_token");
          localStorage.removeItem("dms_user");
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user && localStorage.getItem("dms_token")),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
