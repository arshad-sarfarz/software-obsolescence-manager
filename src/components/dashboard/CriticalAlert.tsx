
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { servers, getServerTechnologies } from "@/data/mockData";

export function CriticalAlert() {
  const serversWithEolTech = servers.filter(server => {
    if (server.status !== 'Active') return false;
    const techs = getServerTechnologies(server.id);
    return techs.some(tech => tech.supportStatus === 'EOL');
  });

  if (serversWithEolTech.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Critical Alert</AlertTitle>
      <AlertDescription>
        {serversWithEolTech.length} active servers are running technologies that have reached End of Life.
      </AlertDescription>
    </Alert>
  );
}
