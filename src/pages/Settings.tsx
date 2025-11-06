import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SettingsView from "@/components/SettingsView";
import { SalesData, Game } from "@/types/sales";
import { User } from "@/types/user";
import { loadSalesData, addGame, updateGame, deleteGame, deleteAllSheets, fetchGerants, fetchUsers, addUser, deleteUser } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const Settings = () => {
  const { isAuthenticated, isProprietaire } = useAuth();
  const [activeTab, setActiveTab] = useState("settings");
  const [salesData, setSalesData] = useState<SalesData>({ games: [], sheets: [] });
  const [gerants, setGerants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [data, gerantsData] = await Promise.all([
          loadSalesData(),
          fetchGerants()
        ]);
        setSalesData(data);
        setGerants(gerantsData);
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

  // Seuls les propriétaires peuvent accéder aux paramètres
  if (!isProprietaire) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Accès refusé</h2>
            <p className="text-muted-foreground">
              Seuls les propriétaires peuvent accéder aux paramètres.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const handleAddGame = async (name: string, defaultPrice: number) => {
    try {
      const newGame = await addGame({ name, defaultPrice });
      setSalesData(prev => ({
        ...prev,
        games: [...prev.games, newGame],
      }));
      toast.success("Jeu ajouté avec succès");
    } catch (error) {
      console.error("Error adding game:", error);
      toast.error("Erreur lors de l'ajout du jeu");
    }
  };

  const handleUpdateGame = async (id: string, name: string, defaultPrice: number) => {
    try {
      const updatedGame = await updateGame(id, { name, defaultPrice });
      setSalesData(prev => ({
        ...prev,
        games: prev.games.map(game => game.id === id ? updatedGame : game),
      }));
      toast.success("Jeu modifié avec succès");
    } catch (error) {
      console.error("Error updating game:", error);
      toast.error("Erreur lors de la modification du jeu");
    }
  };

  const handleDeleteGame = async (id: string) => {
    try {
      await deleteGame(id);
      setSalesData(prev => ({
        ...prev,
        games: prev.games.filter(game => game.id !== id),
      }));
      toast.success("Jeu supprimé avec succès");
    } catch (error) {
      console.error("Error deleting game:", error);
      toast.error("Erreur lors de la suppression du jeu");
    }
  };

  const handleDeleteAllSales = async () => {
    try {
      await deleteAllSheets();
      setSalesData(prev => ({
        ...prev,
        sheets: [],
      }));
      toast.success("Toutes les ventes ont été supprimées avec succès");
    } catch (error) {
      console.error("Error deleting all sales:", error);
      toast.error("Erreur lors de la suppression des ventes");
    }
  };

  const handleAddGerant = async (username: string, password: string, name: string) => {
    try {
      // Vérifier si le nom d'utilisateur existe déjà (tous les utilisateurs)
      const allUsers = await fetchUsers();
      if (allUsers.some(u => u.username === username)) {
        toast.error("Ce nom d'utilisateur existe déjà");
        return;
      }

      const newGerant = await addUser({
        username,
        password,
        name,
        role: "gerant"
      });
      setGerants(prev => [...prev, newGerant]);
      toast.success("Gérant ajouté avec succès");
    } catch (error) {
      console.error("Error adding gerant:", error);
      toast.error("Erreur lors de l'ajout du gérant");
    }
  };

  const handleDeleteGerant = async (id: string) => {
    try {
      await deleteUser(id);
      setGerants(prev => prev.filter(gerant => gerant.id !== id));
      toast.success("Gérant supprimé avec succès");
    } catch (error) {
      console.error("Error deleting gerant:", error);
      toast.error("Erreur lors de la suppression du gérant");
    }
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
      <SettingsView
        games={salesData.games}
        onAddGame={handleAddGame}
        onUpdateGame={handleUpdateGame}
        onDeleteGame={handleDeleteGame}
        onDeleteAllSales={handleDeleteAllSales}
        gerants={gerants}
        onAddGerant={handleAddGerant}
        onDeleteGerant={handleDeleteGerant}
      />
    </Layout>
  );
};

export default Settings;

