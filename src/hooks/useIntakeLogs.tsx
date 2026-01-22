import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface IntakeLog {
  id: string;
  user_id: string;
  medication_id: string;
  scheduled_time: string;
  action: "taken" | "missed" | "snoozed" | "pending";
  actual_time: string | null;
  notes: string | null;
  created_at: string;
}

export interface IntakeLogWithMedication extends IntakeLog {
  medications: {
    name: string;
    dosage: string;
  };
}

export const useIntakeLogs = (dateRange?: { start: Date; end: Date }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ["intake_logs", user?.id, dateRange],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from("intake_logs")
        .select(`
          *,
          medications (name, dosage)
        `)
        .order("scheduled_time", { ascending: false });
      
      if (dateRange) {
        query = query
          .gte("scheduled_time", dateRange.start.toISOString())
          .lte("scheduled_time", dateRange.end.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as IntakeLogWithMedication[];
    },
    enabled: !!user,
  });

  const logIntake = useMutation({
    mutationFn: async ({
      medication_id,
      scheduled_time,
      action,
    }: {
      medication_id: string;
      scheduled_time: Date;
      action: "taken" | "missed" | "snoozed";
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("intake_logs")
        .insert([{
          user_id: user.id,
          medication_id,
          scheduled_time: scheduled_time.toISOString(),
          action,
          actual_time: action === "taken" ? new Date().toISOString() : null,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["intake_logs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      
      const messages = {
        taken: "Great job! Your dose has been recorded.",
        missed: "Dose marked as missed.",
        snoozed: "We'll remind you again in 10 minutes.",
      };
      
      toast({
        title: variables.action === "taken" ? "✓ Dose Taken" : "Dose Updated",
        description: messages[variables.action],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    logs,
    isLoading,
    error,
    logIntake,
  };
};
