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
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          Trend {trend === "up" ? "↑" : "↓"}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Précédent</span>
          <span className="font-medium text-foreground">{previous}</span>
          <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
            {change}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
