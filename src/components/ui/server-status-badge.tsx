
import { Badge } from "@/components/ui/badge";
import { ServerStatus } from "@/types";
import { cn } from "@/lib/utils";

interface ServerStatusBadgeProps {
  status: ServerStatus;
  className?: string;
}

const statusConfig = {
  "Active": {
    className: "bg-success",
  },
  "Upgraded": {
    className: "bg-info",
  },
  "Migrated to cloud": {
    className: "bg-esu",
  },
  "Decommissioned": {
    className: "bg-gray-500",
  },
};

export function ServerStatusBadge({ status, className }: ServerStatusBadgeProps) {
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
