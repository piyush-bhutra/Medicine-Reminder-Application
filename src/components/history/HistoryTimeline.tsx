import { IntakeLogWithMedication } from "@/hooks/useIntakeLogs";
import { format } from "date-fns";
import { Check, X, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryTimelineProps {
  logs: IntakeLogWithMedication[];
  isLoading?: boolean;
}

export const HistoryTimeline = ({ logs, isLoading }: HistoryTimelineProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground">No history yet</h3>
        <p className="text-muted-foreground">
          Your medication history will appear here once you start logging doses.
        </p>
      </div>
    );
  }

  const getStatusConfig = (action: string) => {
    switch (action) {
      case "taken":
        return {
          icon: Check,
          color: "text-success",
          bgColor: "bg-success/10",
          borderColor: "border-success/30",
          label: "Taken",
        };
      case "missed":
        return {
          icon: X,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/30",
          label: "Missed",
        };
      case "snoozed":
        return {
          icon: Clock,
          color: "text-pending",
          bgColor: "bg-pending/10",
          borderColor: "border-pending/30",
          label: "Snoozed",
        };
      default:
        return {
          icon: Clock,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          borderColor: "border-border",
          label: "Pending",
        };
    }
  };

  // Group logs by date
  const groupedLogs = logs.reduce((acc, log) => {
    const date = format(new Date(log.scheduled_time), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {} as Record<string, IntakeLogWithMedication[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedLogs).map(([date, dayLogs]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 sticky top-0 bg-background py-1">
            {format(new Date(date), "EEEE, MMMM d, yyyy")}
          </h3>
          
          <div className="relative pl-6 border-l-2 border-border/50 space-y-4">
            {dayLogs.map((log) => {
              const config = getStatusConfig(log.action);
              const Icon = config.icon;
              
              return (
                <div key={log.id} className="relative animate-fade-in">
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute -left-[25px] h-4 w-4 rounded-full border-2",
                      config.bgColor,
                      config.borderColor
                    )}
                  />
                  
                  <div className="bg-card border border-border/50 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", config.bgColor)}>
                          <Icon className={cn("h-4 w-4", config.color)} />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">
                            {log.medications?.name || "Unknown"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {log.medications?.dosage}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={cn("text-sm font-medium", config.color)}>
                          {config.label}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.scheduled_time), "h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
