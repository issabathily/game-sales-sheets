import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import HistoryView from "@/components/HistoryView";
import { SalesData } from "@/types/sales";
import { loadSalesData } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const History = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("history");
  const [salesData, setSalesData] = useState<SalesData>({ games: [], sheets: [] });
  const [loading, setLoading] = useState(true);

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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
      <HistoryView sheets={salesData.sheets} onSelectDate={() => {}} />
    </Layout>
  );
};

export default History;

