import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { AddAppointmentModal } from "@/components/appointments/AddAppointmentModal";
import { useAppointments } from "@/hooks/useAppointments";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

const Appointments = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { appointments, isLoading, createAppointment, deleteAppointment, updateAppointment } = useAppointments();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" /> Appointments
            </h1>
            <p className="text-muted-foreground">Manage your doctor appointments</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Schedule Appointment
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />)}</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming appointments</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Schedule Your First Appointment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onComplete={() => updateAppointment.mutate({ id: apt.id, is_completed: true })}
                onDelete={() => deleteAppointment.mutate(apt.id)}
              />
            ))}
          </div>
        )}
      </div>

      <AddAppointmentModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={(data) => createAppointment.mutate(data)}
        isLoading={createAppointment.isPending}
      />
    </DashboardLayout>
  );
};

export default Appointments;
