import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, LoginCredentials, UserRole } from "@/types/user";
import { loginUser } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isGerant: boolean;
  isProprietaire: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    // Charger l'utilisateur depuis localStorage au démarrage
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    // Sauvegarder l'utilisateur dans localStorage quand il change
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const loggedInUser = await loginUser(credentials);
      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isGerant = user?.role === "gerant";
  const isProprietaire = user?.role === "proprietaire";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isGerant,
        isProprietaire,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
