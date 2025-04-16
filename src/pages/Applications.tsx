
import { useState } from "react";
import { useApplications } from "@/hooks/useApplications";
import { ApplicationsHeader } from "@/components/applications/ApplicationsHeader";
import { ApplicationsSearch } from "@/components/applications/ApplicationsSearch";
import { ApplicationsTable } from "@/components/applications/ApplicationsTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: applications = [], isLoading, error } = useApplications();
  
  // Filter applications based on search query
  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (app.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ApplicationsHeader />
      <ApplicationsSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-2">Loading applications...</span>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load applications. Please try again later.
          </AlertDescription>
        </Alert>
      )}
      
      {!isLoading && !error && applications.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No applications found</AlertTitle>
          <AlertDescription>
            No applications were found in the database. Add some applications to get started.
          </AlertDescription>
        </Alert>
      )}
      
      {!isLoading && !error && applications.length > 0 && (
        <ApplicationsTable applications={filteredApplications} />
      )}
    </div>
  );
}
