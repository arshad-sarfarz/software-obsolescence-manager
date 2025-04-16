
import { ApplicationWithRelations } from "@/hooks/useApplications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface OrphanedApplicationsTableProps {
  applications: ApplicationWithRelations[];
}

export function OrphanedApplicationsTable({ applications }: OrphanedApplicationsTableProps) {
  const orphanedApps = applications.filter(
    app => (!app.servers || app.servers.length === 0) && (!app.technologies || app.technologies.length === 0)
  );

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
    <Card>
      <CardHeader>
        <CardTitle>Orphaned Applications</CardTitle>
        <CardDescription>
          Applications without any associated servers or technologies
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
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orphanedApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No orphaned applications found
                </TableCell>
              </TableRow>
            ) : (
              orphanedApps.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{app.name || 'Unnamed Application'}</div>
                      <div className="text-xs text-muted-foreground">{app.description || 'No description'}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getCriticalityBadge(app.criticality)}</TableCell>
                  <TableCell>{app.owner || 'Unassigned'}</TableCell>
                  <TableCell>{app.team || 'No team'}</TableCell>
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
                        <DropdownMenuItem>Add servers</DropdownMenuItem>
                        <DropdownMenuItem>Add technologies</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
