import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import DashboardView from "@/components/DashboardView";
import SalesView from "@/components/SalesView";
import HistoryView from "@/components/HistoryView";
import SettingsView from "@/components/SettingsView";
import { SalesData, DailySheet, Sale } from "@/types/sales";
import { loadSalesData, saveSalesData, getTodayDate } from "@/lib/storage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [salesData, setSalesData] = useState<SalesData>(() => loadSalesData());
  const [todayDate] = useState(getTodayDate());

  // Ensure today's sheet exists
  useEffect(() => {
    const existingSheet = salesData.sheets.find(s => s.date === todayDate);
    if (!existingSheet) {
      const newSheet: DailySheet = {
        date: todayDate,
        sales: [],
      };
      const updated = {
        ...salesData,
        sheets: [...salesData.sheets, newSheet],
      };
      setSalesData(updated);
      saveSalesData(updated);
    }
  }, [todayDate]);

  const todaySheet = salesData.sheets.find(s => s.date === todayDate) || {
    date: todayDate,
    sales: [],
  };

  const handleAddSale = (gameId: string, price: number) => {
    const game = salesData.games.find(g => g.id === gameId);
    if (!game) return;

    const newSale: Sale = {
      id: Date.now().toString(),
      gameId,
      gameName: game.name,
      price,
      time: new Date().toLocaleTimeString('fr-FR'),
    };

    const updatedSheets = salesData.sheets.map(sheet => {
      if (sheet.date === todayDate) {
        return {
          ...sheet,
          sales: [...sheet.sales, newSale],
        };
      }
      return sheet;
    });

    const updated = {
      ...salesData,
      sheets: updatedSheets,
    };
    setSalesData(updated);
    saveSalesData(updated);
  };

  const handleAddGame = (name: string, defaultPrice: number) => {
    const newGame = {
      id: Date.now().toString(),
      name,
      defaultPrice,
    };

    const updated = {
      ...salesData,
      games: [...salesData.games, newGame],
    };
    setSalesData(updated);
    saveSalesData(updated);
  };

  const handleUpdateGame = (id: string, name: string, defaultPrice: number) => {
    const updated = {
      ...salesData,
      games: salesData.games.map(game =>
        game.id === id ? { ...game, name, defaultPrice } : game
      ),
    };
    setSalesData(updated);
    saveSalesData(updated);
  };

  const handleDeleteGame = (id: string) => {
    const updated = {
      ...salesData,
      games: salesData.games.filter(game => game.id !== id),
    };
    setSalesData(updated);
    saveSalesData(updated);
  };

  const handleExport = () => {
    const csv = [
      ["Jeu", "Prix", "Heure"].join(","),
      ...todaySheet.sales.map(sale =>
        [sale.gameName, sale.price.toFixed(2), sale.time].join(",")
      ),
      ["", "Total", todaySheet.sales.reduce((sum, s) => sum + s.price, 0).toFixed(2)].join(","),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ventes-${todayDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && (
        <DashboardView sheets={salesData.sheets} todayDate={todayDate} />
      )}
      {activeTab === "sales" && (
        <SalesView
          games={salesData.games}
          todaySheet={todaySheet}
          onAddSale={handleAddSale}
          onExport={handleExport}
        />
      )}
      {activeTab === "history" && (
        <HistoryView sheets={salesData.sheets} onSelectDate={() => {}} />
      )}
      {activeTab === "settings" && (
        <SettingsView
          games={salesData.games}
          onAddGame={handleAddGame}
          onUpdateGame={handleUpdateGame}
          onDeleteGame={handleDeleteGame}
        />
      )}
    </Layout>
  );
};

export default Index;
