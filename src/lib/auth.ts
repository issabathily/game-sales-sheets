import { User, UserRole } from "@/types/user";

const API_URL = "http://localhost:3001";

// Authentifier un utilisateur (alias pour compatibilité)
export const loginUser = async (credentials: { username: string; password: string }): Promise<User | null> => {
  return login(credentials.username, credentials.password);
};

// Authentifier un utilisateur
export const login = async (username: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/users?username=${username}&password=${password}`);
    if (!response.ok) throw new Error("Failed to login");
    
    const users: User[] = await response.json();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Stocker la session dans localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    }
    
    return null;
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
};

// Déconnecter l'utilisateur
export const logout = (): void => {
  localStorage.removeItem("currentUser");
};

// Récupérer l'utilisateur actuel
export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error getting current user:", error);
  }
  return null;
};

// Vérifier si l'utilisateur est authentifié
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Vérifier si l'utilisateur a un rôle spécifique
export const hasRole = (role: UserRole): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

// Vérifier si l'utilisateur est propriétaire
export const isProprietaire = (): boolean => {
  return hasRole("proprietaire");
};

// Vérifier si l'utilisateur est gérant
export const isGerant = (): boolean => {
  return hasRole("gerant");
};

