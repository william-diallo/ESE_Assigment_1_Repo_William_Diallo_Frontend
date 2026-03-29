import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  console.log("AUTH CONTEXT LOADED");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    api
      .get("/auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // FIXED: login now sets user FIRST, then resolves
  async function login(token, userData) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    if (userData) {
      setUser(userData);
    } else {
      try {
        const res = await api.get("/auth/me/");
        setUser(res.data);
      } catch (err) {
        setUser(null);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
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
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
