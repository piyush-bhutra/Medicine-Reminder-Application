import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

export interface DailyStats {
  taken: number;
  missed: number;
  pending: number;
  total: number;
}

export interface WeeklyStats {
  adherencePercentage: number;
  totalTaken: number;
  totalMissed: number;
  totalScheduled: number;
  dailyBreakdown: { date: string; taken: number; missed: number }[];
}

export const useStats = () => {
  const { user } = useAuth();
  const today = new Date();

  const { data: dailyStats, isLoading: dailyLoading } = useQuery({
    queryKey: ["stats", "daily", user?.id],
    queryFn: async (): Promise<DailyStats> => {
      if (!user) return { taken: 0, missed: 0, pending: 0, total: 0 };
      
      const { data, error } = await supabase
        .from("intake_logs")
        .select("action")
        .gte("scheduled_time", startOfDay(today).toISOString())
        .lte("scheduled_time", endOfDay(today).toISOString());
      
      if (error) throw error;
      
      const stats = {
        taken: data.filter(l => l.action === "taken").length,
        missed: data.filter(l => l.action === "missed").length,
        pending: data.filter(l => l.action === "pending").length,
        total: data.length,
      };
      
      return stats;
    },
    enabled: !!user,
  });

  const { data: weeklyStats, isLoading: weeklyLoading } = useQuery({
    queryKey: ["stats", "weekly", user?.id],
    queryFn: async (): Promise<WeeklyStats> => {
      if (!user) return { 
        adherencePercentage: 0, 
        totalTaken: 0, 
        totalMissed: 0, 
        totalScheduled: 0,
        dailyBreakdown: [] 
      };
      
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);
      
      const { data, error } = await supabase
        .from("intake_logs")
        .select("action, scheduled_time")
        .gte("scheduled_time", weekStart.toISOString())
        .lte("scheduled_time", weekEnd.toISOString());
      
      if (error) throw error;
      
      const totalTaken = data.filter(l => l.action === "taken").length;
      const totalMissed = data.filter(l => l.action === "missed").length;
      const totalScheduled = data.length;
      
      const adherencePercentage = totalScheduled > 0 
        ? Math.round((totalTaken / totalScheduled) * 100) 
        : 0;
      
      // Group by date for daily breakdown
      const dailyMap = new Map<string, { taken: number; missed: number }>();
      data.forEach(log => {
        const date = new Date(log.scheduled_time).toISOString().split('T')[0];
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { taken: 0, missed: 0 });
        }
        const day = dailyMap.get(date)!;
        if (log.action === "taken") day.taken++;
        if (log.action === "missed") day.missed++;
      });
      
      const dailyBreakdown = Array.from(dailyMap.entries()).map(([date, stats]) => ({
        date,
        ...stats,
      }));
      
      return {
        adherencePercentage,
        totalTaken,
        totalMissed,
        totalScheduled,
        dailyBreakdown,
      };
    },
    enabled: !!user,
  });

  return {
    dailyStats: dailyStats ?? { taken: 0, missed: 0, pending: 0, total: 0 },
    weeklyStats: weeklyStats ?? { 
      adherencePercentage: 0, 
      totalTaken: 0, 
      totalMissed: 0, 
      totalScheduled: 0,
      dailyBreakdown: [] 
    },
    isLoading: dailyLoading || weeklyLoading,
  };
};
