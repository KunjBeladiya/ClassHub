import { createContext, useContext, useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [avatar_url, setAvatar_url] = useState(null);
  const [role, setRole] = useState(null); // ⭐ NEW
  const [loading, setLoading] = useState(true); // start with loading


  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch(`${API}/api/v1/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        setIsLoggedIn(false);
        setUserId(null);
        setRole(null);
      } else {
        const data = await res.json();
         console.log(data)
        setIsLoggedIn(true);
        setUserId(data.userId);
        setRole(data.role);
        setAvatar_url(data.avatar_url);
      }
    } catch (err) {
      setIsLoggedIn(false);
      setUserId(null);
      setRole(null);
    } finally {
      setLoading(false); // auth check finished
    }
  };

  checkAuth();
}, []);


  const logout = async () => {
    try {
      const res = await fetch(`${API}/api/v1/logout`, {
        credentials: "include",
        method: "GET",
      });

      const data = await res.json();
      
      if (data.success) {
        setIsLoggedIn(false);
        setUserId(null);
        setRole(null);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userId,
        role,
        loading,
        avatar_url,
        logout,
        setIsLoggedIn,
        setUserId,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
