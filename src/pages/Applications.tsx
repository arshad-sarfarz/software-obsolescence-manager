
import { useState, useEffect } from "react";
import { useApplications } from "@/hooks/useApplications";
import { ApplicationsHeader } from "@/components/applications/ApplicationsHeader";
import { ApplicationsSearch } from "@/components/applications/ApplicationsSearch";
import { ApplicationsTable } from "@/components/applications/ApplicationsTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: applications = [], isLoading, error, isSuccess } = useApplications();
  
  // State to track if we've already shown the mock data notification
  const [mockDataNotificationShown, setMockDataNotificationShown] = useState(false);
  
  // Check if we're using mock data
  const usingMockData = applications.length > 0 && 
    applications.some(app => typeof app.id === 'string' && app.id.toString().match(/^a\d+$/));
  
  // Show toast notification only once when using mock data
  useEffect(() => {
    if (isSuccess && usingMockData && !mockDataNotificationShown) {
      setMockDataNotificationShown(true);
      toast({
        title: "Using demonstration data",
        description: "No application data found in the database. Showing sample data for demonstration.",
        variant: "default"
      });
      console.log("Toast notification shown for mock data");
    }
  }, [isSuccess, usingMockData, mockDataNotificationShown]);
  
  // Log application data for debugging
  useEffect(() => {
    console.log("Applications in component:", applications);
  }, [applications]);
  
  // Filter applications based on search query
  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (app.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Filtered applications:", filteredApplications);

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
      
      {usingMockData && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle>Using demonstration data</AlertTitle>
          <AlertDescription>
            No application data found in the database. Showing sample data for demonstration purposes.
          </AlertDescription>
        </Alert>
      )}
      
      {!isLoading && !error && applications.length > 0 && (
        <ApplicationsTable applications={filteredApplications} />
      )}
    </div>
  );
}
