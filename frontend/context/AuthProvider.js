import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function AuthProvider() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const signup = async () => {

    }

    const login = async () => {

    }

    const logout = async () => {

    }
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  
  export default AuthProvider;