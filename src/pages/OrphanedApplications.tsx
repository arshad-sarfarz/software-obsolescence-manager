
import { useApplications } from "@/hooks/useApplications";
import { OrphanedApplicationsTable } from "@/components/applications/OrphanedApplicationsTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrphanedApplications() {
  const { data: applications = [], isLoading, error, isError, refetch } = useApplications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orphaned Applications</h2>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-2">Loading applications...</span>
        </div>
      )}
      
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <div>Failed to load applications. Please try again later.</div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && <OrphanedApplicationsTable applications={applications} />}
    </div>
  );
}
