import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import DashboardView from "@/components/DashboardView";
import { SalesData } from "@/types/sales";
import { loadSalesData, getTodayDate } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
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
      <DashboardView sheets={salesData.sheets} todayDate={todayDate} />
    </Layout>
  );
};

export default Dashboard;

