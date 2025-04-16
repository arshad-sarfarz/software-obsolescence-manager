
import { Button } from "@/components/ui/button";
import { MonitorPlay } from "lucide-react";
import { Link } from "react-router-dom";

export function ApplicationsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
        <div className="flex items-center space-x-2">
          <Link 
            to="/applications/orphaned"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View orphaned applications
          </Link>
        </div>
      </div>
      <Link to="/applications/create">
        <Button>
          <MonitorPlay className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </Link>
    </div>
  );
}
