import { Appointment } from "@/hooks/useAppointments";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Check, Trash2 } from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { cn } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: Appointment;
  onComplete?: () => void;
  onDelete?: () => void;
}

export const AppointmentCard = ({
  appointment,
  onComplete,
  onDelete,
}: AppointmentCardProps) => {
  const appointmentDate = new Date(appointment.date_time);
  const isUpcoming = !isPast(appointmentDate);
  const timeUntil = formatDistanceToNow(appointmentDate, { addSuffix: true });

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 border-border/50",
      isUpcoming 
        ? "hover:shadow-lg hover:border-primary/30" 
        : "opacity-75"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
              isUpcoming ? "bg-primary/10" : "bg-muted"
            )}>
              <Calendar className={cn(
                "h-6 w-6",
                isUpcoming ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground">
                {appointment.doctor_name}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {appointment.purpose}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{format(appointmentDate, "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{format(appointmentDate, "h:mm a")}</span>
                </div>
                {appointment.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{appointment.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isUpcoming && (
            <div className="text-right shrink-0">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {timeUntil}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onComplete && !appointment.is_completed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-success hover:text-success"
              onClick={onComplete}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
