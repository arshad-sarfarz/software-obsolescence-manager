import { Button } from "@/components/ui/button";
import { MonitorPlay } from "lucide-react";
import { Link } from "react-router-dom";
import { AddApplicationModal } from "./AddApplicationModal";

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
      <AddApplicationModal />
    </div>
  );
}
