import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export default function FloatingActionButton({ onClick, className }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full shadow-lg",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "lg:hidden", // Only show on mobile/tablet
        "flex items-center justify-center",
        "transition-all duration-200 hover:scale-105 active:scale-95",
        className
      )}
      data-testid="floating-action-button"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}
