import { DailySheet } from "@/types/sales";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";

interface HistoryViewProps {
  sheets: DailySheet[];
  onSelectDate: (date: string) => void;
}

const HistoryView = ({ sheets, onSelectDate }: HistoryViewProps) => {
  const sortedSheets = [...sheets].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">Historique</h2>
        <p className="text-sm md:text-base text-muted-foreground">Consultez les ventes des jours précédents</p>
      </div>

      {sortedSheets.length === 0 ? (
        <Card className="p-8 md:p-12 text-center hover:shadow-lg transition-all duration-300">
          <Calendar className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm md:text-base text-muted-foreground">Aucun historique disponible</p>
        </Card>
      ) : (
        <Tabs defaultValue={sortedSheets[0]?.date} className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-secondary p-2 rounded-lg">
            {sortedSheets.map(sheet => (
              <TabsTrigger
                key={sheet.date}
                value={sheet.date}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all text-xs md:text-sm"
              >
                {new Date(sheet.date).toLocaleDateString('fr-FR', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </TabsTrigger>
            ))}
          </TabsList>

          {sortedSheets.map(sheet => {
            const total = sheet.sales.reduce((sum, sale) => sum + sale.price, 0);
            
            return (
              <TabsContent key={sheet.date} value={sheet.date}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="p-4 md:p-6 bg-secondary border-b border-border">
                    <h3 className="text-lg md:text-xl font-semibold text-foreground">
                      {new Date(sheet.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      {sheet.sales.length} vente(s) • Total: ${total.toFixed(2)}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary/50">
                        <tr>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-foreground">#</th>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-foreground">Jeu</th>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-foreground">Prix</th>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-foreground">Heure</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {sheet.sales.map((sale, index) => (
                          <tr key={sale.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-muted-foreground">{index + 1}</td>
                            <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-foreground">{sale.gameName}</td>
                            <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-foreground">${sale.price.toFixed(2)}</td>
                            <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-muted-foreground">{sale.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
};

export default HistoryView;
