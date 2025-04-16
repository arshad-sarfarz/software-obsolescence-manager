
import { useState } from "react";
import { useApplications } from "@/hooks/useApplications";
import { ApplicationsHeader } from "@/components/applications/ApplicationsHeader";
import { ApplicationsSearch } from "@/components/applications/ApplicationsSearch";
import { ApplicationsTable } from "@/components/applications/ApplicationsTable";

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

  return (
    <div className="space-y-6">
      <ApplicationsHeader />
      <ApplicationsSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ApplicationsTable applications={filteredApplications} />
    </div>
  );
}
