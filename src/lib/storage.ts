import { SalesData, Game, DailySheet } from "@/types/sales";
import { User } from "@/types/user";

const API_URL = "http://localhost:3001";

// Charger toutes les données depuis JSON Server
export const loadSalesData = async (): Promise<SalesData> => {
  try {
    const [gamesResponse, sheetsResponse] = await Promise.all([
      fetch(`${API_URL}/games`),
      fetch(`${API_URL}/sheets`),
    ]);

    if (!gamesResponse.ok || !sheetsResponse.ok) {
      throw new Error("Failed to load data");
    }

    const games = await gamesResponse.json();
    const sheets = await sheetsResponse.json();

    return {
      games: Array.isArray(games) ? games : [],
      sheets: Array.isArray(sheets) ? sheets : [],
    };
  } catch (error) {
    console.error("Error loading sales data:", error);
    // Retourner les valeurs par défaut si le serveur n'est pas disponible
    return {
      games: [],
      sheets: [],
    };
  }
};

// Sauvegarder toutes les données (utilisé pour les mises à jour en masse)
export const saveSalesData = async (data: SalesData): Promise<void> => {
  try {
    // Mettre à jour tous les jeux
    await Promise.all(
      data.games.map(game =>
        fetch(`${API_URL}/games/${game.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(game),
        })
      )
    );

    // Mettre à jour toutes les sheets
    await Promise.all(
      data.sheets.map(sheet =>
        fetch(`${API_URL}/sheets/${sheet.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sheet),
        }).catch(() => {
          // Si la sheet n'existe pas, la créer
          return fetch(`${API_URL}/sheets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sheet),
          });
        })
      )
    );
  } catch (error) {
    console.error("Error saving sales data:", error);
  }
};

// Fonctions pour les jeux
export const fetchGames = async (): Promise<Game[]> => {
  try {
    const response = await fetch(`${API_URL}/games`);
    if (!response.ok) throw new Error("Failed to fetch games");
    return await response.json();
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};

export const addGame = async (game: Omit<Game, "id">): Promise<Game> => {
  const response = await fetch(`${API_URL}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game),
  });
  if (!response.ok) throw new Error("Failed to add game");
  return await response.json();
};

export const updateGame = async (id: string, game: Partial<Game>): Promise<Game> => {
  const response = await fetch(`${API_URL}/games/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...game, id }),
  });
  if (!response.ok) throw new Error("Failed to update game");
  return await response.json();
};

export const deleteGame = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/games/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete game");
};

// Fonctions pour les sheets
export const fetchSheets = async (): Promise<DailySheet[]> => {
  try {
    const response = await fetch(`${API_URL}/sheets`);
    if (!response.ok) throw new Error("Failed to fetch sheets");
    return await response.json();
  } catch (error) {
    console.error("Error fetching sheets:", error);
    return [];
  }
};

export const addSheet = async (sheet: DailySheet): Promise<DailySheet> => {
  const response = await fetch(`${API_URL}/sheets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sheet),
  });
  if (!response.ok) throw new Error("Failed to add sheet");
  return await response.json();
};

export const updateSheet = async (id: string, sheet: DailySheet): Promise<DailySheet> => {
  const response = await fetch(`${API_URL}/sheets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...sheet, id }),
  });
  if (!response.ok) {
    // Si la sheet n'existe pas, la créer
    return addSheet(sheet);
  }
  return await response.json();
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Supprimer toutes les sheets (ventes)
export const deleteAllSheets = async (): Promise<void> => {
  try {
    // Récupérer toutes les sheets
    const response = await fetch(`${API_URL}/sheets`);
    if (!response.ok) throw new Error("Failed to fetch sheets");
    const sheets: DailySheet[] = await response.json();
    
    // Supprimer chaque sheet
    await Promise.all(
      sheets.map(sheet =>
        fetch(`${API_URL}/sheets/${sheet.id}`, {
          method: "DELETE",
        })
      )
    );
  } catch (error) {
    console.error("Error deleting all sheets:", error);
    throw error;
  }
};

// Fonctions pour la gestion des utilisateurs
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const fetchGerants = async (): Promise<User[]> => {
  try {
    const users = await fetchUsers();
    return users.filter(user => user.role === "gerant");
  } catch (error) {
    console.error("Error fetching gerants:", error);
    return [];
  }
};

export const addUser = async (user: Omit<User, "id">): Promise<User> => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error("Failed to add user");
  return await response.json();
};

export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete user");
};