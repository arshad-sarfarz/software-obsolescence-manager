
import { useState } from "react";
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
import { Database, MoreHorizontal, Search, Clock, Loader2, AlertCircle } from "lucide-react";
import { SupportStatusBadge } from "@/components/ui/support-status-badge";
import { AddTechnologyModal } from "@/components/technologies/AddTechnologyModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Technology, SupportStatus } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Technologies() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: technologies = [], isLoading, error, isError, refetch } = useQuery({
    queryKey: ['technologies'],
    queryFn: async () => {
      console.log("Fetching technologies...");
      const { data, error } = await supabase
        .from('technologies')
        .select('*');
      
      if (error) {
        console.error("Error fetching technologies:", error);
        throw error;
      }
      
      console.log("Technologies data:", data);
      
      // Map Supabase format to our application format
      return data.map(tech => ({
        id: tech.id,
        name: tech.name,
        version: tech.version,
        category: tech.category,
        supportStatus: tech.support_status as SupportStatus,
        supportEndDate: tech.support_end_date || "",
        standardSupportEndDate: tech.standard_support_end_date || undefined,
        extendedSupportEndDate: tech.extended_support_end_date || undefined,
        extendedSecurityUpdateEndDate: tech.extended_security_update_end_date || undefined
      })) as Technology[];
    }
  });

  // Query to fetch remediation count per technology
  const { data: remediationCounts = {} } = useQuery({
    queryKey: ['technology-remediations-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('remediations')
        .select('technology_id, id');
      
      if (error) {
        console.error("Error fetching remediation counts:", error);
        throw error;
      }
      
      // Count remediations per technology
      const counts: Record<string, number> = {};
      data.forEach(rem => {
        if (rem.technology_id) {
          counts[rem.technology_id] = (counts[rem.technology_id] || 0) + 1;
        }
      });
      
      return counts;
    }
  });
  
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
        <AddTechnologyModal />
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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="ml-2">Loading technologies...</span>
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="space-y-2">
                <div>Failed to load technologies. Please try again later.</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()}
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          ) : filteredTechnologies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "No technologies match your search criteria." : "No technologies found. Add a technology to get started."}
              </p>
            </div>
          ) : (
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
                  const remediationCount = remediationCounts[tech.id] || 0;
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
                      <TableCell>{remediationCount}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
