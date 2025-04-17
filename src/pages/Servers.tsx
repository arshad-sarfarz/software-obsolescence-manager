
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Server as ServerIcon, MoreHorizontal, Search, AlertTriangle } from "lucide-react";
import { ServerStatusBadge } from "@/components/ui/server-status-badge";
import { SupportStatusBadge } from "@/components/ui/support-status-badge";
import { AddServerModal } from "@/components/servers/AddServerModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Server, Technology, SupportStatus } from "@/types";
import type { Tables } from "@/integrations/supabase/types";

// Define types to match Supabase structure
type SupabaseServer = Tables<'servers'>;
type SupabaseTechnology = Tables<'technologies'>;
type ServerTechnology = {
  server_id: string;
  technology: SupabaseTechnology;
};

export default function Servers() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: serversData = [], isLoading: isLoadingServers } = useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      console.log("Fetching servers...");
      const { data, error } = await supabase
        .from('servers')
        .select('*');
      
      if (error) {
        console.error("Error fetching servers:", error);
        throw error;
      }
      
      console.log("Servers data:", data);
      return data as SupabaseServer[];
    }
  });

  const { data: serverTechnologies = [], isLoading: isLoadingTechnologies } = useQuery({
    queryKey: ['server-technologies'],
    queryFn: async () => {
      console.log("Fetching server technologies...");
      const { data, error } = await supabase
        .from('server_technologies')
        .select(`
          server_id,
          technology:technologies (
            id,
            name,
            version,
            category,
            support_status,
            support_end_date,
            standard_support_end_date,
            extended_support_end_date,
            extended_security_update_end_date
          )
        `);
      
      if (error) {
        console.error("Error fetching server technologies:", error);
        throw error;
      }
      
      console.log("Server technologies data:", data);
      return data as ServerTechnology[];
    }
  });

  const isLoading = isLoadingServers || isLoadingTechnologies;

  // Convert database entities to application types
  const servers: Server[] = serversData.map(server => ({
    id: server.id,
    name: server.name,
    status: server.status,
    owner: server.owner,
    team: server.team,
    comments: server.comments || "",
    technologies: [] // Will be populated by getServerTechnologies
  }));

  const getServerTechnologies = (serverId: string): Technology[] => {
    return serverTechnologies
      .filter(st => st.server_id === serverId)
      .map(st => {
        const techData = st.technology;
        return {
          id: techData.id,
          name: techData.name,
          version: techData.version,
          category: techData.category,
          supportStatus: techData.support_status as SupportStatus,
          supportEndDate: techData.support_end_date || "", // Using a default empty string
          standardSupportEndDate: techData.standard_support_end_date || undefined,
          extendedSupportEndDate: techData.extended_support_end_date || undefined,
          extendedSecurityUpdateEndDate: techData.extended_security_update_end_date || undefined
        };
      });
  };

  const hasEolTechnologies = (serverId: string) => {
    const technologies = getServerTechnologies(serverId);
    return technologies.some(tech => tech.supportStatus === 'EOL');
  };
  
  const filteredServers = servers.filter(server => 
    server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.team.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Servers</h2>
        <AddServerModal />
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search servers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Server Inventory</CardTitle>
          <CardDescription>
            View and manage all servers in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading servers...</div>
          ) : filteredServers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Technologies</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServers.map((server) => {
                  const technologies = getServerTechnologies(server.id);
                  const eolRisk = hasEolTechnologies(server.id);
                  
                  return (
                    <TableRow key={server.id} className={eolRisk && server.status === 'Active' ? "bg-red-50" : ""}>
                      <TableCell className="font-medium">{server.name}</TableCell>
                      <TableCell>
                        <ServerStatusBadge status={server.status} />
                      </TableCell>
                      <TableCell>{server.owner}</TableCell>
                      <TableCell>{server.team}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {technologies.slice(0, 2).map((tech) => (
                            <SupportStatusBadge 
                              key={tech.id} 
                              status={tech.supportStatus} 
                              className="text-xs"
                            />
                          ))}
                          {technologies.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{technologies.length - 2} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {eolRisk && server.status === 'Active' && (
                          <div className="flex items-center text-destructive">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span className="text-xs">EOL Risk</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit server</DropdownMenuItem>
                            <DropdownMenuItem>View remediations</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              No servers found. {searchQuery ? "Try adjusting your search." : "Add a server to get started."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
