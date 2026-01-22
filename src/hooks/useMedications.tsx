import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  schedule_times: string[];
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMedicationData {
  name: string;
  dosage: string;
  frequency: string;
  schedule_times: string[];
  start_date: string;
  end_date?: string | null;
  notes?: string | null;
}

export const useMedications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: medications = [], isLoading, error } = useQuery({
    queryKey: ["medications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Medication[];
    },
    enabled: !!user,
  });

  const createMedication = useMutation({
    mutationFn: async (medication: CreateMedicationData) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("medications")
        .insert([{ ...medication, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast({
        title: "Medication added",
        description: "Your medication has been added successfully.",
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

  const updateMedication = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Medication> & { id: string }) => {
      const { data, error } = await supabase
        .from("medications")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast({
        title: "Medication updated",
        description: "Your medication has been updated successfully.",
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

  const deleteMedication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("medications")
        .update({ is_active: false })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast({
        title: "Medication removed",
        description: "Your medication has been removed.",
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
    medications,
    isLoading,
    error,
    createMedication,
    updateMedication,
    deleteMedication,
  };
};
