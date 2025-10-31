import { DailySheet } from "@/types/sales";
import MetricCard from "./MetricCard";
import { DollarSign, ShoppingCart, TrendingUp, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface DashboardViewProps {
  sheets: DailySheet[];
  todayDate: string;
}

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(280, 80%, 60%)'];

const DashboardView = ({ sheets, todayDate }: DashboardViewProps) => {
  const todaySheet = sheets.find(s => s.date === todayDate);
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdaySheet = sheets.find(s => s.date === yesterdayDate.toISOString().split('T')[0]);

  const todayTotal = todaySheet?.sales.reduce((sum, sale) => sum + sale.price, 0) || 0;
  const yesterdayTotal = yesterdaySheet?.sales.reduce((sum, sale) => sum + sale.price, 0) || 0;
  const allTimeTotal = sheets.reduce((sum, sheet) => sum + sheet.sales.reduce((s, sale) => s + sale.price, 0), 0);
  
  const todayCount = todaySheet?.sales.length || 0;
  const yesterdayCount = yesterdaySheet?.sales.length || 0;
  
  const change = yesterdayTotal > 0 ? (((todayTotal - yesterdayTotal) / yesterdayTotal) * 100).toFixed(1) : "0.0";
  const countChange = yesterdayCount > 0 ? (((todayCount - yesterdayCount) / yesterdayCount) * 100).toFixed(1) : "0.0";

  // Sales by game (pie chart)
  const salesByGame: { [key: string]: number } = {};
  todaySheet?.sales.forEach(sale => {
    salesByGame[sale.gameName] = (salesByGame[sale.gameName] || 0) + sale.price;
  });
  
  const pieData = Object.entries(salesByGame).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100
  }));

  // Last 7 days data
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(todayDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const sheet = sheets.find(s => s.date === dateStr);
    const total = sheet?.sales.reduce((sum, sale) => sum + sale.price, 0) || 0;
    const count = sheet?.sales.length || 0;
    
    last7Days.push({
      date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
      revenue: Math.round(total * 100) / 100,
      sales: count
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Vue d'ensemble des ventes du studio</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenus du jour"
          value={`$${todayTotal.toFixed(2)}`}
          previous={`$${yesterdayTotal.toFixed(2)}`}
          change={`${change}%`}
          trend={todayTotal >= yesterdayTotal ? "up" : "down"}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          iconColor="bg-gradient-to-br from-orange-400 to-orange-600"
        />
        
        <MetricCard
          title="Ventes du jour"
          value={todayCount.toString()}
          previous={yesterdayCount.toString()}
          change={`${countChange}%`}
          trend={todayCount >= yesterdayCount ? "up" : "down"}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          iconColor="bg-gradient-to-br from-blue-400 to-blue-600"
        />
        
        <MetricCard
          title="Total général"
          value={`$${allTimeTotal.toFixed(2)}`}
          previous="$0"
          change="100%"
          trend="up"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          iconColor="bg-gradient-to-br from-green-400 to-green-600"
        />
        
        <MetricCard
          title="Jours actifs"
          value={sheets.length.toString()}
          previous={(sheets.length - 1).toString()}
          change="+1"
          trend="up"
          icon={<Star className="w-6 h-6 text-white" />}
          iconColor="bg-gradient-to-br from-pink-400 to-pink-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenus - 7 derniers jours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Répartition par jeu (Aujourd'hui)</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Aucune vente aujourd'hui
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
