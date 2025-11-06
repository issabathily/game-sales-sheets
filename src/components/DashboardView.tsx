import { DailySheet } from "@/types/sales";
import MetricCard from "./MetricCard";
import { DollarSign, ShoppingCart, TrendingUp, Star, Activity, Calendar, Gamepad2, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";

interface DashboardViewProps {
  sheets: DailySheet[];
  todayDate: string;
}

const COLORS = [
  'hsl(217, 91%, 60%)',
  'hsl(142, 71%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 84%, 60%)',
  'hsl(280, 80%, 60%)',
  'hsl(262, 83%, 58%)',
  'hsl(199, 89%, 48%)'
];

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

  // Calculate average per sale
  const avgPerSale = todayCount > 0 ? todayTotal / todayCount : 0;

  // Sales by game (pie chart)
  const salesByGame: { [key: string]: number } = {};
  todaySheet?.sales.forEach(sale => {
    salesByGame[sale.gameName] = (salesByGame[sale.gameName] || 0) + sale.price;
  });
  
  const pieData = Object.entries(salesByGame)
    .map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100
    }))
    .sort((a, b) => b.value - a.value);

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
      date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      fullDate: dateStr,
      revenue: Math.round(total * 100) / 100,
      sales: count
    });
  }

  // Last 30 days for trend
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(todayDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const sheet = sheets.find(s => s.date === dateStr);
    const total = sheet?.sales.reduce((sum, sale) => sum + sale.price, 0) || 0;
    
    last30Days.push({
      date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      revenue: Math.round(total * 100) / 100,
    });
  }

  // Top games all time
  const allTimeGames: { [key: string]: number } = {};
  sheets.forEach(sheet => {
    sheet.sales.forEach(sale => {
      allTimeGames[sale.gameName] = (allTimeGames[sale.gameName] || 0) + sale.price;
    });
  });
  
  const topGames = Object.entries(allTimeGames)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="p-6 md:p-8 border rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Dashboard
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              {new Date(todayDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid - Enhanced */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Revenus du jour"
          value={`${todayTotal.toFixed(2)}`}
          suffix="FCFA"
          previous={`${yesterdayTotal.toFixed(2)} FCFA`}
          change={`${change}%`}
          trend={todayTotal >= yesterdayTotal ? "up" : "down"}
          icon={<DollarSign className="w-5 h-5 text-orange-500" />}
          iconColor=""
        />
        
        <MetricCard
          title="Ventes du jour"
          value={todayCount.toString()}
          suffix="ventes"
          previous={yesterdayCount.toString()}
          change={`${countChange}%`}
          trend={todayCount >= yesterdayCount ? "up" : "down"}
          icon={<ShoppingCart className="w-5 h-5 text-blue-500" />}
          iconColor=""
        />
        
        <MetricCard
          title="Total général"
          value={`${(allTimeTotal / 1000).toFixed(1)}K`}
          suffix="FCFA"
          previous="Tous les temps"
          change=""
          trend="up"
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          iconColor=""
        />
        
        <MetricCard
          title="Moyenne par vente"
          value={`${avgPerSale.toFixed(0)}`}
          suffix="FCFA"
          previous="Aujourd'hui"
          change=""
          trend="up"
          icon={<Zap className="w-5 h-5 text-purple-500" />}
          iconColor=""
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Trend - Area Chart */}
        <Card className="p-6 md:p-8 border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">Tendance des revenus</h3>
              <p className="text-sm text-muted-foreground">7 derniers jours</p>
            </div>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value.toFixed(2)} FCFA`, 'Revenus']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6 md:p-8 border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">Répartition par jeu</h3>
              <p className="text-sm text-muted-foreground">Aujourd'hui</p>
            </div>
            <Gamepad2 className="w-5 h-5 text-primary" />
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} FCFA`, 'Revenus']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground">
              <Gamepad2 className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Aucune vente aujourd'hui</p>
            </div>
          )}
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Bar Chart - Sales Count */}
        <Card className="p-6 md:p-8 border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">Nombre de ventes</h3>
              <p className="text-sm text-muted-foreground">7 derniers jours</p>
            </div>
            <ShoppingCart className="w-5 h-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="sales" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Games */}
        <Card className="p-6 md:p-8 border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">Top Jeux</h3>
              <p className="text-sm text-muted-foreground">Tous les temps</p>
            </div>
            <Star className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-4">
            {topGames.length > 0 ? (
              topGames.map((game, index) => {
                const percentage = (game.value / allTimeTotal) * 100;
                return (
                  <div key={game.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-orange-500' :
                          index === 1 ? 'bg-slate-500' :
                          index === 2 ? 'bg-amber-600' :
                          'bg-slate-600'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-semibold text-foreground">{game.name}</span>
                      </div>
                      <span className="font-bold text-foreground">{game.value.toFixed(2)} FCFA</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
