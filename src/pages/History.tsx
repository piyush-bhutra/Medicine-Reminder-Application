import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HistoryTimeline } from "@/components/history/HistoryTimeline";
import { useIntakeLogs } from "@/hooks/useIntakeLogs";
import { History as HistoryIcon } from "lucide-react";

const History = () => {
  const { logs, isLoading } = useIntakeLogs();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
            <HistoryIcon className="h-8 w-8 text-primary" /> History
          </h1>
          <p className="text-muted-foreground">Your medication intake history</p>
        </div>
        <HistoryTimeline logs={logs} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default History;
