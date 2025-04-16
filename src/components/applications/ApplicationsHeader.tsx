
import { Button } from "@/components/ui/button";
import { MonitorPlay } from "lucide-react";

export function ApplicationsHeader() {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
      <Button>
        <MonitorPlay className="mr-2 h-4 w-4" />
        Add Application
      </Button>
    </div>
  );
}
