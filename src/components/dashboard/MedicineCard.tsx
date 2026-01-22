import { Medication } from "@/hooks/useMedications";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MedicineCardProps {
  medication: Medication;
  status?: "taken" | "pending" | "missed";
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MedicineCard = ({ 
  medication, 
  status = "pending",
  onEdit, 
  onDelete 
}: MedicineCardProps) => {
  const statusConfig = {
    taken: {
      label: "Taken",
      className: "status-taken",
    },
    pending: {
      label: "Pending",
      className: "status-pending",
    },
    missed: {
      label: "Missed",
      className: "status-missed",
    },
  };

  const config = statusConfig[status];

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground truncate">
                {medication.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {medication.dosage}
              </p>
            </div>
          </div>

          <Badge 
            variant="outline" 
            className={cn("shrink-0", config.className)}
          >
            {config.label}
          </Badge>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {medication.schedule_times.join(", ")}
          </span>
        </div>

        {/* Action buttons - show on hover */}
        <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onEdit}
            >
              <Edit2 className="h-4 w-4" />
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
