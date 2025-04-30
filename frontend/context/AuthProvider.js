"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const api_url =
    "https://collabflow-xzeb.onrender.com" || "http://127.0.0.1:8000";

  const fetchUser = async () => {
    try {
      const res = await fetch(`${api_url}/api/me/`, {
        credentials: "include",
      });

      if (!res.ok) {
        // If not authenticated or error occurred, just set user to null
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null); // Ensure user is set to null if error happens
    } finally {
      setIsLoading(false); // Loading ends either way
    }
  };

  const signup = async ({ first_name, last_name, email, password }) => {
    try {
      const res = await fetch(`${api_url}/api/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ first_name, last_name, email, password }),
      });

      if (!res.ok) {
        let error;
        try {
          error = await res.json();
        } catch {
          throw new Error("Signup failed");
        }
        throw new Error(error.message || "Signup failed");
      }

      const data = await res.json();
      setUser(data);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${api_url}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      console.log(res);
      if (!res.ok) throw new Error("Invalid email or password");
      const loginData = await res.json();

      // ✅ Fetch actual user data from /me
      await fetchUser(); // This updates the context
      return loginData; // Or return userData if you prefer
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log("testing api endpoint");
    try {
      const res = await fetch(`${api_url}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Logout failed");
      }

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        signup,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
