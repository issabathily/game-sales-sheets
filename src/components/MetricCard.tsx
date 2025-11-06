import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  suffix?: string;
  previous: string;
  change: string;
  trend: "up" | "down";
  icon: ReactNode;
  iconColor?: string;
}

const MetricCard = ({ title, value, suffix, previous, change, trend, icon }: MetricCardProps) => {
  return (
    <Card className="p-5 md:p-6 border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center justify-center">
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            trend === "up" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
        <div className="flex items-baseline gap-1.5">
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{value}</p>
          {suffix && (
            <span className="text-sm md:text-base font-medium text-muted-foreground">{suffix}</span>
          )}
        </div>
        {previous && (
          <div className="flex items-center gap-2 text-xs md:text-sm pt-1">
            <span className="text-muted-foreground">vs.</span>
            <span className="font-medium text-foreground/70">{previous}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;
