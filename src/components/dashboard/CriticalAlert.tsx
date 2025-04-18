
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CriticalAlert() {
  const { stats } = useDashboardData();
  
  // Find the active servers with EOL technologies
  const { data: serversWithEol = [], isLoading } = useQuery({
    queryKey: ['servers-with-eol'],
    queryFn: async () => {
      // Get all server_technologies with EOL technologies
      const { data: serverTechs, error: techError } = await supabase
        .from('server_technologies')
        .select(`
          server_id,
          technology:technologies (
            id,
            name,
            version,
            support_status,
            category
          )
        `)
        .eq('technology.support_status', 'EOL');
        
      if (techError) throw techError;

      // Get all active servers
      const { data: activeServers, error: serverError } = await supabase
        .from('servers')
        .select('id, name, status')
        .eq('status', 'Active');
        
      if (serverError) throw serverError;
      
      // Filter to find active servers with EOL technologies
      const activeServerIds = new Set(activeServers.map(s => s.id));
      const serversWithEolTech = serverTechs
        .filter(st => activeServerIds.has(st.server_id))
        .map(st => {
          const server = activeServers.find(s => s.id === st.server_id);
          return {
            serverId: st.server_id,
            serverName: server?.name || 'Unknown',
            technologyName: st.technology.name,
            technologyVersion: st.technology.version,
            technologyCategory: st.technology.category
          };
        });
        
      // Group by server
      const serverMap = new Map();
      serversWithEolTech.forEach(item => {
        if (!serverMap.has(item.serverId)) {
          serverMap.set(item.serverId, {
            id: item.serverId,
            name: item.serverName,
            technologies: []
          });
        }
        
        serverMap.get(item.serverId).technologies.push({
          name: item.technologyName,
          version: item.technologyVersion,
          category: item.technologyCategory
        });
      });
      
      return Array.from(serverMap.values());
    },
    enabled: !!stats && stats.serversWithIssues > 0
  });

  if (isLoading || !stats || stats.serversWithIssues === 0) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Critical Alert</AlertTitle>
      <AlertDescription className="space-y-2">
        <div>
          {stats.serversWithIssues} active {stats.serversWithIssues === 1 ? 'server has' : 'servers have'} End-of-Life technologies that require immediate attention.
        </div>
        
        {serversWithEol.length > 0 && (
          <div className="mt-2 space-y-2">
            <div className="font-medium">Affected servers:</div>
            <ul className="list-disc pl-5 space-y-1">
              {serversWithEol.slice(0, 3).map(server => (
                <li key={server.id}>
                  <strong>{server.name}</strong>: {server.technologies.length} EOL {server.technologies.length === 1 ? 'technology' : 'technologies'}
                </li>
              ))}
              {serversWithEol.length > 3 && (
                <li>
                  ...and {serversWithEol.length - 3} more
                </li>
              )}
            </ul>
          </div>
        )}
        
        <div className="flex space-x-2 mt-2">
          <Button size="sm" variant="destructive" asChild>
            <Link to="/remediations">Plan Remediation</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to="/servers">View Servers</Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
