import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  previous: string;
  change: string;
  trend: "up" | "down";
  icon: ReactNode;
  iconColor: string;
}

const MetricCard = ({ title, value, previous, change, trend, icon, iconColor }: MetricCardProps) => {
  return (
    <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${iconColor} flex items-center justify-center shadow-md transition-transform hover:scale-105`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
          trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        }`}>
          {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend === "up" ? "↑" : "↓"}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
        <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
        <div className="flex items-center gap-2 text-xs md:text-sm pt-2">
          <span className="text-muted-foreground">Précédent</span>
          <span className="font-medium text-foreground">{previous}</span>
          <span className={`font-semibold ${trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
            {change}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
