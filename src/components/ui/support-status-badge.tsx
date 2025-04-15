
import { Badge } from "@/components/ui/badge";
import { SupportStatus } from "@/types";
import { cn } from "@/lib/utils";

interface SupportStatusBadgeProps {
  status: SupportStatus;
  className?: string;
}

const statusConfig = {
  EOL: {
    label: "End of Life",
    className: "bg-eol",
  },
  SS: {
    label: "Standard Support",
    className: "bg-ss",
  },
  ES: {
    label: "Extended Support",
    className: "bg-es",
  },
  ESU: {
    label: "Extended Security Updates",
    className: "bg-esu",
  },
};

export function SupportStatusBadge({ status, className }: SupportStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      className={cn(config.className, className)}
      variant="default"
    >
      {config.label}
    </Badge>
  );
}
