import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyStats, WeeklyStats } from "@/hooks/useStats";
import { Check, X, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsPanelProps {
  dailyStats: DailyStats;
  weeklyStats: WeeklyStats;
  isLoading?: boolean;
}

export const StatsPanel = ({ dailyStats, weeklyStats, isLoading }: StatsPanelProps) => {
  const stats = [
    {
      label: "Taken Today",
      value: dailyStats.taken,
      icon: Check,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Missed Today",
      value: dailyStats.missed,
      icon: X,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Pending",
      value: dailyStats.pending,
      icon: Clock,
      color: "text-pending",
      bgColor: "bg-pending/10",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Daily Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    {isLoading ? "-" : stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Adherence */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Weekly Adherence
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-end gap-4">
            <span className="font-display text-4xl font-bold text-foreground">
              {isLoading ? "-" : weeklyStats.adherencePercentage}%
            </span>
            <div className="flex-1 mb-2">
              <div className="h-3 rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${weeklyStats.adherencePercentage}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {weeklyStats.totalTaken} of {weeklyStats.totalScheduled} doses taken this week
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
