import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthError {
  message: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  storeToken: (token: string) => void;
  authenticateUser: () => void;
  logOutUser: () => void;
  authError: AuthError | null;
}

const defaultContextValue: AuthContextType = {
  isLoggedIn: false,
  isLoading: true,
  user: null,
  storeToken: () => {},
  authenticateUser: () => {},
  logOutUser: () => {},
  authError: null,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

interface AuthProviderWrapperProps {
  children: ReactNode;
}

function AuthProviderWrapper({ children }: AuthProviderWrapperProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const navigate = useNavigate();

  const storeToken = (token: string): void => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = (): void => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          const fetchedUser = response.data;
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(fetchedUser);
        })
        .catch((error) => {
          if (error.response) {
            setAuthError(error.response.data.message);
            return;
          }
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
        });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = (): void => {
    localStorage.removeItem("authToken");
  };

  const logOutUser = (): void => {
    removeToken();
    authenticateUser();
    navigate("/login");
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
