export interface Game {
  id: string;
  name: string;
  defaultPrice: number;
}

export interface Sale {
  id: string;
  gameId: string;
  gameName: string;
  price: number;
  time: string;
}

export interface DailySheet {
  date: string;
  sales: Sale[];
}

export interface SalesData {
  games: Game[];
  sheets: DailySheet[];
}
