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
import { MonitorPlay, MoreHorizontal, Search, AlertTriangle, Server as ServerIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useApplications } from "@/hooks/useApplications";

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: applications = [], isLoading } = useApplications();
  
  // Filter applications based on search query
  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (app.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if application has any EOL technologies
  const hasEolTechnologies = (app: typeof applications[0]) => {
    return app.technologies.some(tech => tech.support_status === 'EOL');
  };
  
  // Get criticality badge styling
  const getCriticalityBadge = (criticality: string) => {
    switch (criticality) {
      case 'Critical':
        return <Badge className="bg-red-500">Critical</Badge>;
      case 'High':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
        <Button>
          <MonitorPlay className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Inventory</CardTitle>
          <CardDescription>
            View and manage all applications in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Criticality</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Servers</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => {
                const eolRisk = hasEolTechnologies(app);
                
                return (
                  <TableRow key={app.id} className={eolRisk ? "bg-red-50" : ""}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{app.name}</div>
                        <div className="text-xs text-muted-foreground">{app.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getCriticalityBadge(app.criticality)}</TableCell>
                    <TableCell>{app.owner}</TableCell>
                    <TableCell>{app.team}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <ServerIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{app.servers.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {eolRisk && (
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
                          <DropdownMenuItem>Edit application</DropdownMenuItem>
                          <DropdownMenuItem>View servers</DropdownMenuItem>
                          <DropdownMenuItem>View technologies</DropdownMenuItem>
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
