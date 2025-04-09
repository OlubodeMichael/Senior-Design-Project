"use client"

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function AuthProvider({ children}) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)

    const getCSRFToken = () => {
      const name = "csrftoken=";
      const cookies = document.cookie.split(";");
    
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name)) {
          return cookie.substring(name.length);
        }
      }
      return null;
    }

    const api_url = process.env.DJANGO_API || "http://127.0.0.1:8000";

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
    
    const signup = async ({ first_name, last_name, email, password}) => {
      const csrfToken = getCSRFToken();
      try {
        const res = await fetch(`${api_url}/api/signup/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify({ first_name, last_name, email, password}),
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
        setIsLoading(false)
      }
    };

    const login = async ({ email, password }) => {
      const csrfToken = getCSRFToken();
      try {
        const res = await fetch(`${api_url}/api/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
    
        if (!res.ok) throw new Error("Invalid email or password");
        const loginData = await res.json();
    
        // ✅ Fetch actual user data from /me
        await fetchUser()// This updates the context
        return loginData;  // Or return userData if you prefer
      } catch (err) {
        throw err;
      }
    };

    const logout = async () => {
      console.log("testing api endpoint")
      const csrfToken = getCSRFToken();
      try {
        const res = await fetch(`${api_url}/api/logout/`, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
          },
          credentials: "include"
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
      <AuthContext.Provider value={{
        user, 
        isLoading, 
        error, 
        login, 
        logout, 
        signup
      }}>
        {children}
      </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  
  export default AuthProvider;