
import { Badge } from "@/components/ui/badge";
import { RemediationStatus } from "@/types";
import { cn } from "@/lib/utils";

interface RemediationStatusBadgeProps {
  status: RemediationStatus;
  className?: string;
}

const statusConfig = {
  "Not started": {
    className: "bg-gray-500",
  },
  "In progress": {
    className: "bg-warning",
  },
  "Completed": {
    className: "bg-success",
  },
};

export function RemediationStatusBadge({ status, className }: RemediationStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      className={cn(config.className, className)}
      variant="default"
    >
      {status}
    </Badge>
  );
}
