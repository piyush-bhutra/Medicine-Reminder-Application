import { useState, useEffect } from "react";
import { Medication } from "@/hooks/useMedications";
import { useIntakeLogs } from "@/hooks/useIntakeLogs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, Clock, Check, AlarmClock } from "lucide-react";
import { cn } from "@/lib/utils";

interface NextDoseCardProps {
  medications: Medication[];
}

interface UpcomingDose {
  medication: Medication;
  time: string;
  scheduledDateTime: Date;
  minutesUntil: number;
}

export const NextDoseCard = ({ medications }: NextDoseCardProps) => {
  const { logIntake } = useIntakeLogs();
  const [nextDose, setNextDose] = useState<UpcomingDose | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const findNextDose = () => {
      const now = new Date();
      let closestDose: UpcomingDose | null = null;

      medications.forEach((med) => {
        med.schedule_times.forEach((time) => {
          const [hours, minutes] = time.split(":").map(Number);
          const doseTime = new Date(now);
          doseTime.setHours(hours, minutes, 0, 0);

          // If time has passed today, check tomorrow
          if (doseTime < now) {
            doseTime.setDate(doseTime.getDate() + 1);
          }

          const minutesUntil = Math.floor((doseTime.getTime() - now.getTime()) / (1000 * 60));

          if (!closestDose || minutesUntil < closestDose.minutesUntil) {
            closestDose = {
              medication: med,
              time,
              scheduledDateTime: doseTime,
              minutesUntil,
            };
          }
        });
      });

      setNextDose(closestDose);
    };

    findNextDose();
    const interval = setInterval(findNextDose, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [medications]);

  const handleTaken = async () => {
    if (!nextDose) return;
    setIsLoading(true);
    await logIntake.mutateAsync({
      medication_id: nextDose.medication.id,
      scheduled_time: nextDose.scheduledDateTime,
      action: "taken",
    });
    setIsLoading(false);
  };

  const handleSnooze = async () => {
    if (!nextDose) return;
    setIsLoading(true);
    await logIntake.mutateAsync({
      medication_id: nextDose.medication.id,
      scheduled_time: nextDose.scheduledDateTime,
      action: "snoozed",
    });
    setIsLoading(false);
  };

  const formatTimeUntil = (minutes: number) => {
    if (minutes < 60) {
      return `In ${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `In ${hours}h ${mins}m`;
  };

  if (!nextDose) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">All caught up!</h3>
              <p className="text-muted-foreground mt-1">No medications scheduled. Add one to get started.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isUrgent = nextDose.minutesUntil <= 30;

  return (
    <Card className={cn(
      "relative overflow-hidden border-2 transition-all duration-300",
      isUrgent 
        ? "border-warning/50 bg-gradient-to-br from-warning/10 to-warning/5" 
        : "border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5"
    )}>
      {isUrgent && (
        <div className="absolute top-0 right-0 bg-warning text-warning-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
          Coming up soon!
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Medication Info */}
          <div className="flex items-start gap-4">
            <div className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0",
              isUrgent ? "bg-warning/20" : "bg-primary/20"
            )}>
              <Pill className={cn(
                "h-7 w-7",
                isUrgent ? "text-warning" : "text-primary"
              )} />
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Next Dose
              </p>
              <h2 className="font-display text-2xl font-bold text-foreground mt-1">
                {nextDose.medication.name}
              </h2>
              <p className="text-lg text-muted-foreground">
                {nextDose.medication.dosage}
              </p>
            </div>
          </div>

          {/* Time & Actions */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex items-center gap-2">
              <Clock className={cn(
                "h-5 w-5",
                isUrgent ? "text-warning animate-pulse-gentle" : "text-primary"
              )} />
              <span className={cn(
                "font-display text-xl font-semibold",
                isUrgent ? "text-warning" : "text-primary"
              )}>
                {formatTimeUntil(nextDose.minutesUntil)}
              </span>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSnooze}
                disabled={isLoading}
                className="gap-2"
              >
                <AlarmClock className="h-4 w-4" />
                Snooze 10 min
              </Button>
              <Button
                onClick={handleTaken}
                disabled={isLoading}
                className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
              >
                <Check className="h-4 w-4" />
                Mark as Taken
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
