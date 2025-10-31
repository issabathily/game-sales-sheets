import { SalesData, Game } from "@/types/sales";

const STORAGE_KEY = "gameStudioSales";

const defaultGames: Game[] = [
  { id: "1", name: "Adventure Quest", defaultPrice: 29.99 },
  { id: "2", name: "Space Warriors", defaultPrice: 39.99 },
  { id: "3", name: "Puzzle Master", defaultPrice: 19.99 },
  { id: "4", name: "Racing Legends", defaultPrice: 49.99 },
  { id: "5", name: "Fantasy RPG", defaultPrice: 59.99 },
];

export const loadSalesData = (): SalesData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading sales data:", error);
  }
  
  return {
    games: defaultGames,
    sheets: [],
  };
};

export const saveSalesData = (data: SalesData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving sales data:", error);
  }
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};
