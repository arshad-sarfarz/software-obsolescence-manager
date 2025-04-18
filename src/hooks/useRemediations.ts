
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Remediation } from "@/types";
import { toast } from "@/components/ui/use-toast";

// Type for the database representation of remediation
type DbRemediation = {
  id: string;
  server_id: string | null;
  technology_id: string | null;
  status: "Not started" | "In progress" | "Completed";
  assigned_to: string;
  start_date: string | null;
  target_completion_date: string;
  actual_completion_date: string | null;
  remediation_type: string;
  comments: string | null;
  created_at?: string;
  updated_at?: string;
};

// Convert database remediation to frontend remediation
const mapDbToRemediation = (dbRemediation: DbRemediation): Remediation => {
  return {
    id: dbRemediation.id,
    serverId: dbRemediation.server_id || "",
    technologyId: dbRemediation.technology_id || "",
    status: dbRemediation.status,
    assignedTo: dbRemediation.assigned_to,
    startDate: dbRemediation.start_date || undefined,
    targetCompletionDate: dbRemediation.target_completion_date,
    actualCompletionDate: dbRemediation.actual_completion_date || undefined,
    remediationType: dbRemediation.remediation_type as Remediation['remediationType'],
    comments: dbRemediation.comments || ""
  };
};

// Convert frontend remediation to database format
const mapRemediationToDb = (remediation: Omit<Remediation, 'id'>): Omit<DbRemediation, 'id' | 'created_at' | 'updated_at'> => {
  return {
    server_id: remediation.serverId || null,
    technology_id: remediation.technologyId || null,
    status: remediation.status,
    assigned_to: remediation.assignedTo,
    start_date: remediation.startDate || null,
    target_completion_date: remediation.targetCompletionDate,
    actual_completion_date: remediation.actualCompletionDate || null,
    remediation_type: remediation.remediationType,
    comments: remediation.comments || null
  };
};

export function useRemediations() {
  const queryClient = useQueryClient();
  const [remediations, setRemediations] = useState<Remediation[]>([]);

  // Fetch remediations
  const { isLoading, error, refetch } = useQuery({
    queryKey: ['remediations'],
    queryFn: async () => {
      console.log("Fetching remediations...");
      const { data, error } = await supabase
        .from('remediations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching remediations:", error);
        throw error;
      }
      
      console.log("Remediations data:", data);
      const mappedData = (data as DbRemediation[]).map(mapDbToRemediation);
      setRemediations(mappedData);
      return mappedData;
    }
  });

  // Create remediation mutation
  const createRemediation = useMutation({
    mutationFn: async (newRemediation: Omit<Remediation, 'id'>) => {
      const dbRemediation = mapRemediationToDb(newRemediation);
      console.log("Creating remediation:", dbRemediation);
      
      const { data, error } = await supabase
        .from('remediations')
        .insert(dbRemediation)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating remediation:", error);
        throw error;
      }
      
      return mapDbToRemediation(data as DbRemediation);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['remediations'] });
      setRemediations(prev => [data, ...prev]);
      toast({
        title: "Remediation Created",
        description: "A new remediation has been added successfully."
      });
    },
    onError: (error) => {
      console.error("Error creating remediation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create remediation",
        variant: "destructive"
      });
    }
  });

  // Update remediation mutation
  const updateRemediation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Remediation> & { id: string }) => {
      const dbUpdates = mapRemediationToDb(updates as Omit<Remediation, 'id'>);
      console.log("Updating remediation:", id, dbUpdates);
      
      const { data, error } = await supabase
        .from('remediations')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating remediation:", error);
        throw error;
      }
      
      return mapDbToRemediation(data as DbRemediation);
    },
    onSuccess: (updatedRemediation) => {
      queryClient.invalidateQueries({ queryKey: ['remediations'] });
      setRemediations(prev => 
        prev.map(rem => 
          rem.id === updatedRemediation.id ? updatedRemediation : rem
        )
      );
      toast({
        title: "Remediation Updated",
        description: "The remediation has been updated successfully."
      });
    },
    onError: (error) => {
      console.error("Error updating remediation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update remediation",
        variant: "destructive"
      });
    }
  });

  // Delete remediation mutation
  const deleteRemediation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting remediation:", id);
      const { error } = await supabase
        .from('remediations')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting remediation:", error);
        throw error;
      }
      
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['remediations'] });
      setRemediations(prev => prev.filter(rem => rem.id !== id));
      toast({
        title: "Remediation Deleted",
        description: "The remediation has been deleted successfully."
      });
    },
    onError: (error) => {
      console.error("Error deleting remediation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete remediation",
        variant: "destructive"
      });
    }
  });

  return {
    remediations,
    isLoading,
    error,
    refetch,
    createRemediation: createRemediation.mutate,
    updateRemediation: updateRemediation.mutate,
    deleteRemediation: deleteRemediation.mutate
  };
}
