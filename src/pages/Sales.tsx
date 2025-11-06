import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SalesView from "@/components/SalesView";
import { SalesData, DailySheet, Sale } from "@/types/sales";
import { loadSalesData, getTodayDate, addSheet, updateSheet } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const Sales = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("sales");
  const [salesData, setSalesData] = useState<SalesData>({ games: [], sheets: [] });
  const [loading, setLoading] = useState(true);
  const [todayDate] = useState(getTodayDate());

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await loadSalesData();
        setSalesData(data);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated]);

  // Ensure today's sheet exists
  useEffect(() => {
    if (loading || !isAuthenticated) return;
    
    const ensureTodaySheet = async () => {
      const existingSheet = salesData.sheets.find(s => s.date === todayDate);
      if (!existingSheet) {
        const newSheet: DailySheet = {
          id: todayDate,
          date: todayDate,
          sales: [],
        };
        try {
          const createdSheet = await addSheet(newSheet);
          setSalesData(prev => ({
            ...prev,
            sheets: [...prev.sheets, createdSheet],
          }));
        } catch (error) {
          console.error("Error creating today's sheet:", error);
        }
      }
    };
    
    ensureTodaySheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayDate, loading, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const todaySheet = salesData.sheets.find(s => s.date === todayDate) || {
    id: todayDate,
    date: todayDate,
    sales: [],
  };

  const handleAddSale = async (gameId: string, price: number) => {
    const game = salesData.games.find(g => g.id === gameId);
    if (!game) {
      toast.error("Jeu introuvable");
      return;
    }

    const newSale: Sale = {
      id: Date.now().toString(),
      gameId,
      gameName: game.name,
      price,
      time: new Date().toLocaleTimeString('fr-FR'),
    };

    const existingSheet = salesData.sheets.find(s => s.date === todayDate);
    let updatedSheet: DailySheet;

    if (existingSheet) {
      updatedSheet = {
        ...existingSheet,
        sales: [...existingSheet.sales, newSale],
      };
      try {
        await updateSheet(existingSheet.id, updatedSheet);
        setSalesData(prev => ({
          ...prev,
          sheets: prev.sheets.map(s => s.id === existingSheet.id ? updatedSheet : s),
        }));
        toast.success("Vente ajoutée avec succès");
      } catch (error) {
        console.error("Error updating sheet:", error);
        toast.error("Erreur lors de l'ajout de la vente");
      }
    } else {
      updatedSheet = {
        id: todayDate,
        date: todayDate,
        sales: [newSale],
      };
      try {
        const createdSheet = await addSheet(updatedSheet);
        setSalesData(prev => ({
          ...prev,
          sheets: [...prev.sheets, createdSheet],
        }));
        toast.success("Vente ajoutée avec succès");
      } catch (error) {
        console.error("Error creating sheet:", error);
        toast.error("Erreur lors de l'ajout de la vente");
      }
    }
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
    toast.success("Fichier CSV exporté avec succès");
  };

  if (loading) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des données...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <SalesView
        games={salesData.games}
        todaySheet={todaySheet}
        onAddSale={handleAddSale}
        onExport={handleExport}
      />
    </Layout>
  );
};

export default Sales;

