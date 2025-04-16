
import { ApplicationWithRelations } from "@/hooks/useApplications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApplicationTableRow } from "./ApplicationTableRow";

interface ApplicationsTableProps {
  applications: ApplicationWithRelations[];
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  return (
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
            {applications.map((app) => (
              <ApplicationTableRow key={app.id} app={app} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
