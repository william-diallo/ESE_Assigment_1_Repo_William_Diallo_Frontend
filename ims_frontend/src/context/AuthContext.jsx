import { createContext, useState, useEffect } from "react";
import {
  clearAuthToken,
  getCurrentUser,
  getStoredToken,
  setAuthToken,
} from "../features/auth";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  console.log("AUTH CONTEXT LOADED");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);

    getCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => {
        clearAuthToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // FIXED: login now sets user FIRST, then resolves
  async function login(token, userData) {
    setAuthToken(token);

    if (userData) {
      setUser(userData);
    } else {
      try {
        const res = await getCurrentUser();
        setUser(res.data);
      } catch (err) {
        setUser(null);
        clearAuthToken();
        throw err;
      }
    }

    setLoading(false);
    console.log("AUTH CONTEXT RENDER:", {
      user: userData || null,
      loading: false,
    });
  }

  function logout() {
    clearAuthToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
