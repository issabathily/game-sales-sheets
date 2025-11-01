import { useState } from "react";
import { Game } from "@/types/sales";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

interface SettingsViewProps {
  games: Game[];
  onAddGame: (name: string, price: number) => void;
  onUpdateGame: (id: string, name: string, price: number) => void;
  onDeleteGame: (id: string) => void;
}

const SettingsView = ({ games, onAddGame, onUpdateGame, onDeleteGame }: SettingsViewProps) => {
  const [newGameName, setNewGameName] = useState("");
  const [newGamePrice, setNewGamePrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const handleAddGame = () => {
    if (!newGameName.trim() || !newGamePrice) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const price = parseFloat(newGamePrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Prix invalide");
      return;
    }

    onAddGame(newGameName.trim(), price);
    setNewGameName("");
    setNewGamePrice("");
    toast.success("Jeu ajouté avec succès");
  };

  const handleStartEdit = (game: Game) => {
    setEditingId(game.id);
    setEditName(game.name);
    setEditPrice(game.defaultPrice.toString());
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim() || !editPrice) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const price = parseFloat(editPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Prix invalide");
      return;
    }

    onUpdateGame(id, editName.trim(), price);
    setEditingId(null);
    toast.success("Jeu modifié avec succès");
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce jeu ?")) {
      onDeleteGame(id);
      toast.success("Jeu supprimé");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">Paramètres</h2>
        <p className="text-sm md:text-base text-muted-foreground">Gérez vos jeux et leurs prix par défaut</p>
      </div>

      {/* Add Game Form */}
      <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300">
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Ajouter un jeu</h3>
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">Nom du jeu</label>
            <Input
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              placeholder="Adventure Quest"
            />
          </div>
          
          <div className="w-full md:w-32">
            <label className="text-sm font-medium text-foreground mb-2 block">Prix ($)</label>
            <Input
              type="number"
              step="0.01"
              value={newGamePrice}
              onChange={(e) => setNewGamePrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <Button onClick={handleAddGame} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </Card>

      {/* Games List */}
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="p-4 md:p-6 bg-secondary border-b border-border">
          <h3 className="text-base md:text-lg font-semibold text-foreground">Jeux ({games.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-foreground">Nom</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-foreground">Prix par défaut</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {games.map(game => (
                <tr key={game.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === game.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="max-w-xs"
                      />
                    ) : (
                      <span className="text-xs md:text-sm font-medium text-foreground">{game.name}</span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {editingId === game.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-28 md:w-32"
                      />
                    ) : (
                      <span className="text-xs md:text-sm text-foreground">${game.defaultPrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                    {editingId === game.id ? (
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" onClick={() => handleSaveEdit(game.id)}>
                          Enregistrer
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Annuler
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartEdit(game)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(game.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SettingsView;
