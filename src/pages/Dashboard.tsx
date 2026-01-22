import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NextDoseCard } from "@/components/dashboard/NextDoseCard";
import { MedicineCard } from "@/components/dashboard/MedicineCard";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { SuggestionBanner } from "@/components/dashboard/SuggestionBanner";
import { AddMedicineModal } from "@/components/dashboard/AddMedicineModal";
import { useMedications } from "@/hooks/useMedications";
import { useStats } from "@/hooks/useStats";
import { Button } from "@/components/ui/button";
import { Plus, Pill } from "lucide-react";

const Dashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { medications, isLoading, createMedication, deleteMedication } = useMedications();
  const { dailyStats, weeklyStats, isLoading: statsLoading } = useStats();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Manage your medications and track your health</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Medication
          </Button>
        </div>

        <SuggestionBanner
          title="Smart Reminder Suggestion"
          description="You usually take your 9 AM dose around 9:30. Want us to adjust your reminder time?"
        />

        <NextDoseCard medications={medications} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" /> Your Medications
            </h2>
            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />)}
              </div>
            ) : medications.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No medications added yet</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Medication
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {medications.map((med) => (
                  <MedicineCard key={med.id} medication={med} onDelete={() => deleteMedication.mutate(med.id)} />
                ))}
              </div>
            )}
          </div>
          <div><StatsPanel dailyStats={dailyStats} weeklyStats={weeklyStats} isLoading={statsLoading} /></div>
        </div>
      </div>

      <AddMedicineModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={(data) => createMedication.mutate(data)}
        isLoading={createMedication.isPending}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
