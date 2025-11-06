// Configuration de l'API
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// URL de production par défaut
export const PRODUCTION_API_URL = "https://backendgame-sales-sheets.onrender.com";

// Déterminer l'URL à utiliser
export const getApiUrl = (): string => {
  // Si on est en production et qu'il n'y a pas de VITE_API_URL défini, utiliser l'URL de production
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    return PRODUCTION_API_URL;
  }
  return API_URL;
};

