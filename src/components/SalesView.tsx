import { useState } from "react";
import { Game, Sale, DailySheet } from "@/types/sales";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";

interface SalesViewProps {
  games: Game[];
  todaySheet: DailySheet;
  onAddSale: (gameId: string, price: number) => void;
  onExport: () => void;
}

const SalesView = ({ games, todaySheet, onAddSale, onExport }: SalesViewProps) => {
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const handleGameSelect = (gameId: string) => {
    setSelectedGameId(gameId);
    const game = games.find(g => g.id === gameId);
    if (game) {
      setPrice(game.defaultPrice.toString());
    }
  };

  const handleAddSale = () => {
    if (!selectedGameId || !price) {
      toast.error("Veuillez sélectionner un jeu et entrer un prix");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Prix invalide");
      return;
    }

    onAddSale(selectedGameId, priceNum);
    setSelectedGameId("");
    setPrice("");
    toast.success("Vente ajoutée avec succès");
  };

  const total = todaySheet.sales.reduce((sum, sale) => sum + sale.price, 0);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">Ventes du jour</h2>
          <p className="text-sm md:text-base text-muted-foreground">{new Date(todaySheet.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Button onClick={onExport} variant="outline" className="w-full md:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Add Sale Form */}
      <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300">
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Ajouter une vente</h3>
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">Jeu</label>
            <Select value={selectedGameId} onValueChange={handleGameSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un jeu" />
              </SelectTrigger>
              <SelectContent>
                {games.map(game => (
                  <SelectItem key={game.id} value={game.id}>
                    {game.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-32">
            <label className="text-sm font-medium text-foreground mb-2 block">Prix ($)</label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <Button onClick={handleAddSale} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </Card>

      {/* Sales Table */}
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-foreground">#</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-foreground">Jeu</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-foreground">Prix</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-foreground">Heure</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-foreground">Total cumulé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {todaySheet.sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 md:px-6 py-8 md:py-12 text-center text-sm md:text-base text-muted-foreground">
                    Aucune vente aujourd'hui
                  </td>
                </tr>
              ) : (
                todaySheet.sales.map((sale, index) => {
                  const cumulativeTotal = todaySheet.sales
                    .slice(0, index + 1)
                    .reduce((sum, s) => sum + s.price, 0);
                  
                  return (
                    <tr key={sale.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-muted-foreground">{index + 1}</td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-foreground">{sale.gameName}</td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-foreground">${sale.price.toFixed(2)}</td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-muted-foreground">{sale.time}</td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold text-foreground text-right">
                        ${cumulativeTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {todaySheet.sales.length > 0 && (
              <tfoot className="bg-secondary">
                <tr>
                  <td colSpan={4} className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold text-foreground">
                    Total du jour
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-base md:text-lg font-bold text-primary text-right">
                    ${total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SalesView;
