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
import { servers, getServerTechnologies } from "@/data/mockData";
import { useState } from "react";
import { Server as ServerIcon, MoreHorizontal, Search, AlertTriangle } from "lucide-react";
import { ServerStatusBadge } from "@/components/ui/server-status-badge";
import { SupportStatusBadge } from "@/components/ui/support-status-badge";
import { AddServerModal } from "@/components/servers/AddServerModal";

export default function Servers() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredServers = servers.filter(server => 
    server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasEolTechnologies = (serverId: string) => {
    const technologies = getServerTechnologies(serverId);
    return technologies.some(tech => tech.supportStatus === 'EOL');
  };
  
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
                const eolRisk = hasEolTechnologies(server.id);
                const technologies = getServerTechnologies(server.id);
                
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
        </CardContent>
      </Card>
    </div>
  );
}
