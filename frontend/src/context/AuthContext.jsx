import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/users/current");
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAuthLoading(false);
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser();
    } else {
      setAuthLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchCurrentUser, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
