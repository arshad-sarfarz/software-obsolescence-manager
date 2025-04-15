
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
import { technologies, getRemediationsForTechnology } from "@/data/mockData";
import { useState } from "react";
import { Database, MoreHorizontal, Search, Clock } from "lucide-react";
import { SupportStatusBadge } from "@/components/ui/support-status-badge";

export default function Technologies() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter technologies based on search query
  const filteredTechnologies = technologies.filter(tech => 
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate days until end of support
  const calculateDaysUntil = (dateString: string) => {
    const endDate = new Date(dateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Technologies</h2>
        <Button>
          <Database className="mr-2 h-4 w-4" />
          Add Technology
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search technologies..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Technology Inventory</CardTitle>
          <CardDescription>
            View and manage all technologies in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Support End Date</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Remediations</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnologies.map((tech) => {
                const daysUntilEnd = calculateDaysUntil(tech.supportEndDate);
                const remediations = getRemediationsForTechnology(tech.id);
                const isNegative = daysUntilEnd < 0;
                
                return (
                  <TableRow key={tech.id} className={tech.supportStatus === 'EOL' ? "bg-red-50" : ""}>
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell>{tech.version}</TableCell>
                    <TableCell>{tech.category}</TableCell>
                    <TableCell>
                      <SupportStatusBadge status={tech.supportStatus} />
                    </TableCell>
                    <TableCell>{tech.supportEndDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className={`h-4 w-4 ${isNegative ? "text-red-500" : "text-blue-500"}`} />
                        <span className={isNegative ? "text-red-500" : ""}>
                          {isNegative 
                            ? `${Math.abs(daysUntilEnd)} days ago` 
                            : `${daysUntilEnd} days left`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{remediations.length}</TableCell>
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
                          <DropdownMenuItem>Edit technology</DropdownMenuItem>
                          <DropdownMenuItem>Plan remediation</DropdownMenuItem>
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
