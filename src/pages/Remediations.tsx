
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
import { AlertTriangle, MoreHorizontal, Search, Server, Database, Calendar, User, Loader2, AlertCircle } from "lucide-react";
import { RemediationStatusBadge } from "@/components/ui/remediation-status-badge";
import { SupportStatusBadge } from "@/components/ui/support-status-badge";
import { useRemediations } from "@/hooks/useRemediations";
import { RemediationModal } from "@/components/remediations/RemediationModal";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { Remediation } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Remediations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRemediation, setSelectedRemediation] = useState<Remediation | undefined>(undefined);
  
  const { 
    remediations, 
    isLoading, 
    createRemediation, 
    updateRemediation,
    deleteRemediation 
  } = useRemediations();

  // Load server and technology data for display
  const { data: serversMap = {}, isLoading: isLoadingServers } = useQuery({
    queryKey: ['servers-map'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servers')
        .select('id, name');
      
      if (error) throw error;
      
      const serverMap: Record<string, { name: string }> = {};
      data.forEach(server => {
        serverMap[server.id] = { name: server.name };
      });
      
      return serverMap;
    }
  });

  const { data: technologiesMap = {}, isLoading: isLoadingTechnologies } = useQuery({
    queryKey: ['technologies-map'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technologies')
        .select('id, name, version, support_status');
      
      if (error) throw error;
      
      const techMap: Record<string, { name: string, version: string, supportStatus: string }> = {};
      data.forEach(tech => {
        techMap[tech.id] = { 
          name: tech.name, 
          version: tech.version,
          supportStatus: tech.support_status
        };
      });
      
      return techMap;
    }
  });
  
  const filteredRemediations = remediations?.filter(remediation => {
    const server = serversMap[remediation.serverId];
    const technology = technologiesMap[remediation.technologyId];
    
    return (
      (server?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || !server) ||
      (technology?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || !technology) ||
      remediation.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      remediation.remediationType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      remediation.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  const calculateDaysUntil = (dateString?: string) => {
    if (!dateString) return null;
    
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreate = (data: Omit<Remediation, 'id'>) => {
    createRemediation(data);
  };

  const handleUpdate = (data: Omit<Remediation, 'id'> & { id: string }) => {
    updateRemediation(data);
  };

  const handleDelete = (id: string) => {
    deleteRemediation(id);
  };

  const openEditModal = (remediation: Remediation) => {
    setSelectedRemediation(remediation);
    setIsModalOpen(true);
  };

  const isPageLoading = isLoading || isLoadingServers || isLoadingTechnologies;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Remediations</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Remediation
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search remediations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Remediation Planning</CardTitle>
          <CardDescription>
            Track and manage technology remediations across your servers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPageLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="ml-2">Loading remediations...</span>
            </div>
          ) : remediations.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No remediations found</AlertTitle>
              <AlertDescription>
                No remediations have been created yet. Add a remediation to get started.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Server</TableHead>
                  <TableHead>Technology</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Remediation Type</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRemediations.map((remediation) => {
                  const server = serversMap[remediation.serverId];
                  const technology = technologiesMap[remediation.technologyId];
                  const daysUntilTarget = calculateDaysUntil(remediation.targetCompletionDate);
                  
                  return (
                    <TableRow key={remediation.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          <span>{server?.name || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <span>{technology?.name || 'Unknown'} {technology?.version}</span>
                          </div>
                          {technology && (
                            <div className="mt-1">
                              <SupportStatusBadge 
                                status={technology.supportStatus as any} 
                                className="text-xs" 
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <RemediationStatusBadge status={remediation.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{remediation.assignedTo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{remediation.targetCompletionDate}</span>
                          </div>
                          {daysUntilTarget !== null && (
                            <div className={`text-xs ${daysUntilTarget < 0 ? "text-destructive" : ""}`}>
                              {daysUntilTarget < 0 
                                ? `${Math.abs(daysUntilTarget)} days overdue` 
                                : `${daysUntilTarget} days left`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{remediation.remediationType}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditModal(remediation)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(remediation.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <RemediationModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRemediation(undefined);
        }}
        remediation={selectedRemediation}
        onSubmit={selectedRemediation 
          ? (data) => handleUpdate({ ...data, id: selectedRemediation.id }) 
          : handleCreate
        }
      />
    </div>
  );
}
