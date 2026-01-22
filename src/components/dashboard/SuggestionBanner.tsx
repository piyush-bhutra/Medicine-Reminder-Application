import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, X, Check } from "lucide-react";
import { useState } from "react";

interface SuggestionBannerProps {
  title: string;
  description: string;
  onAccept?: () => void;
  onDismiss?: () => void;
}

export const SuggestionBanner = ({ 
  title, 
  description, 
  onAccept, 
  onDismiss 
}: SuggestionBannerProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const handleAccept = () => {
    onAccept?.();
    setDismissed(true);
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground">
              {title}
            </h4>
            <p className="text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Dismiss
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="bg-primary hover:bg-primary/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
