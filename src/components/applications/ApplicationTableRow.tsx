
import { ApplicationWithRelations } from "@/hooks/useApplications";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertTriangle, MoreHorizontal, ServerIcon } from "lucide-react";

interface ApplicationTableRowProps {
  app: ApplicationWithRelations;
}

export function ApplicationTableRow({ app }: ApplicationTableRowProps) {
  if (!app) {
    console.error('Application data is undefined or null');
    return null;
  }

  // Safe check for technologies
  const hasEolTechnologies = app.technologies && 
    Array.isArray(app.technologies) && 
    app.technologies.some(tech => tech && tech.support_status === 'EOL');

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
    <TableRow className={hasEolTechnologies ? "bg-red-50" : ""}>
      <TableCell>
        <div>
          <div className="font-medium">{app.name || 'Unnamed Application'}</div>
          <div className="text-xs text-muted-foreground">{app.description || 'No description'}</div>
        </div>
      </TableCell>
      <TableCell>{getCriticalityBadge(app.criticality || 'Unknown')}</TableCell>
      <TableCell>{app.owner || 'Unassigned'}</TableCell>
      <TableCell>{app.team || 'No team'}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <ServerIcon className="h-4 w-4 text-muted-foreground" />
          <span>{app.servers && Array.isArray(app.servers) ? app.servers.length : 0}</span>
        </div>
      </TableCell>
      <TableCell>
        {hasEolTechnologies && (
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
}
